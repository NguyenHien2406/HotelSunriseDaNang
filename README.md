# 🌊 Hotel Sunrise Đà Nẵng (Sunrise Đà Nẵng)

<p align="center">
  <b>Hệ thống Quản lý và Đặt phòng Khách sạn ven biển Đà Nẵng</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-brightgreen.svg" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/Tech-Fullstack-orange.svg" alt="Tech">
</p>

---

## 📖 Giới thiệu về dự án

**Hotel Sunrise Đà Nẵng** là ứng dụng web quản lý và đặt phòng khách sạn, được phát triển nhằm tối ưu hóa quy trình vận hành khách sạn, hỗ trợ nhân viên quản lý phòng, theo dõi thông tin khách hàng, đơn đặt phòng và hóa đơn một cách nhanh chóng, minh bạch.

Dự án mô phỏng hệ thống thực tế với giao diện trực quan và kiến trúc Full-stack phân tách rõ ràng giữa Front-end và Back-end.

---

## 🚀 Các tính năng chính (Features)

- **🔐 Xác thực hệ thống:** Phân quyền đăng nhập an toàn cho quản lý và nhân viên.
- **📊 Trang tổng quan (Dashboard):** Thống kê trực quan số liệu kinh doanh, doanh thu và tình trạng phòng theo thời gian thực.
- **🛏️ Quản lý phòng (Rooms Management):** Thêm, sửa, xóa, cập nhật thông tin và trạng thái phòng (Trống, Đang thuê, Đang dọn dẹp).
- **📅 Quản lý đặt phòng (Bookings):** Theo dõi lịch đặt phòng, thời gian check-in/check-out của khách hàng.
- **👥 Quản lý khách hàng:** Lưu trữ thông tin liên lạc và lịch sử lưu trú.
- **💰 Quản lý hóa đơn:** Tạo và theo dõi trạng thái thanh toán dịch vụ.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

### **Frontend**

- **HTML5, CSS3, JavaScript (ES6+)**: Xây dựng giao diện cấu trúc đa trang (Multi-page App).
- **Fetch API / Axios**: Giao tiếp bất đồng bộ với Back-end RESTful API.

### **Backend**

- **Node.js & Express.js**: Xây dựng máy chủ API RESTful mạnh mẽ.
- **MySQL**: Cơ sở dữ liệu MySQL lưu trữ thông tin linh hoạt.

---

## 📂 Cấu trúc thư mục dự án (Directory Structure)

```text
HotelSunriseDaNang/
│
├── index.html                          # Trang chủ công khai dành cho User (Khách hàng)
├── login.html                          # Trang đăng nhập chung (Phân luồng theo Role)
├── register.html                       # Trang đăng ký tài khoản User mới
│
├── Frontend/                           # Thư mục chứa giao diện (Client-side)
│   │
│   ├── admin/                          # 🔒 KHU VỰC DÀNH RIÊNG CHO ADMIN (Quản trị viên nội bộ)
│   │   ├── dashboard.html              # Trang tổng quan thống kê doanh thu
│   │   ├── rooms-manage.html           # Quản lý, thêm/sửa/xóa phòng khách sạn
│   │   ├── bookings-manage.html        # Quản lý danh sách đơn đặt phòng của khách
│   │   ├── customers-manage.html       # Quản lý thông tin khách hàng
│   │   ├── employees-manage.html       # Quản lý nhân viên công ty
│   │   └── invoices-manage.html        # Quản lý hóa đơn & thanh toán
│   │
│   ├── user/                           # 🌐 KHU VỰC DÀNH CHO USER (Khách hàng đặt phòng)
│   │   ├── search.html                 # Trang tìm kiếm & lọc phòng khách sạn
│   │   ├── room-detail.html            # Trang chi tiết phòng & tiện ích
│   │   ├── my-bookings.html            # Lịch sử đặt phòng của cá nhân khách hàng
│   │   └── profile.html                # Thông tin tài khoản cá nhân
│   │
│   ├── css/                            # File định dạng giao diện chung & riêng
│   │   ├── style.css                   # CSS toàn hệ thống
│   │   ├── admin.css                   # Giao diện trang quản trị
│   │   └── user.css                    # Giao diện trang khách hàng
│   │
│   ├── js/                             # Xử lý logic phía Frontend
│   │   ├── api.js                      # Cấu hình Axios/Fetch kèm gắn Token tự động
│   │   ├── auth.js                     # Xử lý đăng nhập, lưu Token và phân quyền (Role Check)
│   │   ├── admin-guard.js              # Kiểm tra quyền Admin trước khi vào trang quản trị
│   │   ├── room-client.js              # Xử lý hiển thị phòng cho khách hàng
│   │   └── booking-client.js           # Xử lý form đặt phòng
│   │
│   └── assets/                         # Tài nguyên đồ họa
│       ├── images/                     # Ảnh phòng, banner công ty, logo
│       └── icons/                      # Biểu tượng giao diện
│
├── Backend/                            # Thư mục máy chủ (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js             # Kết nối cơ sở dữ liệu MongoDB
│   │   ├── models/                     # Định nghĩa Schema CSDL
│   │   │   ├── User.js                 # Model Người dùng (Lưu trường role: 'admin' | 'user')
│   │   │   ├── Room.js                 # Model Phòng khách sạn
│   │   │   └── Booking.js              # Model Đặt phòng
│   │   ├── middleware/
│   │   │   └── authMiddleware.js       # Middleware kiểm tra Token và phân quyền (verifyAdmin)
│   │   ├── routes/                     # Định tuyến API
│   │   │   ├── authRoutes.js           # API Đăng nhập / Đăng ký
│   │   │   ├── roomRoutes.js           # API Phòng (User xem, Admin CRUD)
│   │   │   └── bookingRoutes.js        # API Đặt phòng
│   │   ├── controllers/                # Xử lý logic nghiệp vụ từng module
│   │   │   ├── authController.js
│   │   │   ├── roomController.js
│   │   │   └── bookingController.js
│   │   └── app.js                      # Khởi tạo Express Server chính
│   │
│   ├── .env                            # Biến môi trường (PORT, MONGO_URI, JWT_SECRET)
│   └── package.json                    # Quản lý thư viện Backend
│
└── README.md                           # Tài liệu mô tả dự án
```

## 🗄️ Sơ đồ cơ sở dữ liệu (Database ERD)

Hệ thống sử dụng cơ sở dữ liệu MySQL để quản lý thông tin tài khoản, phòng khách sạn, đặt phòng, thanh toán và ví điện tử.

Sơ đồ ERD thể hiện cấu trúc các bảng, khóa chính (Primary Key), khóa ngoại (Foreign Key) và mối quan hệ giữa các thực thể trong hệ thống.

<p align="center">
  <img
    src="Frontend/assets/data_image/database.png"
    alt="Hotel Sunrise Database ERD"
    width="100%"
  />
</p>

<p align="center">
  <i>Hình: Sơ đồ thực thể liên kết cơ sở dữ liệu Hotel Sunrise Đà Nẵng</i>
</p>
