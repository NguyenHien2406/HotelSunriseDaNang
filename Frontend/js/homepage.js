// Menu trên màn hình điện thoại
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", function () {
        navMenu.classList.toggle("show");
    });

    // Đóng menu sau khi chọn liên kết
    document.querySelectorAll(".nav-menu > a").forEach(function (link) {
        link.addEventListener("click", function () {
            navMenu.classList.remove("show");
        });
    });
}

// Thiết lập ngày nhận và trả phòng
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");

if (checkin && checkout) {
    const today = new Date();
    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    checkin.min = localToday;
    checkout.min = localToday;

    checkin.addEventListener("change", function () {
        checkout.min = checkin.value;

        if (checkout.value && checkout.value <= checkin.value) {
            checkout.value = "";
        }
    });
}

// Guest selector popup (Khai báo biến chung để dùng cho cả popup và form submit)
const guestTrigger = document.getElementById("guestTrigger");
const guestPopup = document.getElementById("guestPopup");
const guestDone = document.getElementById("guestDone");
const guestSummary = document.getElementById("guestSummary");

const guestCounts = {
    adults: 2,
    children: 0,
    rooms: 1
};

if (guestTrigger && guestPopup) {
    // Mở hoặc đóng popup
    guestTrigger.addEventListener("click", function () {
        guestPopup.classList.toggle("open");
        guestTrigger.classList.toggle(
            "active",
            guestPopup.classList.contains("open")
        );
    });

    // Cắn sự kiện cho các nút + và −
    document.querySelectorAll("[data-counter]").forEach(function (button) {
        button.addEventListener("click", function () {
            const type = button.dataset.counter;
            const step = Number(button.dataset.step);

            updateGuestCount(type, step);
        });
    });

    // Đóng popup khi bấm Xong
    if (guestDone) {
        guestDone.addEventListener("click", function () {
            guestPopup.classList.remove("open");
            guestTrigger.classList.remove("active");
        });
    }

    // Đóng popup khi click bên ngoài
    document.addEventListener("click", function (event) {
        if (
            !guestPopup.contains(event.target) &&
            !guestTrigger.contains(event.target)
        ) {
            guestPopup.classList.remove("open");
            guestTrigger.classList.remove("active");
        }
    });
}

// Cập nhật giá trị bộ đếm
function updateGuestCount(type, step) {
    const minimums = {
        adults: 1,
        children: 0,
        rooms: 1
    };

    const maximums = {
        adults: 20,
        children: 10,
        rooms: 10
    };

    guestCounts[type] += step;

    if (guestCounts[type] < minimums[type]) {
        guestCounts[type] = minimums[type];
    }

    if (guestCounts[type] > maximums[type]) {
        guestCounts[type] = maximums[type];
    }

    const valueEl = document.getElementById(type + "Value");
    if (valueEl) {
        valueEl.textContent = guestCounts[type];
    }

    updateGuestSummary();
}

// Cập nhật nội dung tóm tắt
function updateGuestSummary() {
    if (!guestSummary) return;
    const totalGuests = guestCounts.adults + guestCounts.children;
    guestSummary.textContent = `${totalGuests} khách · ${guestCounts.rooms} phòng`;
}

// Tìm phòng demo
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (checkin && checkout && checkout.value <= checkin.value) {
            alert("Ngày trả phòng phải sau ngày nhận phòng!");
            return;
        }

        const totalGuests = guestCounts.adults + guestCounts.children;
        const businessTrip = document.getElementById("businessTrip")?.checked ? "Có" : "Không";
        const withPet = document.getElementById("withPet")?.checked ? "Có" : "Không";

        alert(
            "Thông tin tìm phòng:\n" +
            "📅 Ngày nhận: " + (checkin ? checkin.value : "") + "\n" +
            "📅 Ngày trả: " + (checkout ? checkout.value : "") + "\n" +
            "👥 Số khách: " + totalGuests + " (Người lớn: " + guestCounts.adults + ", Trẻ em: " + guestCounts.children + ")\n" +
            "🛏️ Số phòng: " + guestCounts.rooms + "\n" +
            "💼 Đi công tác: " + businessTrip + "\n" +
            "🐾 Mang thú cưng: " + withPet
        );
        
        // Sau này khi làm tính năng tìm phòng thực tế, bạn có thể gọi API fetch ở đây gửi dữ liệu lên Backend!
    });
}

