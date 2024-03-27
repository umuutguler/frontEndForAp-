document.getElementById("create-reservation-btn").addEventListener("click", function() {
  window.location.href = "getReservation.html";
});
document.addEventListener("DOMContentLoaded", function() {
  upToDateReservations();
  const reservationList = document.getElementById("reservation-list");
  const statusSelect = document.getElementById("status");

  // Token
  const token = localStorage.getItem('accessToken');

  // API URL
  const apiUrl = "https://localhost:7190/api/Reservation/user?pageSize=10&pageNumber=1";

  // GET request
  function fetchReservations(status) {
    fetch(apiUrl + "&status=" + status, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json" // JSON formatında yanıt talep et
      }
    })
    .then(response => response.json())
    .then(data => {
      reservationList.innerHTML = ""; // Mevcut listeyi temizle
      data.forEach(reservation => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${reservation.id}</td>
          <td>${reservation.status}</td>
          <td>${reservation.reservationPrice}</td>
          <td>${reservation.duration}</td>
          <td>${formatDate(reservation.reservationStartDate)}</td>
          <td>${formatDate(reservation.reservationEndDate)}</td>
          <td>${formatDate(reservation.createDate)}</td>
          <td>${reservation.chairId}</td>
          <td class="button-container">
            <button class="button update-button" onclick="updateReservation(${reservation.id})">Güncelle</button>
            <button class="button cancel-button" onclick="cancelReservation(${reservation.id})">İptal</button>
          </td>
        `;
        reservationList.appendChild(row);
        // Buton rengini ayarla
        const cancelButton = row.querySelector(".cancel-button");
        const updateButton = row.querySelector(".update-button");
        if (cancelButton && updateButton) {
          if (reservation.status === "canceled" || reservation.status === "nonCurrent") {
            cancelButton.style.backgroundColor = "red";
            updateButton.style.backgroundColor = "red";
          }
        }
      });
    })
    .catch(error => {
      console.error("Error:", error);
    });
  }

  // Seçim değiştiğinde filtreleme işlemini gerçekleştir
  statusSelect.addEventListener("change", function() {
    const selectedStatus = statusSelect.value;
    fetchReservations(selectedStatus);
  });

  // İlk yükleme için tüm rezervasyonları getir
  fetchReservations("current");

});

function formatDate(dateTimeString) {
  const date = new Date(dateTimeString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

function updateReservation(reservationId) {
  // Rezervasyon güncelleme sayfasına yönlendirme
  window.location.href = `updateReservation.html?id=${reservationId}`;
}

function cancelReservation(reservationId) {
  const url = `https://localhost:7190/api/Reservation/cancel/${reservationId}`;

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  })
  .then(response => {
    if (response.status === 204) {
      // Rezervasyon başarıyla iptal edildi
      alert('Rezervasyon başarıyla iptal edildi.');
      // Sayfayı yenile
      window.location.reload();
    } else {
      throw new Error('Rezervasyon iptal edilemedi. Sunucu hatası.');
    }
  })
  .catch(error => {
    console.error('Hata:', error.message);
  });
}

function upToDateReservations() {
  const url = `https://localhost:7190/api/Reservation/uptodate`;

  fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  })
  .then(response => {
    if (response.status === 204) {
    } else {
      throw new Error('Rezervasyon güncellenemedi. Sunucu hatası.');
    }
  })
  .catch(error => {
    console.error('Hata:', error.message);
  });
}