document.addEventListener("DOMContentLoaded", function () {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      selectable: true,
      dateClick: function(info) {
        var selectedDate = info.dateStr;
        document.getElementById('start-date').value = selectedDate;
        document.getElementById('end-date').value = selectedDate;
      }
    });
    calendar.render();
  
    var submitBtn = document.getElementById('submit-btn');
    submitBtn.addEventListener('click', function() {
      var startDate = document.getElementById('start-date').value;
      var endDate = document.getElementById('end-date').value;
      console.log("Başlangıç Tarihi:", startDate);
      console.log("Bitiş Tarihi:", endDate);
      // Burada seçilen tarih aralığını kullanabilirsiniz
    });
  });
  