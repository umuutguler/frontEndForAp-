document.addEventListener("DOMContentLoaded", function () {
    var userInfoDiv = document.getElementById('user-info');
    var updateBtn = document.getElementById('update-btn');
  
    // Token ve locale bilgisini burada alabilirsiniz
    var token = 'token_bilgisi_buraya';
    var locale = 'locale_bilgisi_buraya';
  
    // API adresi
    var apiUrl = 'https://localhost:7190/api/userInfo/User';
  
    // API'den kullanıcı bilgilerini al ve göster
    fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then(response => response.json())
    .then(data => {
      userInfoDiv.innerHTML = `
        <p><strong>Ad:</strong> ${data.firstName}</p>
        <p><strong>Soyad:</strong> ${data.lastName}</p>
        <p><strong>Departman:</strong> ${data.department.departmentName}</p>
        <p><strong>Kullanıcı Adı:</strong> ${data.userName}</p>
        <p><strong>E-posta:</strong> ${data.email}</p>
        <p><strong>Telefon Numarası:</strong> ${data.phoneNumber}</p>
      `;
    })
    .catch(error => console.error('Error:', error));
  
    // Bilgileri güncelle butonu tıklandığında
    updateBtn.addEventListener('click', function() {
      // Kullanıcıyı updateUser.html sayfasına yönlendir
      window.location.href = 'updateUser.html';
  });
  });
  