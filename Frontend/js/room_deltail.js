// =========================================
// SUNRISE HOTEL - ROOM DETAIL JAVASCRIPT
// =========================================

// 1. MENU MOBILE
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("show");
    });
}

// 2. ĐỌC THAM SỐ LOẠI PHÒNG TỪ URL VÀ CẬP NHẬT DỮ LIỆU ĐỘNG
const urlParams = new URLSearchParams(window.location.search);
const roomType = urlParams.get("type") || "deluxe"; // Mặc định là deluxe nếu không có

// Dữ liệu chi tiết cho từng loại phòng (Đồng bộ chuẩn 100% về giá, thông số và ảnh)
const roomsDataMap = {
    standard: {
        category: "PHÒNG TIÊU CHUẨN",
        name: "Phòng tiêu chuẩn",
        price: 850000,
        desc: "Không gian ấm cúng, thiết kế tinh tế với đầy đủ tiện nghi cơ bản, hướng nhìn thành phố. Phù hợp cho khách du lịch một mình hoặc cặp đôi.",
        specs: { size: "28 m²", bed: "1 giường đôi", capacity: "2 người lớn" },
        images: [
            { main: "../assets/images/room-standard.jpg", thumb: "../assets/images/room-standard.jpg" },
            { main: "../assets/images/room-standard1.jpg", thumb: "../assets/images/room-standard1.jpg" },
            { main: "../assets/images/room-standard2.jpg", thumb: "../assets/images/room-standard2.jpg" },
            { main: "../assets/images/room-standard3.jpg", thumb: "../assets/images/room-standard3.jpg" }
        ]
    },
    premium: {
        category: "PHÒNG CAO CẤP",
        name: "Phòng cao cấp",
        price: 1200000,
        desc: "Không gian rộng rãi, nội thất gỗ sang trọng cùng cửa sổ lớn đón ánh sáng tự nhiên, mang lại cảm giác thư thái tuyệt đối.",
        specs: { size: "32 m²", bed: "1 giường cỡ lớn", capacity: "2 người lớn · 1 trẻ em" },
        images: [
            { main: "../assets/images/room-premium.jpg", thumb: "../assets/images/room-premium.jpg" },
            { main: "../assets/images/room-premium1.jpg", thumb: "../assets/images/room-premium1.jpg" },
            { main: "../assets/images/room-premium2.jpg", thumb: "../assets/images/room-premium2.jpg" },
            { main: "../assets/images/room-premium3.jpg", thumb: "../assets/images/room-premium3.jpg" }
        ]
    },
    deluxe: {
        category: "PHÒNG DELUXE",
        name: "Phòng Deluxe",
        price: 1600000,
        desc: "Tầm nhìn hướng biển tuyệt đẹp, mang đến trải nghiệm nghỉ dưỡng trọn vẹn tại Đà Nẵng.",
        specs: { size: "35 m²", bed: "1 giường lớn (1.8m)", capacity: "2 người lớn · 1 trẻ em" },
        images: [
            { main: "../assets/images/room-deluxe.jpg", thumb: "../assets/images/room-deluxe.jpg" },
            { main: "../assets/images/room-deluxe1.jpg", thumb: "../assets/images/room-deluxe1.jpg" },
            { main: "../assets/images/room-deluxe2.jpg", thumb: "../assets/images/room-deluxe2.jpg" },
            { main: "../assets/images/room-deluxe3.jpg", thumb: "../assets/images/room-deluxe3.jpg" }
        ]
    },
    suite: {
        category: "PHÒNG SUITE",
        name: "Phòng Suite",
        price: 2000000,
        desc: "Trải nghiệm nghỉ dưỡng cao cấp, đỉnh cao của sự sang trọng với phòng khách riêng biệt và ban công rộng hướng trực diện biển.",
        specs: { size: "55 m²", bed: "2 giường lớn", capacity: "4 người lớn" },
        images: [
            { main: "../assets/images/room-suite.jpg", thumb: "../assets/images/room-suite.jpg" },
            { main: "../assets/images/room-suite1.jpg", thumb: "../assets/images/room-suite1.jpg" },
            { main: "../assets/images/room-suite2.jpg", thumb: "../assets/images/room-suite2.jpg" },
            { main: "../assets/images/room-suite3.jpg", thumb: "../assets/images/room-suite3.jpg" }
        ]
    }
};

const currentRoom = roomsDataMap[roomType] || roomsDataMap["deluxe"];
const galleryImages = currentRoom.images;
const roomPrice = currentRoom.price;

