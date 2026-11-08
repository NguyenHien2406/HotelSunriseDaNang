const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

// =========================
// HIỆN / ẨN MẬT KHẨU
// =========================

document.querySelectorAll(".toggle-password")
    .forEach(button => {

        button.addEventListener("click", function () {

            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");

                this.setAttribute(
                    "aria-label",
                    "Ẩn mật khẩu"
                );

            } else {

                input.type = "password";

                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");

                this.setAttribute(
                    "aria-label",
                    "Hiện mật khẩu"
                );
            }
        });
    });

// =========================
// XỬ LÝ ĐĂNG KÝ
// =========================

registerForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const fullname = document
        .getElementById("fullname")
        .value.trim();

    const email = document
        .getElementById("email")
        .value.trim();

    const phone = document
        .getElementById("phone")
        .value.trim();

    const password = document
        .getElementById("password")
        .value;

    const confirmPassword = document
        .getElementById("confirmPassword")
        .value;

    message.style.color = "#dc2626";

    // Kiểm tra họ tên
    if (fullname.length < 2) {
        message.textContent = "Vui lòng nhập họ tên hợp lệ!";
        return;
    }

    // Kiểm tra số điện thoại
    if (!/^(0[0-9]{9,10})$/.test(phone)) {
        message.textContent = "Số điện thoại không hợp lệ!";
        return;
    }

    // Kiểm tra mật khẩu
    if (password.length < 8) {
        message.textContent = "Mật khẩu phải có ít nhất 8 ký tự!";
        return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
        message.textContent = "Mật khẩu xác nhận không khớp!";
        return;
    }

    // Tạo username tự động từ email (lấy phần trước dấu @ kèm chuỗi ngẫu nhiên để tránh trùng)
    const username = email.split('@')[0] + "_" + Math.floor(Math.random() * 1000);

    try {
        message.style.color = "#2563eb";
        message.textContent = "Đang kết nối đến máy chủ...";

        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                fullname,
                email,
                phone,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = "#15803d";
            message.textContent = "Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...";

            // Chuyển hướng sang trang login sau 1.5 giây
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            message.style.color = "#dc2626";
            message.textContent = data.message || "Đăng ký thất bại, vui lòng thử lại!";
        }

    } catch (error) {
        console.error("Lỗi kết nối:", error);
        message.style.color = "#dc2626";
        message.textContent = "Không thể kết nối đến máy chủ Backend!";
    }
});