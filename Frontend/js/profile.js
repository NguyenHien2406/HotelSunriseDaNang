// Dữ liệu mẫu hồ sơ cá nhân
const defaultProfile = {
  fullName: "Nguyễn Văn Hiến",
  email: "hiennguyen@gmail.com",
  phone: "0987 654 321",
  birthday: "2006-06-14",
  gender: "Nam",
  address: "Đà Nẵng, Việt Nam",
  avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop"
};

const sampleBookings = [
  { room: "Phòng Deluxe Ocean View", checkIn: "15/11/2026", checkOut: "17/11/2026", status: "Đã hoàn thành", type: "success", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&auto=format&fit=crop" },
  { room: "Phòng Superior City View", checkIn: "01/10/2026", checkOut: "03/10/2026", status: "Đã hủy", type: "cancel", image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400&auto=format&fit=crop" }
];

const samplePayments = [
  { id: "#HD000125", description: "Thanh toán đặt phòng", amount: "2.500.000đ", date: "15/11/2026", status: "Thành công" },
  { id: "#GD000087", description: "Nạp ví điện tử", amount: "1.000.000đ", date: "10/10/2026", status: "Thành công" },
  { id: "#HD000076", description: "Thanh toán đặt phòng", amount: "3.200.000đ", date: "01/10/2026", status: "Thành công" }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
let profile = { ...defaultProfile, ...JSON.parse(localStorage.getItem("sunriseProfile") || "{}") };

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function formatDate(dateString) {
  if (!dateString) return "Chưa cập nhật";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function renderProfile() {
  $("#headerUserName").textContent = profile.fullName;
  $("#sidebarName").textContent = profile.fullName;
  $("#sidebarEmail").textContent = profile.email;
  $("#infoName").textContent = profile.fullName;
  $("#infoEmail").textContent = profile.email;
  $("#infoPhone").textContent = profile.phone || "Chưa cập nhật";
  $("#infoBirthday").textContent = formatDate(profile.birthday);
  $("#infoGender").textContent = profile.gender || "Chưa cập nhật";
  $("#infoAddress").textContent = profile.address || "Chưa cập nhật";
  $("#sidebarAvatar").src = profile.avatar;
  $("#mainAvatar").src = profile.avatar;
}

function renderBookings() {
  const list = $("#bookingList");
  if (!list) return;
  list.innerHTML = sampleBookings.map(item => `
    <article class="booking-item">
      <img src="${item.image}" alt="${item.room}">
      <div class="booking-details">
        <h3>${item.room}</h3>
        <p><i class="fa-regular fa-calendar"></i> Nhận phòng: ${item.checkIn}</p>
        <p><i class="fa-regular fa-calendar-check"></i> Trả phòng: ${item.checkOut}</p>
      </div>
      <span class="status ${item.type}">${item.status}</span>
    </article>
  `).join("");
}

function renderPayments() {
  const body = $("#paymentTableBody");
  if (!body) return;
  body.innerHTML = samplePayments.map(item => `
    <tr>
      <td><strong>${item.id}</strong></td>
      <td>${item.description}</td>
      <td><strong>${item.amount}</strong></td>
      <td>${item.date}</td>
      <td><span class="status success">${item.status}</span></td>
    </tr>
  `).join("");
}

// --- QUẢN LÝ VÍ & NẠP TIỀN GIẢ LẬP ---
function getWalletData() {
  const data = JSON.parse(localStorage.getItem("sunriseWallet") || "null");
  if (data) return data;
  
  const initialWallet = {
    balance: 1500000,
    history: [
      { id: "#GD001", description: "Nạp tiền qua Ví MoMo", amount: "+500.000đ", date: "10/05/2026 14:30", status: "Thành công" },
      { id: "#GD002", description: "Thanh toán đặt phòng", amount: "-1.000.000đ", date: "01/05/2026 09:15", status: "Thành công" }
    ]
  };
  localStorage.setItem("sunriseWallet", JSON.stringify(initialWallet));
  return initialWallet;
}

function saveWalletData(wallet) {
  localStorage.setItem("sunriseWallet", JSON.stringify(wallet));
}

function renderWallet() {
  const wallet = getWalletData();
  const formattedBalance = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(wallet.balance);
  const balanceEl = $("#walletBalanceDisplay");
  if (balanceEl) balanceEl.textContent = formattedBalance;

  const historyBody = $("#walletHistoryBody");
  if (historyBody) {
    if (wallet.history.length === 0) {
      historyBody.innerHTML = `<tr><td colspan="5" class="empty-state">Chưa có giao dịch nào.</td></tr>`;
      return;
    }

    historyBody.innerHTML = wallet.history.map(item => `
      <tr>
        <td><strong>${item.id}</strong></td>
        <td>${item.description}</td>
        <td><strong style="color: ${item.amount.startsWith('+') ? '#167443' : '#dc2626'};">${item.amount}</strong></td>
        <td>${item.date}</td>
        <td><span class="status success">${item.status}</span></td>
      </tr>
    `).join("");
  }
}

function openSection(section) {
  $$(".content-section").forEach(el => el.hidden = el.id !== `section-${section}`);
  $$(".nav-item[data-section]").forEach(btn => btn.classList.toggle("active", btn.dataset.section === section));
}

function startEdit() {
  const form = $("#editProfileForm");
  form.fullName.value = profile.fullName;
  form.email.value = profile.email;
  form.phone.value = profile.phone;
  form.birthday.value = profile.birthday;
  form.gender.value = profile.gender;
  form.address.value = profile.address;
  form.classList.remove("hidden");
  $("#profileInfo").classList.add("hidden");
  $(".profile-photo").classList.add("hidden");
  $("#editProfileBtn").classList.add("hidden");
}

function stopEdit() {
  $("#editProfileForm").classList.add("hidden");
  $("#profileInfo").classList.remove("hidden");
  $(".profile-photo").classList.remove("hidden");
  $("#editProfileBtn").classList.remove("hidden");
}

function initProfile() {
  renderProfile();
  renderBookings();
  renderPayments();
  renderWallet();

  $$(".nav-item[data-section]").forEach(button => {
    button.addEventListener("click", () => openSection(button.dataset.section));
  });

  $("#editProfileBtn").addEventListener("click", startEdit);
  $("#cancelEditBtn").addEventListener("click", stopEdit);

  $("#editProfileForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    profile = {
      ...profile,
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      birthday: form.birthday.value,
      gender: form.gender.value,
      address: form.address.value.trim()
    };
    localStorage.setItem("sunriseProfile", JSON.stringify(profile));
    renderProfile();
    stopEdit();
    showToast("Cập nhật thông tin thành công!");
  });

  $("#avatarInput").addEventListener("change", event => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Vui lòng chọn tệp hình ảnh.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      showToast("Ảnh đại diện không được vượt quá 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      profile.avatar = reader.result;
      localStorage.setItem("sunriseProfile", JSON.stringify(profile));
      renderProfile();
      showToast("Đã cập nhật ảnh đại diện.");
    };
    reader.readAsDataURL(file);
  });

  // Modal Nạp tiền ví
  const modal = $("#topupModal");
  const openBtn = $("#openTopupModalBtn");
  const closeBtn = $("#closeTopupModal");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => { modal.style.display = "flex"; });
  }
  if (closeBtn && modal) {
    closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
  }

  $$(".preset-amount").forEach(btn => {
    btn.addEventListener("click", () => {
      $("#topupAmountInput").value = btn.dataset.amount;
    });
  });

  const topupForm = $("#topupForm");
  if (topupForm) {
    topupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const amount = Number($("#topupAmountInput").value);
      const method = $("#topupMethod").value;

      if (!amount || amount <= 0) {
        showToast("Vui lòng nhập số tiền hợp lệ!");
        return;
      }

      showToast("Đang kết nối cổng thanh toán giả lập...");

      setTimeout(() => {
        const wallet = getWalletData();
        wallet.balance += amount;

        const randomId = "#GD" + Math.floor(100000 + Math.random() * 900000);
        const now = new Date();
        const dateTimeStr = `${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

        wallet.history.unshift({
          id: randomId,
          description: `Nạp tiền qua ${method}`,
          amount: "+" + new Intl.NumberFormat('vi-VN').format(amount) + "đ",
          date: dateTimeStr,
          status: "Thành công"
        });

        saveWalletData(wallet);
        renderWallet();

        modal.style.display = "none";
        topupForm.reset();
        showToast("Nạp tiền vào ví thành công!");
      }, 1500);
    });
  }

  $$(".toggle-password").forEach(button => {
    button.addEventListener("click", () => {
      const input = button.parentElement.querySelector("input");
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      button.innerHTML = `<i class="fa-regular ${show ? "fa-eye-slash" : "fa-eye"}"></i>`;
    });
  });

  $("#passwordForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const current = form.currentPassword.value;
    const next = form.newPassword.value;
    const confirm = form.confirmPassword.value;

    if (current.length < 1) return showToast("Vui lòng nhập mật khẩu hiện tại.");
    if (next.length < 8) return showToast("Mật khẩu mới phải có ít nhất 8 ký tự.");
    if (next !== confirm) return showToast("Mật khẩu xác nhận không khớp.");
    
    showToast("Đổi mật khẩu thành công!");
    form.reset();
    $$(".toggle-password").forEach(button => button.innerHTML = '<i class="fa-regular fa-eye"></i>');
  });

  $("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));

  $$("[data-logout]").forEach(button => button.addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("token");
      window.location.href = "../../index.html";
    }
  }));
}

document.addEventListener("DOMContentLoaded", initProfile);