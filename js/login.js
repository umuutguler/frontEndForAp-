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
  