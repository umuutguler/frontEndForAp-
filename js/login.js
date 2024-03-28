document.addEventListener("DOMContentLoaded", function() {
  const accessToken = localStorage.getItem('accessToken'); // Kayıtlı token'ı al

  if (accessToken) { // Eğer kayıtlı token varsa
      const tokenPayload = parseJwt(accessToken); // Token'ın içeriğini çözümle
      const currentTime = Math.floor(Date.now() / 1000); // Şuanki zamanı saniye cinsinden al

      // Eğer token'ın exp değeri şimdiki zamandan büyükse
      if (tokenPayload.exp > currentTime) {
          // Kullanıcıyı doğrudan reservations.html sayfasına yönlendir
          window.location.href = 'reservations.html';
      } else {
          // Eğer token'ın exp değeri geçmişse, kullanıcıyı tekrar giriş yapması için login sayfasına yönlendir
          window.location.href = 'login.html';
      }
  }
});

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch('https://localhost:7190/api/authentication/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password })
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Giriş başarısız. Sunucu hatası.');
      }
      return response.json();
  })
  .then(data => {
      if (!data.accessToken || !data.refreshToken) {
          throw new Error('Giriş başarısız. Alınan token verileri eksik.');
      }
      const accessToken = data.accessToken; // Access token'ı al
      const refreshToken = data.refreshToken; // Refresh token'ı al
      localStorage.setItem('accessToken', accessToken); // Access token'ı local storage'a kaydet
      localStorage.setItem('refreshToken', refreshToken); // Refresh token'ı local storage'a kaydet
      window.location.href = 'reservations.html'; // Yönlendirme
  })
  .catch(error => {
      document.getElementById("error-message").innerText = error.message;
  });
}