// Gán thông tin động lên toàn bộ giao diện trang chi tiết
document.addEventListener("DOMContentLoaded", () => {
    // 1. Cập nhật tiêu đề & breadcrumb
    const categoryEl = document.querySelector(".room-category");
    const titleEl = document.querySelector(".room-information h2");
    const descEl = document.querySelector(".room-short-description");
    const breadcrumbSpan = document.querySelector(".breadcrumb span");
    
    // Thẻ nhỏ phía trên gallery (ví dụ: góc trái ảnh)
    const galleryTopLabel = document.querySelector(".gallery-section .room-label-tag, .gallery-section > div:first-child span");
    
    if (categoryEl) categoryEl.textContent = currentRoom.category;
    if (titleEl) titleEl.textContent = currentRoom.name;
    if (descEl) descEl.textContent = currentRoom.desc;
    if (breadcrumbSpan) breadcrumbSpan.textContent = currentRoom.name;

    // 2. Cập nhật thông số kỹ thuật (Diện tích, Giường, Sức chứa)
    const specsItems = document.querySelectorAll(".room-specs .spec-item");
    if (specsItems.length >= 3) {
        specsItems[0].querySelector("strong").textContent = currentRoom.specs.size;
        specsItems[1].querySelector("strong").textContent = currentRoom.specs.bed;
        specsItems[2].querySelector("strong").textContent = currentRoom.specs.capacity;
    }

    // 3. Cập nhật giá tiền hiển thị ở sidebar đặt phòng
    const priceDisplay = document.querySelector(".price-summary strong");
    if (priceDisplay) priceDisplay.textContent = roomPrice.toLocaleString("vi-VN") + "đ";

    const mobilePrice = document.querySelector(".room-price-mobile strong");
    if (mobilePrice) mobilePrice.innerHTML = `${roomPrice.toLocaleString("vi-VN")}đ <small>/ đêm</small>`;

    showImage(0);
    calculatePrice();
});

// 3. IMAGE GALLERY
let currentImageIndex = 0;

const mainImage = document.getElementById("mainImage");
const thumbnails = document.querySelectorAll(".thumbnail");
const imageCounter = document.getElementById("imageCounter");

function showImage(index) {
    if (index < 0) index = galleryImages.length - 1;
    if (index >= galleryImages.length) index = 0;

    currentImageIndex = index;
    mainImage.src = galleryImages[index].main;

    thumbnails.forEach((thumbnail, i) => {
        if (galleryImages[i]) {
            thumbnail.src = galleryImages[i].thumb;
            thumbnail.style.display = "block";
            thumbnail.classList.toggle("active", i === index);
        } else {
            thumbnail.style.display = "none";
        }
    });

    if (imageCounter) {
        imageCounter.textContent = `${index + 1} / ${galleryImages.length}`;
    }

    const lightboxImage = document.getElementById("lightboxImage");
    const lightboxCounter = document.getElementById("lightboxCounter");
    if (lightboxImage) lightboxImage.src = galleryImages[index].main;
    if (lightboxCounter) lightboxCounter.textContent = `${index + 1} / ${galleryImages.length}`;
}

// Click thumbnail
thumbnails.forEach((thumbnail, index) => {
    thumbnail.addEventListener("click", () => {
        if (galleryImages[index]) showImage(index);
    });
});

const prevBtn = document.getElementById("prevImage");
const nextBtn = document.getElementById("nextImage");
if (prevBtn) prevBtn.addEventListener("click", () => showImage(currentImageIndex - 1));
if (nextBtn) nextBtn.addEventListener("click", () => showImage(currentImageIndex + 1));

// 4. LIGHTBOX
const lightbox = document.getElementById("lightbox");
const zoomBtn = document.getElementById("zoomImage");
const closeLightboxBtn = document.getElementById("closeLightbox");

function openLightbox() {
    if (!lightbox) return;
    showImage(currentImageIndex);
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("show");
    document.body.style.overflow = "";
}

if (zoomBtn) zoomBtn.addEventListener("click", openLightbox);
if (mainImage) mainImage.addEventListener("click", openLightbox);
if (closeLightboxBtn) closeLightboxBtn.addEventListener("click", closeLightbox);

const lbPrev = document.getElementById("lightboxPrev");
const lbNext = document.getElementById("lightboxNext");
if (lbPrev) lbPrev.addEventListener("click", () => showImage(currentImageIndex - 1));
if (lbNext) lbNext.addEventListener("click", () => showImage(currentImageIndex + 1));

if (lightbox) {
    lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
    });
}

document.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("show")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentImageIndex - 1);
    if (event.key === "ArrowRight") showImage(currentImageIndex + 1);
});

