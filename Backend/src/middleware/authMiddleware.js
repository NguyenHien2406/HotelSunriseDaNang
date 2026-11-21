const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'sunrise_danang_secret_key_2026';

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ dạng "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Không tìm thấy token xác thực, vui lòng đăng nhập lại!" });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        }
        req.user = user; // Gắn thông tin user (user_id, role) vào request
        next();
    });
};