import "./style.css";
import axios from "axios";

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

// First result
const firstWpm = document.getElementById("first-wpm") as HTMLSpanElement;
const firstAccuracy = document.getElementById(
  "first-accuracy",
) as HTMLSpanElement;
const firstCorrect = document.getElementById(
  "first-correct",
) as HTMLSpanElement;
const firstincorrect = document.getElementById(
  "first-accuracy",
) as HTMLSpanElement;

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
  } catch (error) {
    console.error("Failed to fetch passages:", error);
  }
};

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

fetchData("/src/data.json", "easy");

function EventListeners(): void {
  // Desktop difficulty navigation
  easy.addEventListener("click", () => {
    fetchData("/src/data.json", "easy");
  });
  medium.addEventListener("click", () => {
    fetchData("/src/data.json", "medium");
  });
  hard.addEventListener("click", () => {
    fetchData("/src/data.json", "hard");
  });

  // Mobile difficulty navigation
  mobileDifficultyEasy.addEventListener("click", () => {
    fetchData("/src/data.json", "easy");
  });
  mobileDifficultyMedium.addEventListener("click", () => {
    fetchData("/src/data.json", "medium");
  });
  mobileDifficultyHard.addEventListener("click", () => {
    fetchData("/src/data.json", "hard");
  });

  startBtn.addEventListener("click", startTest);
  typingInput.addEventListener("keydown", handleTyping);
}

EventListeners();

function startTest(): void {
  if (state.started) return;

  overlay.classList.add("hidden");

  word.querySelector("span")?.classList.add("current");

  state.started = true;

  typingInput.focus();
  startTimer();
}

function handleTyping(event: KeyboardEvent): void {
  if (!state.started || state.finished) return;

  const spans = word.querySelectorAll("span");
  const currentSpan = spans[state.currentIndex];

  if (!currentSpan) {
    state.finished = true;
    return;
  }

  const expectedLetter = currentSpan.textContent ?? "";
  const typedLetter = event.key;

  if (
    typedLetter === "Shift" ||
    typedLetter === "Control" ||
    typedLetter === "Alt" ||
    typedLetter === "Meta" ||
    typedLetter === "CapsLock" ||
    typedLetter === "Tab"
  ) {
    return;
  }

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

  state.currentIndex++;

  const nextSpan = spans[state.currentIndex];

  if (nextSpan) {
    nextSpan.classList.add("current");
  } else {
    state.finished = true;
    console.log("Test Finished");
    console.log("Correct:", state.correctChars);
    console.log("Incorrect:", state.incorrectChars);
    console.log("Typed:", state.typedCharacters);

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

    updateStats();

    if (state.timer <= 0) {
      clearInterval(timerId!);
      timerId = null;
    }
  }, 1000);
}

const updateStats = (): void => {
  timeCountdown.textContent = state.timer.toString();

  const elapsedTime = state.totalTime - state.timer;
  const wordTyped = state.correctChars / 5;
  const minute = elapsedTime / 60;
  const wpm = minute > 0 ? wordTyped / minute : 0;
  wordPerMinute.textContent = wpm.toFixed();

  const typingAccuracy =
    state.typedCharacters > 0
      ? (state.correctChars / state.typedCharacters) * 100
      : 100;

  accuracy.textContent = typingAccuracy.toFixed();

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

  if (state.personalBest === 0) {
    resultSection.classList.remove("hidden");
    firstResult.classList.remove("hidden");
  }
}

// finishTest();
// resetTest();
