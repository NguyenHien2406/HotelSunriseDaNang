// =========================================
// HOTEL SUNRISE - ADMIN DASHBOARD JS
// =========================================

function logoutAdmin() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất khỏi trang quản trị?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "../login.html"; // Điều hướng về trang đăng nhập chung
    }
}