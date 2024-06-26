document.addEventListener("DOMContentLoaded", function() {
    const updateForm = document.getElementById("update-form");
  
    updateForm.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const formData = new FormData(updateForm);
      const requestData = {};
      formData.forEach((value, key) => {
        requestData[key] = value;
      });
  
      const apiUrl = "https://localhost:7190/api/userInfo/update";
      const token = localStorage.getItem("accessToken");
  
      fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData)
      })
      .then(response => {
        if (response.ok) {
          alert("Kullanıcı bilgileri başarıyla güncellendi.");
          window.location.href = "userInfo.html"; // Kullanıcı bilgileri sayfasına yönlendir
        } else {
          throw new Error("Kullanıcı bilgileri güncellenirken bir hata oluştu.");
        }
      })
      .catch(error => {
        console.error("Hata:", error.message);
      });
    });

// Change Password

    const updatePassword = document.getElementById("update-password");
  
    updatePassword.addEventListener("submit", function(event) {
      event.preventDefault();
  
      const formData = new FormData(updatePassword);
      const requestData = {};
      formData.forEach((value, key) => {
        requestData[key] = value;
      });
  
      const apiUrl = "https://localhost:7190/api/userInfo/change-password";
      const token = localStorage.getItem("accessToken");
  
      fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData)
      })
      .then(response => {
        if (response.ok) {
          alert("Şifre başarıyla güncellendi.");
          localStorage.removeItem('accessToken');
          window.location.href = 'login.html';
        } else {
          throw new Error("Şifre güncellenirken bir hata oluştu.");
        }
      })
      .catch(error => {
        console.error("Hata:", error.message);
      });
    });

  });
  