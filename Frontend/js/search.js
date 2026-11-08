const allRooms = [
  {
    id: 1,
    name: "Phòng tiêu chuẩn",
    type: "Tiêu chuẩn",
    price: 850000,
    maxGuests: 2,
    image: "../assets/images/room-standard.jpg",
    amenities: ["breakfast"],
    description: "Không gian ấm cúng, thiết kế tinh tế với đầy đủ tiện nghi cơ bản, hướng nhìn thành phố."
  },
  {
    id: 2,
    name: "Phòng cao cấp",
    type: "Cao cấp",
    price: 1200000,
    maxGuests: 3,
    image: "../assets/images/room-premium.jpg",
    amenities: ["breakfast", "balcony"],
    description: "Không gian rộng rãi, nội thất gỗ sang trọng cùng cửa sổ lớn đón ánh sáng tự nhiên."
  },
  {
    id: 3,
    name: "Phòng Deluxe",
    type: "Deluxe",
    price: 1600000,
    maxGuests: 3,
    image: "../assets/images/room-deluxe.jpg",
    amenities: ["ocean_view", "breakfast", "bathtub"],
    description: "Tầm nhìn hướng biển tuyệt đẹp, mang đến trải nghiệm nghỉ dưỡng trọn vẹn tại Đà Nẵng."
  },
  {
    id: 4,
    name: "Phòng Suite",
    type: "Suite",
    price: 2000000,
    maxGuests: 4,
    image: "../assets/images/room-suite.jpg",
    amenities: ["ocean_view", "breakfast", "bathtub", "balcony"],
    description: "Trải nghiệm nghỉ dưỡng cao cấp, đỉnh cao của sự sang trọng với phòng khách riêng biệt và ban công rộng hướng biển."
  }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

// Thiết lập mặc định ngày nhận/trả phòng hôm nay & ngày mai
function initDefaultDates() {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDateStr = (d) => d.toISOString().split('T')[0];
  
  const checkinInput = $("#filterCheckin");
  const checkoutInput = $("#filterCheckout");

  if (checkinInput && !checkinInput.value) checkinInput.value = formatDateStr(today);
  if (checkoutInput && !checkoutInput.value) checkoutInput.value = formatDateStr(tomorrow);
}

// Render danh sách phòng ra màn hình
function renderRooms(roomsToRender) {
  const container = $("#roomSearchList");
  const countText = $("#resultCountText");
  
  if (countText) countText.innerHTML = `Tìm thấy <strong>${roomsToRender.length}</strong> phòng phù hợp`;

  if (!container) return;
  if (roomsToRender.length === 0) {
    container.innerHTML = `<div class="card empty-state">Không tìm thấy phòng nào phù hợp với tiêu chí của bạn.</div>`;
    return;
  }

  container.innerHTML = roomsToRender.map(room => `
    <article class="card room-search-card" style="display: grid; grid-template-columns: 260px minmax(0, 1fr) auto; gap: 20px; align-items: center; margin-bottom: 16px;">
      <img src="${room.image}" alt="${room.name}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 10px;">
      <div>
        <span class="room-label-tag" style="background: #eef3f9; color: var(--navy); padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;">${room.type}</span>
        <h3 style="font-size: 18px; margin: 8px 0 6px; color: var(--navy);">
          <a href="room_detail.html?type=${room.type === 'Tiêu chuẩn' ? 'standard' : room.type === 'Cao cấp' ? 'premium' : room.type === 'Deluxe' ? 'deluxe' : 'suite'}" style="text-decoration:none; color:inherit;">${room.name}</a>
        </h3>
        <p style="font-size: 13px; color: var(--muted); margin-bottom: 10px;">${room.description}</p>
        <p style="font-size: 13px; font-weight: 500;"><i class="fa-solid fa-users" style="color:var(--navy); margin-right:5px;"></i> Tối đa: ${room.maxGuests} khách</p>
      </div>
      <div style="text-align: right; display: flex; flex-direction: column; justify-content: center; gap: 10px; border-left: 1px solid var(--line); padding-left: 20px;">
        <div>
          <span style="font-size: 12px; color: var(--muted); display: block;">Giá từ</span>
          <strong style="font-size: 20px; color: #dc2626; font-family: 'Playfair Display', serif;">${new Intl.NumberFormat('vi-VN').format(room.price)}đ</strong>
          <small style="color: var(--muted); display: block;">/ đêm</small>
        </div>
        <a href="room_detail.html?type=${room.type === 'Tiêu chuẩn' ? 'standard' : room.type === 'Cao cấp' ? 'premium' : room.type === 'Deluxe' ? 'deluxe' : 'suite'}" class="gold-button" style="padding: 10px 20px; font-size: 13px; text-decoration:none; display:inline-block;">Xem chi tiết</a>
      </div>
    </article>
  `).join("");
}

// Logic bộ lọc và sắp xếp
function handleFilterAndSort() {
  const maxPrice = Number($("#priceRange").value);
  const adults = Number($("#filterAdults").value);
  const children = Number($("#filterChildren").value);
  const totalGuestsNeeded = adults + children;

  // Lấy các hạng phòng được check
  const selectedTypes = $$("input[name='roomType']:checked").map(cb => cb.value);
  // Lấy các tiện ích được check
  const selectedAmenities = $$("input[name='amenity']:checked").map(cb => cb.value);

  // Lọc dữ liệu
  let filtered = allRooms.filter(room => {
    if (room.price > maxPrice) return false;
    if (room.maxGuests < totalGuestsNeeded) return false;
    if (!selectedTypes.includes(room.type)) return false;

    // Kiểm tra tiện ích
    const matchAmenities = selectedAmenities.every(am => room.amenities.includes(am));
    if (!matchAmenities) return false;

    return true;
  });

  // Sắp xếp
  const sortVal = $("#sortSelect").value;
  if (sortVal === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortVal === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderRooms(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  initDefaultDates();
  renderRooms(allRooms);

  // Hiển thị tên user trên header nếu đã đăng nhập
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user.fullname || user.username) {
    const userSpan = $("#headerUserName");
    if (userSpan) userSpan.textContent = user.fullname || user.username;
  }

  // Cập nhật text khoảng giá khi kéo slider
  const priceRange = $("#priceRange");
  const priceRangeVal = $("#priceRangeVal");
  if (priceRange && priceRangeVal) {
    priceRange.addEventListener("input", () => {
      priceRangeVal.textContent = new Intl.NumberFormat('vi-VN').format(priceRange.value) + "đ";
    });
  }

  // Lắng nghe sự kiện submit hoặc thay đổi bộ lọc
  const filterForm = $("#filterForm");
  if (filterForm) {
    filterForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleFilterAndSort();
      showToast("Đã cập nhật kết quả tìm kiếm!");
    });
  }

  const sortSelect = $("#sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", handleFilterAndSort);
  }

  // Đặt lại bộ lọc
  const resetBtn = $("#resetFilterBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (filterForm) filterForm.reset();
      if (priceRangeVal) priceRangeVal.textContent = "5.000.000đ";
      initDefaultDates();
      renderRooms(allRooms);
      showToast("Đã đặt lại bộ lọc.");
    });
  }

  // Menu toggle mobile
  const menuToggle = $("#menuToggle");
  const mainNav = $("#mainNav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => mainNav.classList.toggle("open"));
  }

  // Đăng xuất
  const logoutBtn = $("#navLogoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "../../index.html";
      }
    });
  }
});