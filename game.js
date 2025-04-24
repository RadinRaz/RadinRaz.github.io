// game.js

// ۱) نمونه‌ی Audio برای افکت پایان وقت
const timeUpSound = new Audio('sounds/timeup.mp3');
// preload کردن صدا
timeUpSound.preload = 'auto';


// ====== الگوها (وزن‌ها) ======
const PATTERNS = [
    "فَعَلَ - يَفْعَلُ",  // وزن «فَعَلَ يَفْعَلُ»
    "فَعَلَ - يَفْعِلُ",  // وزن «فَعَلَ يَفْعِلُ»
    "فَعَلَ - يَفْعُلُ"   // وزن «فَعَلَ يَفْعُلُ»
  ];
  
  // ====== کلمات منطبق با هر وزن ======
  const WORDS = [
    // ۰ → فَعَلَ - يَفْعَلُ
    [
      "خَافَ - يَخَافُ",
      "سَعَى - يَسْعَى",
      "ذَهَبَ - يَذْهَبُ",
      "رَأَى - يَرَى",
      "شَاءَ - يَشَاءُ",
      "سَأَلَ - يَسْأَلُ",
      "نَهَى - يَنْهَى",
      "نَامَ - يَنَامُ",
      "يَقِظَ - يَيْقَظُ",
      "أَبَى - يَأْبَى",
      "كَادَ - يَكَادُ",
      "لَسَعَ - يَلْسَعُ",
      "رَعَى - يَرْعَى",
      "يَزَالُ - لَا يَزَالُ",
      "سَحَبَ - يَسْحَبُ",
      "طَغَى - يَطْغَى",
      "هَابَ - يَهَابُ",
      "قَرَأَ - يَقْرَأُ"
    ],
    // ۱ → فَعَلَ - يَفْعِلُ
    [
      "سَارَ - يَسِيرُ",
      "بَكَى - يَبْكِي",
      "جَلَسَ - يَجْلِسُ",
      "صَادَ - يَصِيدُ",
      "جَرَى - يَجْرِي",
      "قَفَزَ - يَقْفِزُ",
      "غَابَ - يَغِيبُ",
      "خَشِيَ - يَخْشَى",
      "حَمَلَ - يَحْمِلُ",
      "عَاشَ - يَعِيشُ",
      "رَمَى - يَرْمِي",
      "غَسَلَ - يَغْسِلُ",
      "طَارَ - يَطِيرُ",
      "غَلَى - يَغْلِي",
      "نَزَلَ - يَنْزِلُ",
      "زَادَ - يَزِيدُ",
      "أَتَى - يَأْتِي",
      "حَبَسَ - يَحْبِسُ",
      "بَاعَ - يَبِيعُ",
      "يَدْرِي - لَا يَدْرِي",
      "رَجَعَ - يَرْجِعُ",
      "صَاحَ - يَصِيحُ"
    ],
    // ۲ → فَعَلَ - يَفْعُلُ
    [
      "دَارَ - يَدُورُ",
      "دَنَا - يَدْنُو",
      "خَرَجَ - يَخْرُجُ",
      "قَالَ - يَقُولُ",
      "دَعَا - يَدْعُو",
      "كَتَبَ - يَكْتُبُ",
      "طَفَا - يَطْفُو",
      "غَاصَ - يَغُوصُ",
      "دَخَلَ - يَدْخُلُ",
      "قَامَ - يَقُومُ",
      "نَمَا - يَنْمُو",
      "أَمَرَ - يَأْمُرُ",
      "عَفَا - يَعْفُو",
      "تَابَ - يَتُوبُ",
      "مَحَا - يَمْحُو",
      "عَادَ - يَعُودُ",
      "نَظَرَ - يَنْظُرُ",
      "سَاقَ - يَسُوقُ",
      "نَجَا - يَنْجُو",
      "سَقَطَ - يَسْقُطُ"
    ]
  ];
  
  document.addEventListener("DOMContentLoaded", () => {
    // المان‌های DOM
    const clickSound   = document.getElementById("click-sound");
    const gameContainer = document.getElementById("game-container");
    const endContainer  = document.getElementById("end-container");
    const timeLeftEl    = document.getElementById("time-left");
    const scoreEl       = document.getElementById("score");
    const questionEl    = document.getElementById("question");
    const choiceBtns    = Array.from(document.querySelectorAll(".option-btn"));
    const finalScoreEl  = document.getElementById("final-score");
    const restartBtn    = document.getElementById("restart-btn");
    const homeBtn       = document.getElementById("home-btn");
   
  
    let timerInterval, timeLeft, score, acceptingAnswer, currentCorrectPattern;
  
    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
  
    function playClick() {
        if (!clickSound) return console.error("clickSound is null!");
        clickSound.currentTime = 0;
        clickSound.play().catch(e => console.warn("playClick blocked:", e));
    }
  
    function startGame() {
      playClick();
      score = 0;
      timeLeft = 20;
      scoreEl.innerText    = score;
      timeLeftEl.innerText = timeLeft;
      endContainer.classList.add("hidden");
      gameContainer.classList.remove("hidden");
      clearInterval(timerInterval);
      timerInterval = setInterval(countdown, 1000);
      loadNextQuestion();
    }
  
    function loadNextQuestion() {
      acceptingAnswer = false;
      const patIdx = Math.floor(Math.random() * PATTERNS.length);
      currentCorrectPattern = PATTERNS[patIdx];
      const wordArr = WORDS[patIdx];
      const word = wordArr[Math.floor(Math.random() * wordArr.length)];
  
      questionEl.innerText = `فعل "${word}" مطابق کدام وزن است؟`;
      questionEl.classList.add("fade-in");
  
      const choices = shuffle([...PATTERNS]);
      choiceBtns.forEach((btn, idx) => {
        btn.innerText = choices[idx];
        btn.dataset.correct = choices[idx] === currentCorrectPattern;
        btn.classList.remove("correct", "incorrect");
      });
  
      acceptingAnswer = true;
    }
  
    function countdown() {
      timeLeft--;
      timeLeftEl.innerText = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endGame();
      }
    }
  
    function endGame() {
      playClick();
      finalScoreEl.innerText = score;
      gameContainer.classList.add("hidden");
      endContainer.classList.remove("hidden");
    }
// در انتهای تابع endGame()‌ در game.js
function endGame() {
  acceptingAnswer = false;
  gameContainer.classList.add("hidden");
  finalScoreEl.innerText = score;
  endContainer.classList.remove("hidden");

  // ====== این بخش را اضافه کنید ======
  // ۱- از کاربر نام و کلاس بگیرید
  const playerName  = prompt("🏷️ لطفاً نام خود را وارد کنید:");
  const playerClass = prompt("🏫 لطفاً کلاس خود را وارد کنید:");

  // ۲- آرایه لیدربورد را از localStorage بخوانید (یا آرایه خالی جدید بسازید)
  let leaderboard = JSON.parse(localStorage.getItem("lb-records") || "[]");

  // ۳- رکورد جدید را به آرایه اضافه کنید
  leaderboard.push({
    name:  playerName || "بدون نام",
    klass: playerClass || "—",
    score: score,
    date:  new Date().toLocaleString()
  });

  // ۴- ذخیره‌ی آرایه به‌روز شده در localStorage
  localStorage.setItem("lb-records", JSON.stringify(leaderboard));

  // ۵- هدایت به صفحه‌ی لیدربورد
  window.location.href = "leaderboard.html";
  // ===================================
}

    choiceBtns.forEach(btn => {
      btn.addEventListener("click", e => {
        if (!acceptingAnswer) return;
        acceptingAnswer = false;
        const isCorrect = btn.dataset.correct === "true";
        if (isCorrect) {
          score++;
          scoreEl.innerText = score;
          btn.classList.add("correct");
        } else {
        // کسر امتیاز روی جواب نادرست|
         score = Math.max(0, score);
        scoreEl.innerText = score;
        btn.classList.add("incorrect");
        
        score--;
        scoreEl.innerText = score;
         btn.classList.add("incorrect");
         // اگر خواستی نشان بدهی گزینه‌ی درست کدام است:
         const correctBtn = optionBtns.find(b => b.dataset.correct === "true");
         if (correctBtn) correctBtn.classList.add("correct");
        }
        setTimeout(() => {
          questionEl.classList.remove("fade-in");
          loadNextQuestion();
        }, 500);
      });
    });
  
    restartBtn.addEventListener("click", startGame);
    homeBtn.addEventListener("click", () => {
      playClick();
      window.location.href = "index.html";
    });
  
const optionBtns = Array.from(document.querySelectorAll(".option-btn"));

optionBtns.forEach(btn => {
  btn.addEventListener("click", e => {
    // اول صدای کلیک
    playClick();
    clickSound.volume = 0.10;

    // سپس اگر پاسخ قابل پذیرش نیست، از ادامه جلوگیری کن
    if (!acceptingAnswer) return;
    acceptingAnswer = false;

    // منطق درست/غلط
    const isCorrect = btn.dataset.correct === "true";
    if (isCorrect) {
      playCorrect();   // صدای درست
      score++;
      scoreEl.innerText = score;
   
     
      // نمایش گزینهٔ درست
      const correctBtn = optionBtns.find(b => b.dataset.correct === "true");
      if (correctBtn) correctBtn.classList.add("correct");
    }

    // پس از نیم ثانیه سؤال بعدی
    setTimeout(() => {
      btn.classList.remove("correct","incorrect");
      loadNextQuestion();
    }, 500);
  });
});

// دکمه‌های start/restart/home
restartBtn.addEventListener("click", () => {
  playClick();   // صدای کلیک
  startGame();
});
homeBtn.addEventListener("click", () => {
  playClick();   // صدای کلیک
  window.location.href = "index.html";
});

    // شروعِ خودکار
    startGame();
  });
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    timeUpSound.play();  // افکت پایان زمان
    endGame();
  }

  
  const timeup  = document.getElementById("timeup-sound");
  function countdown() {
    timeLeft--;
    timeLeftEl.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
 
  }
