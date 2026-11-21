// =========================================
// SUNRISE HOTEL - MY BOOKING JAVASCRIPT (MYSQL API)
// =========================================

const token = localStorage.getItem("token");

// Nếu chưa đăng nhập, chuyển hướng về trang login
if (!token) {
    window.location.href = "../login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    renderBookingHistory();
});

async function renderBookingHistory() {
    const container = document.getElementById("bookingListContainer");
    if (!container) return;

    try {
        const response = await fetch('http://localhost:5000/api/bookings', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();

        if (!result.success || !result.data || result.data.length === 0) {
            container.innerHTML = `
                <div class="empty-history">
                    <i class="fa-regular fa-folder-open"></i>
                    <h3>Bạn chưa có lịch sử đặt phòng nào</h3>
                    <p style="color: #64748b; margin: 10px 0 20px;">Hãy khám phá các hạng phòng tuyệt vời của chúng tôi và đặt ngay nhé!</p>
                    <a href="search.html" style="background: var(--navy, #0b2545); color: #fff; padding: 10px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">Tìm phòng ngay</a>
                </div>
            `;
            return;
        }

        const bookings = result.data;

        container.innerHTML = bookings.map(item => {
            let statusBadge = '';
            const status = item.booking_status || item.status;

            if (status === 'confirmed' || status === 'pending') {
                statusBadge = '<span class="booking-status status-confirmed">Chờ thanh toán</span>';
            } else if (status === 'paid' || status === 'completed') {
                statusBadge = '<span class="booking-status" style="background:#dcfce7; color:#15803d;">Đã thanh toán</span>';
            } else if (status === 'cancelled') {
                statusBadge = '<span class="booking-status status-cancelled">Đã hủy</span>';
            }

            let actionButtons = '';
            if (status === 'confirmed' || status === 'pending') {
                actionButtons = `
                    <button class="btn-pay-booking" onclick="payBookingFromMyBooking('${item.booking_id || item.id}')" style="background: #0284c7; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; margin-bottom: 6px;">Thanh toán qua Ví</button>
                    <button class="btn-cancel-booking" onclick="cancelBooking('${item.booking_id || item.id}')">Hủy phòng</button>
                `;
            }

            const adultsCount = item.adults || 2;
            const childrenCount = item.children || 0;
            const roomsCount = item.rooms_count || item.rooms || 1;
            const totalPrice = item.total_amount || item.totalPrice || 0;
            const roomName = item.room_name || "Phòng khách sạn Sunrise";
            const checkIn = item.check_in ? item.check_in.split('T')[0] : '';
            const checkOut = item.check_out ? item.check_out.split('T')[0] : '';
            const imageUrl = item.image_url || '../assets/images/room-deluxe.jpg';
            const bookingIdCode = item.booking_code || `#SR-${item.booking_id}`;

            return `
                <div class="booking-item-card">
                    <img src="${imageUrl}" alt="${roomName}">
                    <div class="booking-info">
                        ${statusBadge}
                        <h3>${roomName}</h3>
                        <p><i class="fa-regular fa-calendar" style="margin-right: 5px;"></i> Nhận phòng: <strong>${checkIn}</strong> — Trả phòng: <strong>${checkOut}</strong></p>
                        <p><i class="fa-solid fa-users" style="margin-right: 5px;"></i> Số khách: <strong>${adultsCount} người lớn</strong> · Số phòng: <strong>${roomsCount} phòng</strong></p>
                        <p style="font-size: 12px; color: #94a3b8;">Mã đặt phòng: ${bookingIdCode}</p>
                    </div>
                    <div class="booking-action-col">
                        <div>
                            <span style="font-size: 12px; color: #64748b; display: block;">Tổng tiền</span>
                            <strong style="font-size: 18px; color: #dc2626; font-family: 'Playfair Display', serif;">${Number(totalPrice).toLocaleString("vi-VN")}đ</strong>
                        </div>
                        ${actionButtons}
                    </div>
                </div>
            `;
        }).join("");

    } catch (error) {
        console.error("Lỗi tải lịch sử đặt phòng:", error);
        container.innerHTML = `<p style="text-align:center; color: #dc2626; padding: 20px;">Không thể tải dữ liệu từ máy chủ.</p>`;
    }
}

// Xử lý thanh toán từ trang lịch sử đặt phòng bằng API Ví MySQL
window.payBookingFromMyBooking = async function(bookingId) {
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
            alert("Thanh toán đơn phòng thành công từ ví!");
            renderBookingHistory(); // Load lại danh sách đơn phòng
        } else {
            alert(result.message || "Thanh toán thất bại!");
        }
    } catch (error) {
        console.error("Lỗi thanh toán:", error);
        alert("Lỗi kết nối đến máy chủ.");
    }
};

// Hàm hủy phòng qua API MySQL
window.cancelBooking = async function(bookingId) {
    if (!confirm(`Bạn có chắc chắn muốn hủy đơn đặt phòng #${bookingId} không?`)) return;

    try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const result = await response.json();

        if (response.ok && result.success) {
            alert("Đã hủy đặt phòng thành công.");
            renderBookingHistory();
        } else {
            alert(result.message || "Không thể hủy đơn phòng!");
        }
    } catch (error) {
        console.error("Lỗi hủy phòng:", error);
        alert("Lỗi kết nối đến máy chủ.");
    }
};