const pool = require('../config/database'); // Hoặc '../config/db' tùy tên file cấu hình của bạn

// 1. LẤY DANH SÁCH ĐẶT PHÒNG CỦA USER ĐANG ĐĂNG NHẬP
exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.user_id; // Lấy từ token đã qua middleware

        const [bookings] = await pool.execute(
            `SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC`,
            [userId]
        );

        res.json({ success: true, data: bookings });
    } catch (error) {
        console.error("Lỗi lấy danh sách đặt phòng:", error);
        res.status(500).json({ message: "Lỗi Server, vui lòng thử lại sau." });
    }
};

// 2. TẠO ĐƠN ĐẶT PHÒNG MỚI
exports.createBooking = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { roomName, checkIn, checkOut, adults, children, rooms, totalPrice, image } = req.body;

        // Tạo mã đặt phòng ngẫu nhiên
        const bookingCode = "SR-" + Math.floor(100000 + Math.random() * 900000);
        const guestCount = Number(adults || 2) + Number(children || 0);

        const query = `
            INSERT INTO bookings 
            (booking_code, user_id, room_name, check_in, check_out, guest_count, rooms_count, total_amount, image_url, booking_status, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', NOW())
        `;

        const [result] = await pool.execute(query, [
            bookingCode,
            userId,
            roomName,
            checkIn,
            checkOut,
            guestCount,
            rooms || 1,
            totalPrice,
            image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&auto=format&fit=crop'
        ]);

        res.status(201).json({ 
            success: true, 
            message: "Đặt phòng thành công!", 
            bookingId: result.insertId,
            bookingCode 
        });

    } catch (error) {
        console.error("Lỗi tạo đơn đặt phòng:", error);
        res.status(500).json({ message: "Lỗi Server, vui lòng thử lại sau." });
    }
};

// 3. HỦY ĐƠN ĐẶT PHÒNG
exports.cancelBooking = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const bookingId = req.params.id;

        // Kiểm tra xem đơn đặt phòng có thuộc về user này không
        const [bookings] = await pool.execute(
            'SELECT * FROM bookings WHERE (booking_id = ? OR booking_code = ?) AND user_id = ?',
            [bookingId, bookingId, userId]
        );

        if (bookings.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng hoặc bạn không có quyền hủy!" });
        }

        await pool.execute(
            `UPDATE bookings SET booking_status = 'cancelled' WHERE booking_id = ? OR booking_code = ?`,
            [bookingId, bookingId]
        );

        res.json({ success: true, message: "Đã hủy đơn đặt phòng thành công." });

    } catch (error) {
        console.error("Lỗi hủy đặt phòng:", error);
        res.status(500).json({ message: "Lỗi Server, vui lòng thử lại sau." });
    }
};