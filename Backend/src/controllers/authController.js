const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sunrise_danang_secret_key_2026';

// 1. ĐĂNG KÝ TÀI KHOẢN
exports.register = async (req, res) => {
    try {
        const { username, fullname, email, phone, password } = req.body;

        const [existing] = await pool.execute(
            'SELECT * FROM users WHERE username = ? OR email = ? OR phone = ?',
            [username, email, phone]
        );

        if (existing.length > 0) {
            return res.status(400).json({ 
                message: "Tên đăng nhập, Email hoặc Số điện thoại đã được sử dụng!" 
            });
        }

        const salt = await bcrypt.genSalt(12);
        const password_hash = await bcrypt.hash(password, salt);

        await pool.execute(
            `INSERT INTO users (username, password_hash, full_name, email, phone, role, status) 
             VALUES (?, ?, ?, ?, ?, 'user', 'active')`,
            [username, password_hash, fullname, email, phone]
        );

        res.status(201).json({ message: "Đăng ký tài khoản thành công!" });

    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        res.status(500).json({ message: "Lỗi Server, vui lòng thử lại sau." });
    }
};

// 2. ĐĂNG NHẬP
exports.login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        const [users] = await pool.execute(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [usernameOrEmail, usernameOrEmail]
        );

        if (users.length === 0) {
            return res.status(400).json({ message: "Tài khoản hoặc mật khẩu không chính xác!" });
        }

        const user = users[0];

        if (user.status !== 'active') {
            return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Tài khoản hoặc mật khẩu không chính xác!" });
        }

        const token = jwt.sign(
            { user_id: user.user_id, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: "Đăng nhập thành công!",
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Lỗi đăng nhập:", error);
        res.status(500).json({ message: "Lỗi Server, vui lòng thử lại sau." });
    }
};