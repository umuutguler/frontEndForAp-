document.addEventListener("DOMContentLoaded", function () {
    // Ay selectine seçeneklerin eklenmesi
    const monthSelect = document.getElementById("expiration-month");
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        option.text = i.toString();
        option.value = i.toString();
        monthSelect.add(option);
    }

    // Yıl selectine seçeneklerin eklenmesi
    const yearSelect = document.getElementById("expiration-year");
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 20;
    for (let year = currentYear; year <= maxYear; year++) {
        const option = document.createElement("option");
        option.text = year.toString();
        option.value = year.toString();
        yearSelect.add(option);
    }

    // Kart ismi için sadece harf kabul eden doğrulama
    const cardNameInput = document.getElementById("card-name");
    cardNameInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^a-zA-ZĞğÜüŞşİıÖöÇç ]/g, ''); // Sadece harfleri ve boşlukları kabul et
    });

    // Kart numarası için 16 haneli numara doğrulaması
    const cardNumberInput = document.getElementById("card-number");
    cardNumberInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ''); // Sadece rakamları kabul et
        const formattedValue = this.value.replace(/(\d{4})(?=\d)/g, '$1 '); // Numarayı 4 haneli bloklara ayır
        this.value = formattedValue.trim().substr(0, 19); // 19 karakter sınırı
    });

    // CVV için sadece 3 haneli sayı doğrulaması
    const cvvInput = document.getElementById("cvv");
    cvvInput.addEventListener("input", function () {
        this.value = this.value.replace(/\D/g, ''); // Sadece rakamları kabul et
        this.value = this.value.substr(0, 3); // 3 karakter sınırı
    });

    // Ödeme yap butonunu seç
    const paymentButton = document.querySelector("button[type='submit']");

    // Butona tıklama olayı
    paymentButton.addEventListener("click", function (event) {
        event.preventDefault(); // Sayfanın yenilenmesini önle

        // Kart bilgilerini al
        const cardName = document.getElementById("card-name").value;
        const cardNumber = document.getElementById("card-number").value;
        const expirationMonth = document.getElementById("expiration-month").value;
        const expirationYear = document.getElementById("expiration-year").value;
        const cvv = document.getElementById("cvv").value;

        // URL'den parametreleri al
        const urlParams = new URLSearchParams(window.location.search);
        const reservationStartDate = urlParams.get('reservationStartDate');
        const duration = urlParams.get('duration');
        const chairId = urlParams.get('chairId');

        // Post isteği için gereken veri
        const reservationData = {
            reservationStartDate: reservationStartDate,
            duration: duration,
            chairId: chairId,

            cardName: cardName,
            cardNumber: cardNumber,
            expirationMonth: expirationMonth,
            expirationYear: expirationYear,
            cvv: cvv

            
        };

        // API URL
        const postUrl = "https://localhost:7190/api/Reservation/with-payment";
        console.log(reservationData);

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
                createdReservation(data.id);
            })
            .catch(error => {
                console.error("Hata:", error);
                alert("Rezervasyon oluşturulamadı. Bir hata oluştu.");
            });

            function createdReservation(reservationId) {
                window.location.href = `createdReservation.html?id=${reservationId}`;
              }
    });
});
