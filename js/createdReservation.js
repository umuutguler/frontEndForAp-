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
      reservationStartDateSpan.textContent = formatDate(data.reservationStartDate);
      reservationEndDateSpan.textContent = formatDate(data.reservationEndDate);
      reservationCreateDateSpan.textContent = formatDate(data.createDate);
      reservationChairIdSpan.textContent = data.chairId;
    })
    .catch(error => {
      console.error("Error:", error);
    });
    homeBtn.addEventListener('click', function() {
        window.location.href = 'reservations.html';
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

});
