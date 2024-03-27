document.addEventListener("DOMContentLoaded", function() {
    const reservationDetails = document.getElementById("reservation-details");
    const reservationIdSpan = document.getElementById("reservation-id");
    const reservationStatusSpan = document.getElementById("reservation-status");
    const reservationPriceSpan = document.getElementById("reservation-price");
    const reservationDurationSpan = document.getElementById("reservation-duration");
    const reservationStartDateSpan = document.getElementById("reservation-start-date");
    const reservationEndDateSpan = document.getElementById("reservation-end-date");
    const reservationCreateDateSpan = document.getElementById("reservation-create-date");
    const reservationChairIdSpan = document.getElementById("reservation-chair-id");
    var homeBtn = document.getElementById('home-btn');
  
    // Rezervasyon ID'sini alma
    const urlParams = new URLSearchParams(window.location.search);
    const reservationId = urlParams.get('id');
  
    // API URL
    const apiUrl = `https://localhost:7190/api/Reservation/${reservationId}`;
  
    // GET request
    fetch(apiUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('accessToken')}`,
        "Accept": "application/json" // JSON formatında yanıt talep et
      }
    })
    .then(response => response.json())
    .then(data => {
      // Reservation bilgilerini göster
      reservationDetails.classList.remove("hidden");
      reservationIdSpan.textContent = data.id;
      reservationStatusSpan.textContent = data.status;
      reservationPriceSpan.textContent = data.reservationPrice;
      reservationDurationSpan.textContent = data.duration;
      reservationStartDateSpan.textContent = data.reservationStartDate;
      reservationEndDateSpan.textContent = data.reservationEndDate;
      reservationCreateDateSpan.textContent = data.createDate;
      reservationChairIdSpan.textContent = data.chairId;
  
      // Formdaki başlangıç tarihi alanına rezervasyonun başlangıç tarihini yerleştir
      const reservationStartDateInput = document.getElementById("reservationStartDate");
      reservationStartDateInput.value = formatDate(data.reservationStartDate); // Tarih formatını düzgün formata dönüştür
    })
    .catch(error => {
      console.error("Error:", error);
    });
    homeBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});