// 5. GUEST SELECTOR
const guestTrigger = document.getElementById("guestTrigger");
const guestDropdown = document.getElementById("guestDropdown");
const guestDone = document.getElementById("guestDone");

const guestData = { adults: 2, children: 0, rooms: 1 };

if (guestTrigger && guestDropdown) {
    guestTrigger.addEventListener("click", (event) => {
        event.stopPropagation();
        guestDropdown.classList.toggle("show");
    });

    guestDropdown.addEventListener("click", (event) => {
        event.stopPropagation();
    });

    document.addEventListener("click", () => {
        guestDropdown.classList.remove("show");
    });
}

if (guestDone) {
    guestDone.addEventListener("click", () => {
        if (guestDropdown) guestDropdown.classList.remove("show");
        updateGuestSummary();
    });
}

document.querySelectorAll(".counter button").forEach(button => {
    button.addEventListener("click", () => {
        const type = button.dataset.type;
        if (!type) return;
        const change = Number(button.dataset.change);
        const minimum = type === "children" ? 0 : 1;
        const nextValue = guestData[type] + change;

        if (nextValue < minimum || nextValue > 10) return;

        guestData[type] = nextValue;
        const valEl = document.getElementById(`${type}Value`);
        if (valEl) valEl.textContent = nextValue;

        updateGuestSummary();
        calculatePrice();
    });
});

function updateGuestSummary() {
    const summary = document.getElementById("guestSummary");
    if (summary) {
        summary.textContent = `${guestData.adults} người lớn · ${guestData.children} trẻ em · ${guestData.rooms} phòng`;
    }
}

// 6. DATE PICKER AND PRICE CALCULATION
const checkIn = document.getElementById("checkIn");
const checkOut = document.getElementById("checkOut");

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = addDays(today, 1);
const dayAfterTomorrow = addDays(today, 2);

if (checkIn && checkOut) {
    checkIn.min = formatDate(today);
    checkIn.value = formatDate(tomorrow);
    checkOut.min = formatDate(dayAfterTomorrow);
    checkOut.value = formatDate(dayAfterTomorrow);
}

function calculatePrice() {
    if (!checkIn || !checkOut) return;
    const start = checkIn.value;
    const end = checkOut.value;

    const nightCountEl = document.getElementById("nightCount");
    const totalPriceEl = document.getElementById("totalPrice");

    if (!start || !end) {
        if (nightCountEl) nightCountEl.textContent = "Chưa chọn";
        if (totalPriceEl) totalPriceEl.textContent = "Chưa xác định";
        return;
    }

    const startDate = new Date(start + "T00:00:00");
    const endDate = new Date(end + "T00:00:00");
    const nights = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (nights <= 0) {
        if (nightCountEl) nightCountEl.textContent = "Không hợp lệ";
        if (totalPriceEl) totalPriceEl.textContent = "Chưa xác định";
        return;
    }

    const total = roomPrice * nights * guestData.rooms;

    if (nightCountEl) nightCountEl.textContent = `${nights} đêm`;
    if (totalPriceEl) totalPriceEl.textContent = total.toLocaleString("vi-VN") + "đ";
}

if (checkIn) {
    checkIn.addEventListener("change", () => {
        const selectedDate = new Date(checkIn.value + "T00:00:00");
        checkOut.min = formatDate(addDays(selectedDate, 1));
        if (!checkOut.value || checkOut.value <= checkIn.value) {
            checkOut.value = formatDate(addDays(selectedDate, 1));
        }
        calculatePrice();
    });
}

if (checkOut) {
    checkOut.addEventListener("change", calculatePrice);
}

// 7. BOOKING BUTTON
const bookNowBtn = document.getElementById("bookNow");
if (bookNowBtn) {
    bookNowBtn.addEventListener("click", () => {
        if (!checkIn.value || !checkOut.value) {
            alert("Vui lòng chọn ngày nhận phòng và trả phòng!");
            return;
        }

        if (checkOut.value <= checkIn.value) {
            alert("Ngày trả phòng phải sau ngày nhận phòng!");
            return;
        }

        const startDate = new Date(checkIn.value + "T00:00:00");
        const endDate = new Date(checkOut.value + "T00:00:00");
        const nights = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));

        const bookingInfo = {
            roomName: currentRoom.name,
            roomPrice: roomPrice,
            checkIn: checkIn.value,
            checkOut: checkOut.value,
            adults: guestData.adults,
            children: guestData.children,
            rooms: guestData.rooms,
            totalPrice: roomPrice * guestData.rooms * nights
        };

        const params = new URLSearchParams(bookingInfo);
        window.location.href = `booking.html?${params.toString()}`;
    });
}