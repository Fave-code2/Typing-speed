import "./style.css";
import axios from "axios";
import arrowIcon from "./assets/images/icon-down-arrow.svg";

const easy = document.getElementById("easy") as HTMLButtonElement;
const medium = document.getElementById("medium") as HTMLButtonElement;
const hard = document.getElementById("hard") as HTMLButtonElement;
const desktopTimer = document.getElementById(
  "desktop-timer",
) as HTMLButtonElement;
const passage = document.getElementById("passage") as HTMLButtonElement;
const restart = document.getElementById("restart") as HTMLButtonElement;
const startBtn = document.getElementById("start-btn") as HTMLButtonElement;
const word = document.getElementById("word") as HTMLParagraphElement;
const overlay = document.querySelector(".overlay") as HTMLDivElement;
const mobileDifficultyEasy = document.getElementById(
  "mobile-difficulty-easy",
) as HTMLLIElement;
const mobileDifficultyMedium = document.getElementById(
  "mobile-difficulty-medium",
) as HTMLLIElement;
const mobileDifficultyHard = document.getElementById(
  "mobile-difficulty-hard",
) as HTMLLIElement;
const typingInput = document.getElementById("typing-input") as HTMLInputElement;
const wordPerMinute = document.getElementById(
  "word-per-minute",
) as HTMLSpanElement;
const accuracy = document.getElementById("accuracy") as HTMLSpanElement;
const timeCountdown = document.getElementById(
  "time-countdown",
) as HTMLSpanElement;
const firstResult = document.getElementById("first-result") as HTMLElement;
const regularResult = document.getElementById("regular-result") as HTMLElement;
const highScore = document.getElementById("high-score") as HTMLElement;
const resultSection = document.getElementById("results") as HTMLElement;
const mobileLevel = document.getElementById(
  "mobile-level",
) as HTMLButtonElement;

const mobileTimeController = document.querySelector(
  ".mobile-timer-control",
) as HTMLLIElement;
const mobilePassageController = document.querySelector(
  ".mobile-passage-control",
) as HTMLLIElement;
const home = document.querySelectorAll(".home");

const difficultyButtons = [easy, medium, hard];
const timerButtons = [desktopTimer, passage];

const state = {
  started: false,
  finished: false,
  timer: 60,
  totalTime: 60,
  currentIndex: 0,
  correctChars: 0,
  incorrectChars: 0,
  typedCharacters: 0,
  personalBest: 0,
  wpm: 0,
  accuracy: 0,
  difficulty: "easy" as keyof ApiResponse,
  mode: "timed" as "timed" | "passage",
  passageTimer: 0,
};

let timerId: number | null = null;

interface Word {
  id: number;
  text: string;
}

interface ApiResponse {
  easy: Word[];
  medium: Word[];
  hard: Word[];
}

const fetchData = async (
  url: string,
  difficulty: keyof ApiResponse,
): Promise<void> => {
  try {
    resetGame();
    const response = await axios.get<ApiResponse>(url);
    const passages = response.data[difficulty];

    if (!passages || passages.length === 0) {
      throw new Error(`No passages found for difficulty: ${difficulty}`);
    }

    const random = passages[Math.floor(Math.random() * passages.length)];

    word.innerHTML = "";
    overlay.classList.remove("hidden");

    random.text.split("").forEach((char) => {
      const span = document.createElement("span");
      span.textContent = char;
      word.appendChild(span);
    });

    updateStats();
  } catch (error) {
    console.error("Failed to fetch passages:", error);
  }
};

const saved = localStorage.getItem("personalBest");
if (saved) {
  state.personalBest = parseFloat(saved);
  document.querySelectorAll(".personal-best").forEach((pb) => {
    pb.textContent = state.personalBest.toFixed() + " WPM";
  });
}

function resetGame(): void {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }

  state.started = false;
  state.finished = false;
  state.currentIndex = 0;
  state.correctChars = 0;
  state.incorrectChars = 0;
  state.typedCharacters = 0;
  state.timer = state.totalTime;
}

fetchData("/data.json", "easy");

