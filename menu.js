// menu.js
document.addEventListener("DOMContentLoaded", () => {
  // مطمئن شوید فولدر شما sounds/ نام دارد
  const clickSound = new Audio("sounds/click.mp3");

  function playClick() {
    clickSound.currentTime = 0;
    clickSound.play().catch(()=>{});
  }

  // تابع کمکی برای پخش صدا و سپس ناوبری
  function clickAndGo(href) {
    playClick();
    setTimeout(() => {
      window.location.href = href;
    }, 15);  // 15ms تأخیر برای شنیدن صدا
  }

  // دکمه «به‌زودی»
  document.getElementById("coming-soon-btn")
    .addEventListener("click", () => {
      playClick();
      alert("به‌زودی …");
      clickSound.volume = 0.10;
    });



  // دکمه «لیدر‌بورد»
  document.getElementById("leaderboard-menu-btn")
    .addEventListener("click", () => {
      clickAndGo("leaderboard.html");
    });
});
const bgMusic    = document.getElementById("bg-music");

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play();
  clickSound.volume = 0.10;
}

// تابع شروع پخش موزیک منو
function startBgMusic() {
  // تنظیم ولوم (۰ تا ۱)
  bgMusic.volume = 0.05;

  // تلاش برای autoplay
  bgMusic.play().catch(err => {
    // در صورت مسدود بودن autoplay، 
    // موزیک با اولین تعامل کاربر (کلیک روی بدنه) پخش می‌شود:
    document.body.addEventListener(
      "click",
      () => {
        bgMusic.play();
      },
      { once: true }
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  // ۱) پخش موزیک پس‌زمینه
  startBgMusic();

  // ۲) هندل دکمه‌ها
  
  document.getElementById("leaderboard-menu-btn")
    .addEventListener("click", () => {
      playClick();
      window.location.href = "leaderboard.html";
      clickSound.volume = 0.10;
    });
});
// menu.js

const playBtn   = document.getElementById("play-game-btn");
const clickSound = new Audio("sounds/click.mp3");

function playClick() {
  clickSound.currentTime = 0;
  clickSound.play().catch(_=>{});
  clickSound.volume = 0.10;
}

playBtn.addEventListener("click", e => {
  e.preventDefault();       // جلوی رفتار پیش‌فرض (اگر لینک بود)
  playClick();
  clickSound.volume = 0.10;

  // فقط یک تب جدید باز کن؛ تب فعلی هیچ تغییری نمی‌کند
  window.open("loader.html?redirect=game.html", "_blank");
});
