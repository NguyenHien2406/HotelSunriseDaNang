document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const rememberMe = document.getElementById("rememberMe");
    const message = document.getElementById("message");

    // Hiện / ẩn mật khẩu
    const toggleButtons = document.querySelectorAll(".toggle-password");

    toggleButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const targetId = button.dataset.target;
            const input = document.getElementById(targetId);
            const icon = button.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");

                button.setAttribute("aria-label", "Ẩn mật khẩu");

            } else {

                input.type = "password";

                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");

                button.setAttribute("aria-label", "Hiện mật khẩu");
            }

        });

    });

    // Lấy tài khoản đã ghi nhớ
    const savedEmail = localStorage.getItem("rememberedEmail");

    if (savedEmail) {
        emailInput.value = savedEmail;
        rememberMe.checked = true;
    }

    // Xử lý đăng nhập thực tế kết nối Backend API
    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const usernameOrEmail = emailInput.value.trim();
        const password = passwordInput.value;

        message.textContent = "";
        message.className = "";

        // Kiểm tra dữ liệu
        if (usernameOrEmail === "" || password === "") {
            message.textContent = "Vui lòng nhập đầy đủ thông tin.";
            message.className = "error";
            return;
        }

        // Kiểm tra ghi nhớ đăng nhập
        if (rememberMe.checked) {
            localStorage.setItem("rememberedEmail", usernameOrEmail);
        } else {
            localStorage.removeItem("rememberedEmail");
        }

        try {
            message.textContent = "Đang kết nối đến máy chủ...";
            message.className = "info";

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ usernameOrEmail, password })
            });

            const data = await response.json();

            if (response.ok) {
                message.textContent = "Đăng nhập thành công! Đang chuyển hướng...";
                message.className = "success";

                // Lưu JWT Token và thông tin user vào localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Chuyển hướng sau 1 giây dựa vào role
                setTimeout(() => {
                    if (data.user.role === 'admin') {
                        window.location.href = './Frontend/admin/index.html';
                    } else {
                        window.location.href = 'index.html';
                    }
                }, 1000);

            } else {
                message.textContent = data.message || "Tài khoản hoặc mật khẩu không chính xác!";
                message.className = "error";
            }

        } catch (error) {
            console.error("Lỗi kết nối:", error);
            message.textContent = "Không thể kết nối đến máy chủ Backend!";
            message.className = "error";
        }

    });

    // Quên mật khẩu
    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {
        forgotPassword.addEventListener("click", function (event) {
            event.preventDefault();
            alert("Chức năng quên mật khẩu sẽ được phát triển sau.");
        });
    }

});