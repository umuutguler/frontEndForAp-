document.addEventListener("DOMContentLoaded", function () {
    const viewChairsBtn = document.getElementById("view-chairs-btn");
    const chairContainer = document.getElementById("chair-container");

    viewChairsBtn.addEventListener("click", function () {
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

            const chairPriceSpan = document.createElement("span");
            chairPriceSpan.textContent = `Ücret: ${chair.price}$`;
            chairElement.appendChild(chairPriceSpan);

            // Tıklanabilir chair
            chairElement.addEventListener("click", function () {
                const selectedChairId = chair.id;

                // Modalı oluştur
                const modal = document.getElementById("reservationModal");

                // Modalı göster
                modal.style.display = "block";

                // Onayla butonuna tıklandığında
                const confirmButton = document.getElementById("confirmButton");
                confirmButton.addEventListener("click", function () {
                    // Seçilen sandalyenin bilgilerini al
                    const reservationStartDate = document.getElementById("calendar").value;
                    const duration = document.getElementById("duration").value;

                    // Oluşturulan link için query string oluştur
                    const queryString = `?reservationStartDate=${reservationStartDate}&duration=${duration}&chairId=${selectedChairId}`;

                    // Yönlendirme yapılacak URL
                    const redirectUrl = `payment.html${queryString}`;

                    // Sayfayı yönlendir
                    window.location.href = redirectUrl;

                    // Modalı kapat
                    modal.style.display = "none";
                    // Arka planın blur efektini kaldır
                    document.body.style.filter = "none";
                });

                // İptal butonuna tıklandığında
                const cancelButton = document.getElementById("cancelButton");
                cancelButton.addEventListener("click", function () {
                    // Modalı kapat
                    modal.style.display = "none";
                    // Arka planın blur efektini kaldır
                    document.body.style.filter = "none";
                });

                // Modal kapatma işaretine tıklandığında
                const modalCloseButton = document.getElementById("modalClose");
                modalCloseButton.addEventListener("click", function () {
                    // Modalı kapat
                    modal.style.display = "none";
                    // Arka planın blur efektini kaldır
                    document.body.style.filter = "none";
                });
            });

            chairContainer.appendChild(chairElement);
        });
    }
});
