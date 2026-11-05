
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

    // Xử lý đăng nhập
    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        message.textContent = "";
        message.className = "";

        // Kiểm tra dữ liệu
        if (email === "" || password === "") {

            message.textContent = "Vui lòng nhập đầy đủ thông tin.";
            message.className = "error";

            return;
        }

        // Kiểm tra ghi nhớ đăng nhập
        if (rememberMe.checked) {

            localStorage.setItem("rememberedEmail", email);

        } else {

            localStorage.removeItem("rememberedEmail");
        }

        // Demo giao diện
        message.textContent =
            "Giao diện đã nhận thông tin đăng nhập. Cần kết nối API để xác thực tài khoản.";

        message.className = "success";

    });

    // Quên mật khẩu
    const forgotPassword =
        document.getElementById("forgotPassword");

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();

        alert(
            "Chức năng quên mật khẩu sẽ được phát triển sau."
        );

    });

});
