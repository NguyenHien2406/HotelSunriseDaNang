const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

// Lấy thông tin user và token đăng nhập từ localStorage
const token = localStorage.getItem("token");
let loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

// Nếu chưa đăng nhập, chuyển hướng về trang login
if (!token || !loggedInUser.user_id) {
  window.location.href = "../login.html";
}

let profile = {
  fullName: loggedInUser.full_name || "Nguyễn Văn Hiến",
  email: loggedInUser.email || "hiennguyen@gmail.com",
  phone: loggedInUser.phone || "0987 654 321",
  birthday: loggedInUser.birthday || "2006-06-14",
  gender: loggedInUser.gender || "Nam",
  address: loggedInUser.address || "Đà Nẵng, Việt Nam",
  avatar: loggedInUser.avatar || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop"
};

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
  const parts = dateString.split("-");
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

function renderProfile() {
  if ($("#headerUserName")) $("#headerUserName").textContent = profile.fullName;
  if ($("#sidebarName")) $("#sidebarName").textContent = profile.fullName;
  if ($("#sidebarEmail")) $("#sidebarEmail").textContent = profile.email;
  if ($("#infoName")) $("#infoName").textContent = profile.fullName;
  if ($("#infoEmail")) $("#infoEmail").textContent = profile.email;
  if ($("#infoPhone")) $("#infoPhone").textContent = profile.phone || "Chưa cập nhật";
  if ($("#infoBirthday")) $("#infoBirthday").textContent = formatDate(profile.birthday);
  if ($("#infoGender")) $("#infoGender").textContent = profile.gender || "Chưa cập nhật";
  if ($("#infoAddress")) $("#infoAddress").textContent = profile.address || "Chưa cập nhật";
  if ($("#sidebarAvatar")) $("#sidebarAvatar").src = profile.avatar;
  if ($("#mainAvatar")) $("#mainAvatar").src = profile.avatar;
}

// --- 1. LẤY & RENDER LỊCH SỬ ĐẶT PHÒNG TỪ MYSQL ---
async function renderBookings() {
    const list = $("#bookingList");
    if (!list) return;

    try {
        const response = await fetch('http://localhost:5000/api/bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();

        if (!result.success || !result.data || result.data.length === 0) {
            list.innerHTML = `<p style="text-align:center; color: #64748b; padding: 20px;">Bạn chưa có lịch sử đặt phòng nào.</p>`;
            return;
        }

        const bookings = result.data;

        list.innerHTML = bookings.map(item => {
            let statusBadge = '';
            let statusClass = '';
            const status = item.booking_status || item.status;

            if (status === 'confirmed' || status === 'pending') {
                statusBadge = 'Chờ thanh toán';
                statusClass = 'pending';
            } else if (status === 'paid' || status === 'completed') {
                statusBadge = 'Đã thanh toán';
                statusClass = 'success';
            } else if (status === 'cancelled') {
                statusBadge = 'Đã hủy';
                statusClass = 'cancel';
            }

            let actionBtns = '';
            if (status === 'confirmed' || status === 'pending') {
                actionBtns = `
                    <div style="margin-top: 8px; display: flex; gap: 8px;">
                        <button onclick="profilePayBooking('${item.booking_id || item.id}')" style="background: #0284c7; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600;">Thanh toán ví</button>
                        <button onclick="profileCancelBooking('${item.booking_id || item.id}')" style="background: #fee2e2; color: #b91c1c; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; font-weight: 600;">Hủy</button>
                    </div>
                `;
            }

            const roomName = item.room_name || "Phòng khách sạn Sunrise";
            const checkIn = item.check_in ? item.check_in.split('T')[0] : '';
            const checkOut = item.check_out ? item.check_out.split('T')[0] : '';
            const roomsCount = item.rooms_count || 1;
            const totalPrice = item.total_amount || 0;
            const imageUrl = item.image_url || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&auto=format&fit=crop';

            return `
                <article class="booking-item" style="display: flex; gap: 15px; align-items: center; border-bottom: 1px solid #e2e8f0; padding: 15px 0;">
                    <img src="${imageUrl}" alt="${roomName}" style="width: 100px; height: 75px; object-fit: cover; border-radius: 8px;">
                    <div class="booking-details" style="flex: 1;">
                        <h3 style="font-size: 16px; margin-bottom: 4px;">${roomName}</h3>
                        <p style="font-size: 13px; color: #64748b; margin-bottom: 2px;"><i class="fa-regular fa-calendar"></i> Nhận phòng: ${checkIn} — Trả phòng: ${checkOut}</p>
                        <p style="font-size: 13px; color: #64748b; margin-bottom: 2px;"><i class="fa-solid fa-users"></i> Số phòng: <strong>${roomsCount} phòng</strong> Mã đơn: <strong>#${item.booking_code || item.booking_id}</strong></p>
                        <p style="font-size: 12px; color: #dc2626; font-weight: bold; margin-top: 4px;">Tổng tiền: ${Number(totalPrice).toLocaleString("vi-VN")}đ</p>
                        ${actionBtns}
                    </div>
                    <span class="status ${statusClass}" style="padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;">${statusBadge}</span>
                </article>
            `;
        }).join("");
    } catch (error) {
        console.error("Lỗi tải lịch sử đặt phòng:", error);
        list.innerHTML = `<p style="text-align:center; color: #dc2626; padding: 20px;">Không thể tải dữ liệu từ máy chủ.</p>`;
    }
}

// --- 2. THANH TOÁN ĐƠN PHÒNG BẰNG VÍ QUA API ---
window.profilePayBooking = async function(bookingId) {
    if (!confirm(`Xác nhận thanh toán đơn phòng #${bookingId} từ Ví Sunrise?`)) return;

    try {
        const response = await fetch('http://localhost:5000/api/wallet/pay-booking', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bookingId })
        });
        const result = await response.json();

        if (response.ok && result.success) {
            showToast("Thanh toán thành công từ ví!");
            renderBookings();
            renderWallet();
        } else {
            showToast(result.message || "Thanh toán thất bại!");
        }
    } catch (error) {
        console.error("Lỗi thanh toán:", error);
        showToast("Lỗi kết nối đến máy chủ.");
    }
};

