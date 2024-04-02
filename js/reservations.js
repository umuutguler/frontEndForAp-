upToDateReservations();
document.getElementById("create-reservation-btn").addEventListener("click", function() {
  window.location.href = "getReservation.html";
});
document.addEventListener("DOMContentLoaded", function() {
  upToDateReservations();
  const reservationList = document.getElementById("reservation-list");
  const statusSelect = document.getElementById("status");

  let currentPage = 1; // Mevcut sayfa

  // Pagination
  let totalPages = 8; // Örneğin varsayılan toplam sayfa sayısı
  const paginationContainer = document.getElementById("pagination-buttons");
  const paginationButtons = []; // Butonları saklamak için bir dizi oluştur

  // API'den rezervasyonları getirme fonksiyonu
  function fetchReservations(status, page) {
    const token = localStorage.getItem('accessToken');
    const apiUrl = `https://localhost:7190/api/Reservation/user?pageSize=7&pageNumber=${page}`;

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
      const reservations = data.reservations;
      const firstReservation = reservations[0]; // İlk rezervasyonu al
      const user = firstReservation.user; // Rezervasyondaki kullanıcı bilgisi
      const firstName = user.firstName;
      const lastName = user.lastName;
      const fullname = firstName + " " + lastName;
      const userNameH3 = document.querySelector(".userName h3");
      userNameH3.textContent = fullname;

      const metaData = data.metaData;
      totalPages = metaData.totalPage; // Toplam sayfa sayısını güncelle
      updatePaginationButtons(); // Pagination butonlarını güncelle

      reservations.forEach(reservation => {
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
            <button id="update-button" class="button update-button" onclick="updateReservation(${reservation.id})">Güncelle</button>
            <button id="cancel-button" class="button cancel-button" onclick="cancelReservation(${reservation.id})">İptal</button>
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
    fetchReservations(statusSelect.value, currentPage); // Sayfayı güncelle
    updatePaginationButtons(); // Buton durumunu güncelle
  });

  // Buton durumunu güncelleme fonksiyonu
  function updatePaginationButtons() {
    paginationContainer.innerHTML = ""; // Mevcut butonları temizle
    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.textContent = i;
      button.classList.add("pagination-button");
      if (i === currentPage) {
        button.classList.add("active");
      }
      button.addEventListener("click", () => {
        currentPage = i; // Sayfa numarasını güncelle
        fetchReservations(statusSelect.value, currentPage); // Rezervasyonları getir
        updatePaginationButtons(); // Buton durumunu güncelle
      });
      paginationButtons.push(button); // Dizide sakla
      paginationContainer.appendChild(button);
    }
  }

  // İlk yükleme için tüm rezervasyonları ve pagination butonlarını getir
  fetchReservations("current", currentPage);
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
function goToPage(page) {
  window.location.href = page;
}