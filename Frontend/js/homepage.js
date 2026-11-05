// Menu trên màn hình điện thoại
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("show");
});

// Đóng menu sau khi chọn liên kết
document.querySelectorAll(".nav-menu > a").forEach(function (link) {
    link.addEventListener("click", function () {
        navMenu.classList.remove("show");
    });
});

// Thiết lập ngày nhận và trả phòng
const checkin = document.getElementById("checkin");
const checkout = document.getElementById("checkout");

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

// Tìm phòng demo
const bookingForm = document.getElementById("bookingForm");

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (checkout.value <= checkin.value) {
        alert("Ngày trả phòng phải sau ngày nhận phòng!");
        return;
    }

    const guests = document.getElementById("guests").value;

    alert(
        "Thông tin tìm phòng:\n" +
        "Ngày nhận: " + checkin.value + "\n" +
        "Ngày trả: " + checkout.value + "\n" +
        "Số khách: " + guests
    );
});

// Nút mũi tên trên banner
const hero = document.querySelector(".hero");
const heroPrev = document.getElementById("heroPrev");
const heroNext = document.getElementById("heroNext");

// Có thể thêm nhiều ảnh banner vào mảng này
const heroImages = [
    "Frontend/assets/images/danang-hero.jpg",
    "Frontend/assets/images/danang-hero-2.jpg"
];

let currentHero = 0;

function changeHero(direction) {
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

heroPrev.addEventListener("click", function () {
    changeHero(-1);
});

heroNext.addEventListener("click", function () {
    changeHero(1);
});
// Guest selector popup
const guestTrigger = document.getElementById("guestTrigger");
const guestPopup = document.getElementById("guestPopup");
const guestDone = document.getElementById("guestDone");
const guestSummary = document.getElementById("guestSummary");

const guestCounts = {
    adults: 2,
    children: 0,
    rooms: 1
};

// Mở hoặc đóng popup
guestTrigger.addEventListener("click", function () {

    guestPopup.classList.toggle("open");

    guestTrigger.classList.toggle(
        "active",
        guestPopup.classList.contains("open")
    );

});

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

    document.getElementById(type + "Value").textContent =
        guestCounts[type];

    updateGuestSummary();
}

// Gắn sự kiện cho các nút + và −
document.querySelectorAll("[data-counter]").forEach(function (button) {
    button.addEventListener("click", function () {
        const type = button.dataset.counter;
        const step = Number(button.dataset.step);

        updateGuestCount(type, step);
    });
});

// Cập nhật nội dung tóm tắt
function updateGuestSummary() {
    const totalGuests = guestCounts.adults + guestCounts.children;

    guestSummary.textContent =
        `${totalGuests} khách · ${guestCounts.rooms} phòng`;
}

// Đóng popup khi bấm Xong
guestDone.addEventListener("click", function () {

    guestPopup.classList.remove("open");
    guestTrigger.classList.remove("active");

});

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