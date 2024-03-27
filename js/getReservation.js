document.addEventListener("DOMContentLoaded", function() {
  const viewChairsBtn = document.getElementById("view-chairs-btn");
  const chairContainer = document.getElementById("chair-container");

  viewChairsBtn.addEventListener("click", function() {
    const startDate = formatDate(new Date(document.getElementById("calendar").value));
    console.log(startDate);

    const duration = document.getElementById("duration").value;

    // API URL
    const apiUrl = `https://localhost:7190/api/Reservation/empty?reservationStartDate=${startDate}&duration=${duration}`;
    const token = localStorage.getItem('accessToken');

      // GET isteği
      fetch(apiUrl, {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json" // JSON formatında yanıt talep et
          },
      })
      .then(response => response.json())
      .then(data => {
          // Sandalyeleri görüntüle
          displayChairs(data);
      })
      .catch(error => {
          console.error("Error:", error);
      });
  });

  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }


  function displayChairs(chairs) {
      chairContainer.innerHTML = ""; // Önceki sandalyeleri temizle

      chairs.forEach(chair => {
          const chairElement = document.createElement("div");
          chairElement.classList.add("chair");
          chairElement.setAttribute("data-chair-id", chair.id);

          // Chair resmi ekle
          const chairImage = document.createElement("img");
          chairImage.alt = "Chair";
          chairImage.src = chair.status ? "items/chair2.svg" : "items/chair.svg"; // Sandalye durumuna göre resim yolu seçimi
          chairElement.appendChild(chairImage);

          // Chair id bilgisi
          const chairIdSpan = document.createElement("span");
          chairIdSpan.textContent = `Sandalye No: ${chair.id}`;
          chairElement.appendChild(chairIdSpan);

          // Tıklanabilir chair
          chairElement.addEventListener("click", function() {
              const selectedChairId = chair.id;

              // POST isteği için gereken veri
              const reservationData = {
                  reservationStartDate: document.getElementById("calendar").value,
                  duration: document.getElementById("duration").value,
                  chairId: selectedChairId
              };

              // API URL
              const postUrl = "https://localhost:7190/api/Reservation";

              // Token
              const token = localStorage.getItem('accessToken');

              // POST request
              fetch(postUrl, {
                  method: "POST",
                  headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json",
                      "Accept": "application/json"
                  },
                  body: JSON.stringify(reservationData)
              })
              .then(response => {
                if (response.ok) {
                    return response.json(); // JSON yanıtını işle
                } else {
                    throw new Error('Bir hata oluştu. Sunucudan yanıt alınamadı.');
                }
            })
            .then(data => {
                createdReservation(data.id); // Oluşturulan rezervasyonun ID'sini aldığımız fonksiyona gönder
            })
              .catch(error => {
                  console.error("Hata:", error);
                  alert("Rezervasyon oluşturulamadı. Bir hata oluştu.");
              });
          });

          chairContainer.appendChild(chairElement);
      });
  }

  function createdReservation(reservationId) {
    window.location.href = `createdReservation.html?id=${reservationId}`;
  }

});
