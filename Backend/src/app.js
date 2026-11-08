const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Import database pool để kiểm tra kết nối
require('./config/database');

// Import các routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 1. Phục vụ các file tĩnh trong thư mục Frontend (CSS, JS, assets, các trang con /admin và /user)
app.use('/Frontend', express.static(path.join(__dirname, '../../Frontend')));

// 2. Phục vụ các file HTML ở thư mục gốc (index.html, login.html, register.html)
app.use(express.static(path.join(__dirname, '../../')));

// 3. Khai báo API Routes
app.use('/api/auth', authRoutes);

// 4. Route mặc định trả về trang chủ index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

// 5. Route fallback cho Express v5 (Dùng app.use để bắt tất cả các trang còn lại)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../../index.html'));
});

// Khởi chạy Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});

module.exports = app;