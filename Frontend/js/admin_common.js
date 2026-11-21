// =========================================
// HOTEL SUNRISE - ADMIN COMMON JS
// =========================================

function logoutAdmin() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "../login.html";
    }
}

function openAddRoomModal() {
    alert("Chức năng mở modal thêm phòng mới đang được phát triển kết nối API.");
}