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
const API_URL = "https://script.google.com/macros/s/AKfycbwNX06lK-wBWEiv8roFVzxWAUooLToP6Uu5emcPaMz1cHebbrBj0oI28dCeCEWssabX/exec"; // آدرس API که از Google Apps Script گرفتی

async function getLeaderboard() {
  try {
    const response = await fetch(`${API_URL}?action=getLeaderboard`);
    const data = await response.json();

    if (data.result === "success") {
      displayLeaderboard(data.data);
    } else {
      console.error("Error getting leaderboard:", data.message);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayLeaderboard(leaderboardData) {
  const tableBody = document.querySelector("#leaderboardTable tbody");
  tableBody.innerHTML = ""; // پاک کردن جدول قبلی

  leaderboardData.forEach(entry => {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = entry.Name;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = entry.Score;

    const timestampCell = document.createElement("td");
    timestampCell.textContent = entry.Timestamp; // یا میتونی تاریخ رو فرمت کنی

    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    row.appendChild(timestampCell);

    tableBody.appendChild(row);
  });
}

// فراخوانی تابع برای دریافت Leaderboard وقتی صفحه لود میشه
window.onload = getLeaderboard;