// function EventListeners(): void {
//   // Desktop difficulty navigation
//   easy.addEventListener("click", () => {
//     state.difficulty = "easy";
//     difficultyButtons.forEach((el) => el.classList.remove("active"));
//     easy.classList.add("active");
//     fetchData("/data.json", "easy");
//   });
//   medium.addEventListener("click", () => {
//     state.difficulty = "medium";
//     difficultyButtons.forEach((el) => el.classList.remove("active"));
//     medium.classList.add("active");
//     fetchData("/data.json", "medium");
//   });
//   hard.addEventListener("click", () => {
//     state.difficulty = "hard";
//     difficultyButtons.forEach((el) => el.classList.remove("active"));
//     hard.classList.add("active");
//     fetchData("/data.json", "hard");
//   });

//   // Mobile difficulty navigation
// const difficultyOptions = [
//   { element: mobileDifficultyEasy, level: "easy", label: "Easy" },
//   { element: mobileDifficultyMedium, level: "medium", label: "Medium" },
//   { element: mobileDifficultyHard, level: "hard", label: "Hard" },
// ] as const;

// difficultyOptions.forEach(({ element, level, label }) => {
//   const radio = element?.querySelector("input") as HTMLInputElement;

//   element?.addEventListener("click", () => {
//     state.difficulty = level;
//     radio.checked = true;
//     fetchData("/data.json", level);
//     mobileLevel.innerHTML = `${label}
//     <img src="./src/assets/images/icon-down-arrow.svg" alt="" />`;
//     document.querySelectorAll(".dropdown-menu").forEach((menu) => {
//       menu.classList.remove("show");
//     });
//   });
// });

//   startBtn.addEventListener("click", startTest);
//   typingInput.addEventListener("keydown", handleTyping);

//   desktopTimer.addEventListener("click", () => {
//     if (state.started) return;
//     state.mode = "timed";
//     timerButtons.forEach((el) => el.classList.remove("active"));
//     desktopTimer.classList.add("active");
//   });

//   passage.addEventListener("click", () => {
//     if (state.started) return; // don't allow switching mid-test
//     timerButtons.forEach((el) => el.classList.remove("active"));
//     passage.classList.add("active");
//     state.mode = "passage";
//   });

//   document.querySelectorAll(".beat-best-score").forEach((button) => {
//     button.addEventListener("click", beatBestScoreAndGoAgain);
//   });

//   // Mobile drop button
//   document.querySelectorAll(".dropdown").forEach((dropdown) => {
//     const button = dropdown.querySelector(".dropdown-btn");
//     const menu = dropdown.querySelector(".dropdown-menu");

//     button?.addEventListener("click", () => {
//       menu?.classList.toggle("show");
//     });
//   });
// }

