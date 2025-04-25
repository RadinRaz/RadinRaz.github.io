// game.js

const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const timeUpSound = new Audio("sounds/timeup.mp3");
const clockSound = document.getElementById("clock-sound"); // get element from HTML
clockSound.preload = "auto";
clockSound.loop = true;
clockSound.volume = 0.3;

let soundStarted = false;

function startSound() {
    if (soundStarted) return;

    try {
      
        clockSound.load();
        clockSound.currentTime = 0;
        clockSound.play().catch(err => console.warn("Error playing sound:", err));
        soundStarted = true;
    } catch (error) {
        console.error("مشکل در پخش صدا:", error);
    }
}

document.addEventListener('click', startSound);
document.addEventListener('touchstart', startSound);

const startBtn = document.getElementById("start-btn");
if (startBtn) {
    startBtn.addEventListener("click", () => {
        startSound();
        // ... بقیه کدهای مربوط به دکمه استارت
        startGame(); // starts the game

    });
}

function startGame() {
  // ... بقیه کدهای مربوط به شروع بازی
}


document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");

  startBtn.addEventListener("click", () => {
    userInteracted = true; 
    try {
      clockSound.load(); // بارگذاری صدا
      clockSound.currentTime = 0; // تنظیم صدا از ابتدا
      clockSound.play();
    } catch (error) {
      console.error("خطا در پخش صدای ساعت:", error);
      // در صورت خطا، پیامی به کاربر نشان دهید یا اقدام دیگری انجام دهید.
      alert("خطایی در بارگذاری یا پخش صدای ساعت رخ داده است.");
    }

    startGame(); // شروع بازی
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const clickSound = document.getElementById("click-sound");
  const gameContainer = document.getElementById("game-container");
  const endContainer = document.getElementById("end-container");
  const timeLeftEl = document.getElementById("time-left");
  const scoreEl = document.getElementById("score");
  const questionEl = document.getElementById("question");
  const choiceBtns = Array.from(document.querySelectorAll(".option-btn"));
  const finalScoreEl = document.getElementById("final-score");
  const restartBtn = document.getElementById("restart-btn");
  const homeBtn = document.getElementById("home-btn");

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
    "عَاشَ - يَعِیشُ",
    "رَمَى - يَرْمِي",
    "غَسَلَ - يَغْسِلُ",
    "طَارَ - يَطِیرُ",
    "غَلَى - يَغْلِي",
    "نَزَلَ - يَنْزِلُ",
    "زَادَ - يَزِيدُ",
    "أَتَى - يَأْتِي",
    "حَبَسَ - يَحْبِسُ",
    "بَاعَ - يَبِيعُ",
    "يَدْرِی - لَا يَدْرِی",
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
console.log(`تعداد کلمات الگو ۰: ${WORDS[0].length}`);
console.log(`تعداد کلمات الگو ۱: ${WORDS[1].length}`);
console.log(`تعداد کلمات الگو ۲: ${WORDS[2].length}`);


  let timerInterval, timeLeft, score, acceptingAnswer, currentCorrectPattern;

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function playClick() {
    if (!clickSound) return;
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
  }

  function startGame() {
    playClick();

    timeUpSound.play().then(() => {
      timeUpSound.pause();
      timeUpSound.currentTime = 0;
    }).catch(() => {});

    score = 0;
    timeLeft = 30;
    scoreEl.innerText = score;
    timeLeftEl.innerText = timeLeft;

    endContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");

    clearInterval(timerInterval);

    


    timerInterval = setInterval(countdown, 1000);
    loadNextQuestion();
  }

  function countdown() {
    timeLeft--;
    timeLeftEl.innerText = timeLeft;
  
    if (timeLeft <= 0) {
      // توقف پخش صدای ساعت
      clockSound.pause();
      clockSound.currentTime = 0;
  
      clearInterval(timerInterval);
      timeUpSound.currentTime = 0;
      timeUpSound.play().catch(err => console.warn("TimeUp Sound Error:", err));
  
      endGame();
    }
  }

  function loadNextQuestion() {
    acceptingAnswer = false;
    const patIdx = Math.floor(Math.random() * PATTERNS.length);
    currentCorrectPattern = PATTERNS[patIdx];
    const word = WORDS[patIdx][Math.floor(Math.random() * WORDS[patIdx].length)];

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

  function endGame() {
    acceptingAnswer = false;
    playClick();

    finalScoreEl.innerText = score;
    gameContainer.classList.add("hidden");
    endContainer.classList.remove("hidden");

    const playerName = prompt("🏷️ لطفاً نام خود را وارد کنید:") || "بدون نام";
    const playerClass = prompt("🏫 لطفاً کلاس خود را وارد کنید:") || "—";

    let leaderboard = JSON.parse(localStorage.getItem("lb-records") || "[]");
    leaderboard.push({
      name: playerName,
      klass: playerClass,
      score: score,
      date: new Date().toLocaleString()
    });
    localStorage.setItem("lb-records", JSON.stringify(leaderboard));

    window.location.href = "leaderboard.html";
  }

  const optionBtns = choiceBtns;

  optionBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      playClick();
      clickSound.volume = 0.10;

      if (!acceptingAnswer) return;
      acceptingAnswer = false;

      const isCorrect = btn.dataset.correct === "true";
      if (isCorrect) {
        score++;
        scoreEl.innerText = score;
        btn.classList.add("correct");
      } else {
        score = Math.max(0, score - 1);
        scoreEl.innerText = score;
        btn.classList.add("incorrect");

        const correctBtn = optionBtns.find(b => b.dataset.correct === "true");
        if (correctBtn) correctBtn.classList.add("correct");
      }

      setTimeout(() => {
        questionEl.classList.remove("fade-in");
        optionBtns.forEach(b => b.classList.remove("correct", "incorrect"));
        loadNextQuestion();
      }, 500);
    });
  });

  restartBtn.addEventListener("click", startGame);
  homeBtn.addEventListener("click", () => {
    playClick();
    window.location.href = "index.html";
  });

  // شروع خودکار
  startGame();
});