// --- 3. HỦY ĐẶT PHÒNG QUA API ---
window.profileCancelBooking = async function(bookingId) {
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn đặt phòng #${bookingId}?`)) return;

    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();

        if (response.ok && result.success) {
            showToast("Đã hủy đặt phòng thành công.");
            renderBookings();
        } else {
            showToast(result.message || "Không thể hủy đơn phòng!");
        }
    } catch (error) {
        console.error("Lỗi hủy phòng:", error);
        showToast("Lỗi kết nối đến máy chủ.");
    }
};

async function renderPayments() {
    const body = $("#paymentTableBody");
    if (!body) return;

    try {
        const response = await fetch('http://localhost:5000/api/wallet', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();

        if (result.success && result.history) {
            // Lọc các giao dịch thanh toán đơn phòng từ ví hoặc lịch sử ví
            const payments = result.history.filter(item => 
                item.description && (item.description.includes('Thanh toán') || item.description.includes('phòng') || item.transaction_type === 'booking_payment')
            );

            if (payments.length === 0) {
                body.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b; padding: 20px;">Chưa có giao dịch thanh toán phòng nào.</td></tr>`;
                return;
            }

            body.innerHTML = payments.map(item => `
                <tr>
                  <td><strong>${item.transaction_code || item.reference_code || item.id}</strong></td>
                  <td>${item.description}</td>
                  <td><strong style="color: #dc2626;">${item.amount}</strong></td>
                  <td>${new Date(item.created_at || item.date).toLocaleString('vi-VN')}</td>
                  <td><span class="status success">Thành công</span></td>
                </tr>
            `).join("");
        } else {
            body.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b; padding: 20px;">Chưa có lịch sử thanh toán.</td></tr>`;
        }
    } catch (error) {
        console.error("Lỗi tải lịch sử thanh toán:", error);
        body.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#dc2626; padding: 20px;">Không thể tải dữ liệu thanh toán.</td></tr>`;
    }
}

// --- 4. QUẢN LÝ VÍ & NẠP TIỀN QUA API ---
async function renderWallet() {
  const balanceEl = $("#walletBalanceDisplay");
  const historyBody = $("#walletHistoryBody");

  try {
      const response = await fetch('http://localhost:5000/api/wallet', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      });
      const result = await response.json();

      if (result.success) {
          const balance = result.balance || 0;
          if (balanceEl) {
              balanceEl.textContent = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(balance);
          }

          if (historyBody) {
              const history = result.history || [];
              if (history.length === 0) {
                  historyBody.innerHTML = `<tr><td colspan="5" class="empty-state" style="text-align:center; color:#64748b; padding: 20px;">Chưa có giao dịch nào.</td></tr>`;
                  return;
              }

              historyBody.innerHTML = history.map(item => `
                <tr>
                  <td><strong>${item.transaction_code || item.id}</strong></td>
                  <td>${item.description}</td>
                  <td><strong style="color: ${item.amount && item.amount.startsWith('+') ? '#167443' : '#dc2626'};">${item.amount}</strong></td>
                  <td>${item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : 'Vừa xong'}</td>
                  <td><span class="status success">${item.status || 'Thành công'}</span></td>
                </tr>
              `).join("");
          }
      }
  } catch (error) {
      console.error("Lỗi tải thông tin ví:", error);
  }
}

function openSection(section) {
  $$(".content-section").forEach(el => el.hidden = el.id !== `section-${section}`);
  $$(".nav-item[data-section]").forEach(btn => btn.classList.toggle("active", btn.dataset.section === section));
}

function startEdit() {
  const form = $("#editProfileForm");
  if (!form) return;
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

  if ($("#editProfileBtn")) $("#editProfileBtn").addEventListener("click", startEdit);
  if ($("#cancelEditBtn")) $("#cancelEditBtn").addEventListener("click", stopEdit);

  if ($("#editProfileForm")) {
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
      localStorage.setItem("user", JSON.stringify({ ...loggedInUser, ...profile }));
      renderProfile();
      stopEdit();
      showToast("Cập nhật thông tin thành công!");
    });
  }

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
    topupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const amount = Number($("#topupAmountInput").value);
      const method = $("#topupMethod").value;

      if (!amount || amount <= 0) {
        showToast("Vui lòng nhập số tiền hợp lệ!");
        return;
      }

      showToast("Đang kết nối cổng thanh toán...");

      try {
          const response = await fetch('http://localhost:5000/api/wallet/topup', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ amount, method })
          });
          const result = await response.json();

          if (response.ok && result.success) {
              modal.style.display = "none";
              topupForm.reset();
              showToast("Nạp tiền vào ví thành công!");
              renderWallet();
          } else {
              showToast(result.message || "Nạp tiền thất bại!");
          }
      } catch (error) {
          console.error("Lỗi nạp tiền:", error);
          showToast("Lỗi kết nối đến máy chủ.");
      }
    });
  }

  if ($("#menuToggle")) {
    $("#menuToggle").addEventListener("click", () => $("#mainNav").classList.toggle("open"));
  }

  $$("[data-logout]").forEach(button => button.addEventListener("click", () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "../../index.html";
    }
  }));
}

document.addEventListener("DOMContentLoaded", initProfile);