function EventListeners(): void {
  // Desktop difficulty navigation
  const difficulties = [
    { element: easy, level: "easy" },
    { element: medium, level: "medium" },
    { element: hard, level: "hard" },
  ] as const;

  difficulties.forEach(({ element, level }) => {
    element.addEventListener("click", () => {
      state.difficulty = level;
      difficultyButtons.forEach((el) => el.classList.remove("active"));
      element.classList.add("active");
      fetchData("/data.json", level);
    });
  });

  // Mobile difficulty navigation
  const easyRadio = mobileDifficultyEasy?.querySelector(
    "input",
  ) as HTMLInputElement;
  easyRadio.checked = true;
  mobileDifficultyEasy.addEventListener("click", () => {
    state.difficulty = "easy";
    easyRadio.checked = true;
    fetchData("/data.json", "easy");
    mobileLevel.innerHTML = `Easy
                <img src="${arrowIcon}" alt="" />`;
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.remove("show");
    });
  });

  const mediumRadio = mobileDifficultyMedium?.querySelector(
    "input",
  ) as HTMLInputElement;
  mobileDifficultyMedium.addEventListener("click", () => {
    state.difficulty = "medium";
    mediumRadio.checked = true;
    fetchData("/data.json", "medium");
    mobileLevel.innerHTML = `Medium
                <img src="${arrowIcon}" alt="" />`;
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.remove("show");
    });
  });

  const hardRadio = mobileDifficultyHard?.querySelector(
    "input",
  ) as HTMLInputElement;
  mobileDifficultyHard.addEventListener("click", () => {
    hardRadio.checked = true;
    state.difficulty = "hard";
    fetchData("/data.json", "hard");
    mobileLevel.innerHTML = `Hard
                <img src="${arrowIcon}" alt="" />`;
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.remove("show");
    });
  });

  startBtn.addEventListener("click", startTest);
  typingInput.addEventListener("keydown", handleTyping);

  desktopTimer.addEventListener("click", () => {
    if (state.started) return;
    state.mode = "timed";
    timerButtons.forEach((el) => el.classList.remove("active"));
    desktopTimer.classList.add("active");
  });

  passage.addEventListener("click", () => {
    if (state.started) return; // don't allow switching mid-test
    timerButtons.forEach((el) => el.classList.remove("active"));
    passage.classList.add("active");
    state.mode = "passage";
  });

  document.querySelectorAll(".beat-best-score").forEach((button) => {
    button.addEventListener("click", beatBestScoreAndGoAgain);
  });

  // Mobile drop button
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const button = dropdown.querySelector(".dropdown-btn");
    const menu = dropdown.querySelector(".dropdown-menu");

    button?.addEventListener("click", () => {
      menu?.classList.toggle("show");
    });
  });

  // mobile mode

  const button = document.querySelector(
    ".timer .dropdown-btn",
  ) as HTMLButtonElement;

  const timerRadio = mobileTimeController.querySelector(
    "input",
  ) as HTMLInputElement;
  timerRadio.checked = true;

  mobileTimeController.addEventListener("click", () => {
    if (state.started) return;
    state.mode = "timed";
    timerRadio.checked = true;
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.remove("show");
    });
    button.innerHTML = `Timed (60s)
               <img src="./src/assets/images/icon-down-arrow.svg" alt="" />`;
  });

  const passageRadio = mobilePassageController.querySelector(
    "input",
  ) as HTMLInputElement;
  mobilePassageController.addEventListener("click", () => {
    if (state.started) return;
    state.mode = "passage";
    passageRadio.checked = true;
    document.querySelectorAll(".dropdown-menu").forEach((menu) => {
      menu.classList.remove("show");
    });
    button.innerHTML = `Passage
               <img src="./src/assets/images/icon-down-arrow.svg" alt="" />`;
  });

  // home button
  home.forEach((btn) => {
    resetGame();
    btn.addEventListener("click", () => {
      regularResult.classList.add("hidden");
      resultSection.classList.add("hidden");
      firstResult.classList.add("hidden");
      highScore.classList.add("hidden");

      overlay.classList.remove("hidden");
      fetchData("/data.json", state.difficulty);
    });
  });
}

easy.classList.add("active");
desktopTimer.classList.add("active");
EventListeners();

function startTest(): void {
  if (state.started) return;

  overlay.classList.add("hidden");

  word.querySelector("span")?.classList.add("current");

  state.started = true;
  state.passageTimer = Date.now();

  if (state.mode === "timed") {
    startTimer();
  }

  typingInput.focus();
}

function handleTyping(event: KeyboardEvent): void {
  if (!state.started || state.finished) return;

  const spans = word.querySelectorAll("span");
  const currentSpan = spans[state.currentIndex];

  if (!currentSpan) {
    // state.finished = true;
    return;
  }

  const expectedLetter = currentSpan.textContent ?? "";
  const typedLetter = event.key;

  if (event.key.length > 1 && event.key !== " ") return;

  state.typedCharacters++;

  if (typedLetter === expectedLetter) {
    state.correctChars++;
    currentSpan.classList.remove("current");
    currentSpan.classList.add("correct");
  } else {
    state.incorrectChars++;
    currentSpan.classList.remove("current");
    currentSpan.classList.add("incorrect");
  }

  updateStats();

  state.currentIndex++;

  const nextSpan = spans[state.currentIndex];

  if (nextSpan) {
    nextSpan.classList.add("current");

    nextSpan.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  } else {
    state.finished = true;
    finishTest();
  }
}

function startTimer(): void {
  timerId = window.setInterval(() => {
    if (state.finished) {
      clearInterval(timerId!);
      timerId = null;
      return;
    }

    state.timer--;
    if (state.timer <= 15) {
      timeCountdown.classList.add("wrong");
      timeCountdown.classList.remove("warning");
    } else if (state.timer <= 45) {
      timeCountdown.classList.add("warning");
      timeCountdown.classList.remove("wrong");
    } else {
      timeCountdown.classList.remove("wrong", "warning");
    }

    updateStats();

    if (state.timer <= 0) {
      clearInterval(timerId!);
      timerId = null;
      updateStats();
      finishTest();
    }
  }, 1000);
}

