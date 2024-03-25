document.addEventListener("DOMContentLoaded", function() {
    upToDateReservations();
    const reservationList = document.getElementById("reservation-list");
  
    // Token
    const token = localStorage.getItem('accessToken');
  
    // API URL
    const apiUrl = "https://localhost:7190/api/Reservation/user";

    // GET request
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json" // JSON formatında yanıt talep et
      }
    })
    .then(response => response.json())
    .then(data => {
      data.forEach(reservation => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${reservation.id}</td>
          <td>${reservation.status}</td>
          <td>${reservation.reservationPrice}</td>
          <td>${reservation.duration}</td>
          <td>${reservation.reservationStartDate}</td>
          <td>${reservation.reservationEndDate}</td>
          <td>${reservation.createDate}</td>
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
  });
  
  function updateReservation(reservationId) {
    // Rezervasyon güncelleme işlemi
    // Örneğin: window.location.href = 'update.html?id=' + reservationId;
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