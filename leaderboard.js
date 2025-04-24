document.addEventListener("DOMContentLoaded", () => {
  // 1) آرایهٔ رکوردها
  let records = [];

  // 2) توابع save / load
  function saveToStorage() {
    localStorage.setItem("lb-records", JSON.stringify(records));
  }
  function loadFromStorage() {
    const data = localStorage.getItem("lb-records");
    if (data) {
      try {
        const arr = JSON.parse(data);
        if (Array.isArray(arr)) records = arr;
      } catch {
        records = [];
      }
    }
  }

  // 3) تولید timestamp فارسی
  function getCurrentTimestamp() {
    const d = new Date();
    return d.toLocaleDateString("fa-IR") + " ، " + d.toLocaleTimeString("fa-IR");
  }

  // 4) ۱) بارگذاری رکوردهای پیشین
  loadFromStorage();

  //    ۲) اگر پارامترهای URL موجودند، یک رکورد جدید اضافه کن
  const params = new URLSearchParams(window.location.search);
  const pName  = params.get("name");
  const pKlass = params.get("klass");
  const pScore = params.get("score");
  if (pName && pKlass && pScore && !isNaN(parseInt(pScore, 10))) {
    records.push({
      name:  decodeURIComponent(pName),
      klass: decodeURIComponent(pKlass),
      score: parseInt(pScore, 10),
      date:  getCurrentTimestamp()
    });
    saveToStorage();
    // پاک کردن کوئری‌استرینگ تا در رفرش دوباره اضافه نشود
    history.replaceState(null, "", "leaderboard.html");
  }

  // 5) رندر جدول اولیه
  renderTable();

  // 6) تعریف تابع renderTable
  function renderTable() {
    const tbody = document.querySelector("#leaderboard-table tbody");
    tbody.innerHTML = "";
    records.forEach((rec, idx) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${idx + 1}</td>
        <td>${rec.name}</td>
        <td>${rec.klass}</td>
        <td>${rec.score}</td>
        <td>${rec.date}</td>
        <td><button class="delete-btn" data-index="${idx}">حذف</button></td>
      `;
      tbody.appendChild(tr);
    });
    // هندل کردن حذف هر ردیف
    tbody.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const i = +btn.dataset.index;
        records.splice(i, 1);
        saveToStorage();
        renderTable();
      });
    });
  }

  // 7) افزودن دستی رکورد از فرم
  document.getElementById("add-record").addEventListener("click", () => {
    const nameEl  = document.getElementById("name");
    const klassEl = document.getElementById("klass");
    const scoreEl = document.getElementById("score");
    const name  = nameEl.value.trim();
    const klass = klassEl.value.trim();
    const score = parseInt(scoreEl.value, 10);
    if (!name || !klass || isNaN(score)) {
      return alert("لطفاً همهٔ فیلدها را به‌درستی پر کنید.");
    }
    records.push({ name, klass, score, date: getCurrentTimestamp() });
    saveToStorage();
    renderTable();
    nameEl.value = "";
    klassEl.value = "";
    scoreEl.value = "";
  });

  // 8) حذف همهٔ رکوردها
  document.getElementById("clear-all").addEventListener("click", () => {
    if (!records.length) return;
    if (confirm("آیا از حذف همهٔ رکوردها مطمئن هستید؟")) {
      records = [];
      saveToStorage();
      renderTable();
    }
  });

  // 9) دانلود JSON
  document.getElementById("download-json").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "leaderboard.json";
    a.click();
  });

  // 10) بارگذاری JSON
  const uploadBtn   = document.getElementById("upload-json");
  const uploadInput = document.getElementById("upload-json-input");
  uploadBtn.addEventListener("click", () => uploadInput.click());
  uploadInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      return alert("لطفاً یک فایل JSON انتخاب کنید.");
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const arr = JSON.parse(reader.result);
        if (!Array.isArray(arr)) throw "فرمت JSON اشتباه است.";
        const ok = arr.every(item =>
          item.name && item.klass && item.score != null && item.date
        );
        if (!ok) throw "ساختار آرایهٔ JSON نادرست است.";
        records = arr;
        saveToStorage();
        renderTable();
        alert("بارگذاری JSON با موفقیت انجام شد.");
      } catch (err) {
        alert("خطا در بارگذاری JSON: " + err);
      }
    };
    reader.readAsText(file, "utf-8");
  });

  // 11) بازگشت به منو
  document.getElementById("back-menu").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // 12) پخش موسیقی زمینه (اگر موجود است)
  
  const bgMusic = document.getElementById("menu-bg");
  if (bgMusic) {
    bgMusic.volume = 0.05;
    bgMusic.play().catch(() => {
      // روی اولین کلیک کاربر مجدداً تلاش کن
      document.body.addEventListener("click", () =>
        bgMusic.play().catch(() => {}), { once: true }
      );
    });
  }

  // 13) صدای کلیک روی تمام دکمه‌ها
  const clickSound = document.getElementById("click-sound");
  if (clickSound) {
    document.querySelectorAll("button").forEach(btn =>
      btn.addEventListener("click", () => {
        clickSound.currentTime = 0;
        clickSound.volume = 0.10;
        clickSound.play().catch(() => {});
      })
    );
  }
});
document.addEventListener("DOMContentLoaded", () => {
  // انتخاب عنصر صوتی
  const bgMusic = document.getElementById("menu-bg");

  // بررسی اگر موسیقی پس‌زمینه موجود است
  if (bgMusic) {
    // تنظیم ولوم
    bgMusic.volume = 0.05;

    // تلاش برای پخش موسیقی
    bgMusic.play().catch(() => {
      document.body.addEventListener(
        "click",
        () => bgMusic.play().catch(() => {}),
        { once: true }
      );
    });

    // توقف و ادامه موسیقی هنگام جابه‌جایی بین تب‌ها
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        // توقف موسیقی هنگام غیرفعال شدن تب
        bgMusic.pause();
      } else {
        // ادامه موسیقی هنگام بازگشت به تب
        bgMusic.play().catch(() => {});
      }
    });
  }

  // سایر کدهای قبلی leaderboard.js...
});
