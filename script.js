// کلید مورد استفاده در LocalStorage
const LS_KEY = "leaderboardRecords";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody   = document.querySelector("#score-table tbody");
  const exportBtn   = document.getElementById("export-btn");
  const homeBtn     = document.getElementById("home-button");

  // ۱) بازیابی رکوردها از LocalStorage
  let records = JSON.parse(localStorage.getItem(LS_KEY) || "[]");

  // ۲) مرتب‌سازی نزولی بر اساس امتیاز
  records.sort((a, b) => b.score - a.score);

  // ۳) رندر جدول
  records.forEach((rec, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${rec.score}</td>
      <td>${new Date(rec.date).toLocaleString("fa-IR")}</td>
    `;
    tableBody.appendChild(tr);
  });

  // ۴) هندل کلیک روی دکمهٔ دانلود
  exportBtn.addEventListener("click", () => {
    // تبدیل آرایهٔ رکوردها به JSON خوانا
    const dataStr = JSON.stringify(records, null, 2);
    const blob    = new Blob([dataStr], { type: "application/json" });
    const url     = URL.createObjectURL(blob);

    // ساخت تگ <a> و تریگر کلیک روی آن
    const a = document.createElement("a");
    a.href        = url;
    a.download    = "leaderboard.json";
    document.body.appendChild(a);  // باید در DOM باشد
    a.click();
    document.body.removeChild(a);

    // آزادسازی منبع
    URL.revokeObjectURL(url);
  });

  // ۵) دکمه بازگشت به خانه
  homeBtn.addEventListener("click", () => {
    // صدای کلیک (در صورت نیاز)
    document.getElementById("click-sound")?.play();
    // هدایت به صفحه اصلی
    location.href = "index.html";
  });
});