// Nút mũi tên trên banner
const hero = document.querySelector(".hero");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");

const heroImages = [
    "Frontend/assets/images/danang-hero.jpg",
    "Frontend/assets/images/danang-hero-2.jpg"
];

let currentHero = 0;

function changeHero(direction) {
    if (!hero || heroImages.length === 0) return;
    currentHero += direction;

    if (currentHero >= heroImages.length) {
        currentHero = 0;
    }

    if (currentHero < 0) {
        currentHero = heroImages.length - 1;
    }

    hero.style.backgroundImage =
        `linear-gradient(rgba(9, 34, 68, 0.18), rgba(9, 34, 68, 0.3)),
         url("${heroImages[currentHero]}")`;
}

if (heroPrev && heroNext) {
    heroPrev.addEventListener("click", function () {
        changeHero(-1);
    });

    heroNext.addEventListener("click", function () {
        changeHero(1);
    });
}

// Chuyển ảnh trong các hạng phòng nổi bật
const roomImages = {
    standard: [
        "Frontend/assets/images/room-standard.jpg",
        "Frontend/assets/images/room-standard1.jpg",
        "Frontend/assets/images/room-standard2.jpg",
        "Frontend/assets/images/room-standard3.jpg"
    ],
    premium: [
        "Frontend/assets/images/room-premium.jpg",
        "Frontend/assets/images/room-premium1.jpg",
        "Frontend/assets/images/room-premium2.jpg",
        "Frontend/assets/images/room-premium3.jpg"
    ],
    deluxe: [
        "Frontend/assets/images/room-deluxe.jpg",
        "Frontend/assets/images/room-deluxe1.jpg",
        "Frontend/assets/images/room-deluxe2.jpg",
        "Frontend/assets/images/room-deluxe3.jpg"
    ],
    suite: [
        "Frontend/assets/images/room-suite.jpg",
        "Frontend/assets/images/room-suite1.jpg",
        "Frontend/assets/images/room-suite2.jpg",
        "Frontend/assets/images/room-suite3.jpg"
    ]
};

document.querySelectorAll(".room-card").forEach(function (card) {
    const image = card.querySelector("img");
    const arrow = card.querySelector(".room-arrow");

    if (!image || !arrow) return;

    const roomType = Object.keys(roomImages).find(function (type) {
        return image.getAttribute("src").includes(`room-${type}`);
    });

    if (!roomType) return;

    const images = roomImages[roomType];
    let currentIndex = 0;

    arrow.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % images.length;
        image.src = images[currentIndex];
    });
});
// ==========================================
// HIỂN THỊ ICON TÀI KHOẢN & TRANG CÁ NHÂN TRÊN NAVBAR
// ==========================================
document.addEventListener("DOMContentLoaded", function () {
    const authContainer = document.getElementById("authMenuContainer");
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr && authContainer) {
        try {
            const user = JSON.parse(userStr);
            const displayName = user.fullname || user.username || "Tài khoản";
            
            // Lấy chữ cái đầu tiên của tên để làm avatar chữ cái
            const firstLetter = displayName.charAt(0).toUpperCase();

            // Thay đổi giao diện thành Icon tài khoản + Tên + Menu dropdown / Nút bấm
            authContainer.innerHTML = `
                <div class="user-account-wrapper" style="position: relative; display: inline-block;">
                    <a href="./Frontend/user/profile.html" id="accountProfileLink" style="display: flex; align-items: center; gap: 8px; text-decoration: none; background: #f0f4f8; padding: 5px 12px; border-radius: 30px; transition: background 0.3s;">
                        <!-- Icon Avatar tròn -->
                        <div style="width: 32px; height: 32px; background-color: #092244; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px;">
                            ${firstLetter}
                        </div>
                        <span style="font-weight: 500; color: #092244; font-size: 14px;">${displayName}</span>
                    </a>
                </div>
                <button id="navLogoutBtn" style="padding: 6px 12px; background-color: #dc2626; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500;">Đăng xuất</button>
            `;

            // Xử lý sự kiện đăng xuất
            document.getElementById("navLogoutBtn").addEventListener("click", function () {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                alert("Đăng xuất thành công!");
                window.location.reload(); 
            });

        } catch (e) {
            console.error("Lỗi phân tích thông tin user từ localStorage:", e);
        }
    }
});