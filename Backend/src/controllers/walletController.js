const pool = require('../config/database');

// 1. LẤY SỐ DƯ VÍ VÀ LỊCH SỬ GIAO DỊCH
exports.getWalletInfo = async (req, res) => {
    try {
        const userId = req.user.user_id;

        // Kiểm tra xem user đã có tài khoản ví trong bảng wallet_accounts chưa
        let [wallets] = await pool.execute(
            'SELECT * FROM wallet_accounts WHERE user_id = ?',
            [userId]
        );

        let wallet;
        if (wallets.length === 0) {
            // Nếu chưa có, tự động tạo mới ví với số dư 0đ
            const [result] = await pool.execute(
                'INSERT INTO wallet_accounts (user_id, balance, currency) VALUES (?, 0.00, "VND")',
                [userId]
            );
            wallet = { wallet_id: result.insertId, user_id: userId, balance: 0 };
        } else {
            wallet = wallets[0];
        }

        // Lấy lịch sử giao dịch của ví từ bảng wallet_transactions chuẩn
        const [transactions] = await pool.execute(
            'SELECT * FROM wallet_transactions WHERE wallet_id = ? ORDER BY created_at DESC',
            [wallet.wallet_id]
        );

        // Map lại dữ liệu để tương thích mượt mà với Frontend hiện tại
        const formattedTransactions = transactions.map(tx => ({
            id: tx.reference_code || `#TX-${tx.wallet_transaction_id}`,
            description: tx.description,
            amount: (tx.direction === 'credit' ? '+' : '-') + Number(tx.amount).toLocaleString('vi-VN') + 'đ',
            date: new Date(tx.created_at).toLocaleString('vi-VN'),
            status: 'Thành công'
        }));

        res.json({
            success: true,
            balance: wallet.balance,
            history: formattedTransactions
        });

    } catch (error) {
        console.error("Lỗi lấy thông tin ví:", error);
        res.status(500).json({ message: "Lỗi Server, vui lòng thử lại sau." });
    }
};

// 2. NẠP TIỀN VÀO VÍ
exports.topupWallet = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const userId = req.user.user_id;
        const { amount, method } = req.body;

        if (!amount || amount <= 0) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ success: false, message: "Số tiền nạp không hợp lệ!" });
        }

        // Lấy ví của user
        let [wallets] = await connection.execute('SELECT * FROM wallet_accounts WHERE user_id = ?', [userId]);
        let walletId;
        let currentBalance = 0;

        if (wallets.length === 0) {
            const [result] = await connection.execute(
                'INSERT INTO wallet_accounts (user_id, balance, currency) VALUES (?, 0.00, "VND")',
                [userId]
            );
            walletId = result.insertId;
        } else {
            walletId = wallets[0].wallet_id;
            currentBalance = Number(wallets[0].balance);
        }

        // Cập nhật số dư ví
        const newBalance = currentBalance + Number(amount);
        await connection.execute('UPDATE wallet_accounts SET balance = ? WHERE wallet_id = ?', [newBalance, walletId]);

        // Ghi lại lịch sử giao dịch ví vào bảng wallet_transactions chuẩn
        const referenceCode = "#GD" + Math.floor(100000 + Math.random() * 900000);
        const description = `Nạp tiền qua ${method || 'Chuyển khoản Ngân hàng'}`;

        await connection.execute(
            `INSERT INTO wallet_transactions 
            (wallet_id, transaction_type, direction, amount, reference_code, description, created_by, created_at) 
            VALUES (?, 'deposit', 'credit', ?, ?, ?, ?, NOW())`,
            [walletId, amount, referenceCode, description, userId]
        );

        await connection.commit();
        connection.release();

        res.json({
            success: true,
            message: "Nạp tiền vào ví thành công!",
            balance: newBalance
        });

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Lỗi nạp tiền ví:", error);
        res.status(500).json({ success: false, message: "Lỗi Server: " + error.message });
    }
};

// 3. THANH TOÁN ĐƠN ĐẶT PHÒNG BẰNG VÍ
exports.payBookingWithWallet = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const userId = req.user.user_id;
        const { bookingId } = req.body;

        // 1. Kiểm tra đơn đặt phòng
        const [bookings] = await connection.execute(
            'SELECT * FROM bookings WHERE booking_id = ? AND user_id = ?',
            [bookingId, userId]
        );

        if (bookings.length === 0) {
            await connection.rollback();
            connection.release();
            return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng!" });
        }

        const booking = bookings[0];
        if (booking.booking_status === 'paid' || booking.booking_status === 'completed') {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: "Đơn đặt phòng này đã được thanh toán rồi!" });
        }

        // 2. Kiểm tra số dư ví
        const [wallets] = await connection.execute('SELECT * FROM wallet_accounts WHERE user_id = ?', [userId]);
        if (wallets.length === 0 || Number(wallets[0].balance) < Number(booking.total_amount)) {
            await connection.rollback();
            connection.release();
            return res.status(400).json({ message: "Số dư ví không đủ để thanh toán!" });
        }

        const wallet = wallets[0];
        const newBalance = Number(wallet.balance) - Number(booking.total_amount);

        // 3. Trừ tiền ví
        await connection.execute('UPDATE wallet_accounts SET balance = ? WHERE wallet_id = ?', [newBalance, wallet.wallet_id]);

        // 4. Cập nhật trạng thái đơn phòng thành 'paid'
        await connection.execute("UPDATE bookings SET booking_status = 'paid' WHERE booking_id = ?", [bookingId]);

        // 5. Thêm giao dịch trừ tiền vào lịch sử ví (wallet_transactions chuẩn)
        const referenceCode = "#HD-" + Math.floor(100000 + Math.random() * 900000);
        const description = `Thanh toán phòng ${booking.room_name || 'Sunrise'} (#${booking.booking_code || booking.booking_id})`;

        await connection.execute(
            `INSERT INTO wallet_transactions 
            (wallet_id, transaction_type, direction, amount, reference_code, description, created_by, created_at) 
            VALUES (?, 'booking_payment', 'debit', ?, ?, ?, ?, NOW())`,
            [wallet.wallet_id, booking.total_amount, referenceCode, description, userId]
        );

        // 6. Ghi vào bảng lịch sử thanh toán chung (payments)
        await connection.execute(
            `INSERT INTO payments (user_id, booking_id, payment_code, description, amount, payment_status, created_at) 
             VALUES (?, ?, ?, ?, ?, 'Thành công', NOW())`,
            [userId, bookingId, referenceCode, description, booking.total_amount]
        );

        await connection.commit();
        connection.release();

        res.json({ success: true, message: "Thanh toán đơn phòng thành công từ ví!" });

    } catch (error) {
        await connection.rollback();
        connection.release();
        console.error("Lỗi thanh toán ví:", error);
        res.status(500).json({ message: "Lỗi Server, vui lòng thử lại sau." });
    }
};