const updateStats = (): void => {
  timeCountdown.textContent = "0:" + state.timer.toString();

  let elapsedTime;

  if (state.mode === "timed") {
    elapsedTime = state.totalTime - state.timer;
  } else {
    elapsedTime = (Date.now() - state.passageTimer) / 1000;
  }

  const wordTyped = state.correctChars / 5;
  const minute = elapsedTime / 60;
  const wpm = minute > 0 ? wordTyped / minute : 0;
  wordPerMinute.textContent = wpm.toFixed();

  const typingAccuracy =
    state.typedCharacters > 0
      ? (state.correctChars / state.typedCharacters) * 100
      : 0;

  accuracy.classList.remove("good", "warning", "wrong");

  if (state.typedCharacters === 0) {
    accuracy.classList.add("wrong");
  } else if (typingAccuracy >= 95) {
    accuracy.classList.add("good");
  } else if (typingAccuracy >= 70) {
    accuracy.classList.add("warning");
  } else {
    accuracy.classList.add("wrong");
  }

  accuracy.textContent = typingAccuracy.toFixed() + "%";

  state.wpm = wpm;
  state.accuracy = typingAccuracy;
};

function finishTest(): void {
  state.started = false;
  state.finished = true;

  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }

  // Save the previous PB before updating it
  const previousBest = state.personalBest;
  const finalWpm = state.wpm;

  const isFirstRun = previousBest === 0;
  const isNewPersonalBest = !isFirstRun && finalWpm > previousBest;

  // Update personal best if this run beats it
  if (finalWpm > previousBest) {
    state.personalBest = finalWpm;

    localStorage.setItem("personalBest", state.personalBest.toString());

    document.querySelectorAll(".personal-best").forEach((pb) => {
      pb.textContent = state.personalBest.toFixed() + " WPM";
    });
  }

  const accuracyClass =
    state.accuracy === 0
      ? "wrong"
      : state.accuracy >= 95
        ? "good"
        : state.accuracy >= 70
          ? "warning"
          : "wrong";

  document.querySelectorAll(".first-wpm").forEach((el) => {
    el.textContent = state.wpm.toFixed();
  });

  document.querySelectorAll(".first-accuracy").forEach((el) => {
    el.classList.remove("good", "warning", "wrong");
    el.classList.add(accuracyClass);
    el.textContent = state.accuracy.toFixed() + "%";
  });

  document.querySelectorAll(".first-correct").forEach((el) => {
    el.textContent = state.correctChars.toString();
    el.classList.add("good");
  });

  document.querySelectorAll(".first-incorrect").forEach((el) => {
    el.textContent = state.incorrectChars.toString();
    el.classList.add("wrong");
  });

  resultSection.classList.remove("hidden");
  document.body.style.overflow = "hidden";

  // Determine which result card to display
  if (isFirstRun) {
    // First completed test
    firstResult.classList.remove("hidden");
    regularResult.classList.add("hidden");
    highScore.classList.add("hidden");
  } else if (isNewPersonalBest) {
    // Existing PB beaten
    firstResult.classList.add("hidden");
    regularResult.classList.add("hidden");
    highScore.classList.remove("hidden");
  } else {
    // Normal run
    firstResult.classList.add("hidden");
    regularResult.classList.remove("hidden");
    highScore.classList.add("hidden");
  }
}

function restartTest(): void {
  restart.addEventListener("click", () => {
    resetGame();

    word.querySelectorAll("span").forEach((el) => {
      el.className = "";
    });

    updateStats();

    startTest();
  });
}

restartTest();

async function beatBestScoreAndGoAgain() {
  resultSection.classList.add("hidden");
  firstResult.classList.add("hidden");
  regularResult.classList.add("hidden");
  highScore.classList.add("hidden");

  resetGame();

  typingInput.focus();

  await fetchData("/data.json", state.difficulty);

  word.querySelector("span")?.classList.add("current");

  startTest();
}
