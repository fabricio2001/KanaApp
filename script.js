const kanaRows = [
  {
    name: "vogais",
    entries: [
      { romaji: "a", hiragana: "あ", katakana: "ア" },
      { romaji: "i", hiragana: "い", katakana: "イ" },
      { romaji: "u", hiragana: "う", katakana: "ウ" },
      { romaji: "e", hiragana: "え", katakana: "エ" },
      { romaji: "o", hiragana: "お", katakana: "オ" },
    ],
  },
  {
    name: "ka",
    entries: [
      { romaji: "ka", hiragana: "か", katakana: "カ" },
      { romaji: "ki", hiragana: "き", katakana: "キ" },
      { romaji: "ku", hiragana: "く", katakana: "ク" },
      { romaji: "ke", hiragana: "け", katakana: "ケ" },
      { romaji: "ko", hiragana: "こ", katakana: "コ" },
    ],
  },
  {
    name: "sa",
    entries: [
      { romaji: "sa", hiragana: "さ", katakana: "サ" },
      { romaji: "shi", hiragana: "し", katakana: "シ" },
      { romaji: "su", hiragana: "す", katakana: "ス" },
      { romaji: "se", hiragana: "せ", katakana: "セ" },
      { romaji: "so", hiragana: "そ", katakana: "ソ" },
    ],
  },
  {
    name: "ta",
    entries: [
      { romaji: "ta", hiragana: "た", katakana: "タ" },
      { romaji: "chi", hiragana: "ち", katakana: "チ" },
      { romaji: "tsu", hiragana: "つ", katakana: "ツ" },
      { romaji: "te", hiragana: "て", katakana: "テ" },
      { romaji: "to", hiragana: "と", katakana: "ト" },
    ],
  },
  {
    name: "na",
    entries: [
      { romaji: "na", hiragana: "な", katakana: "ナ" },
      { romaji: "ni", hiragana: "に", katakana: "ニ" },
      { romaji: "nu", hiragana: "ぬ", katakana: "ヌ" },
      { romaji: "ne", hiragana: "ね", katakana: "ネ" },
      { romaji: "no", hiragana: "の", katakana: "ノ" },
    ],
  },
  {
    name: "ha",
    entries: [
      { romaji: "ha", hiragana: "は", katakana: "ハ" },
      { romaji: "hi", hiragana: "ひ", katakana: "ヒ" },
      { romaji: "fu", hiragana: "ふ", katakana: "フ" },
      { romaji: "he", hiragana: "へ", katakana: "ヘ" },
      { romaji: "ho", hiragana: "ほ", katakana: "ホ" },
    ],
  },
  {
    name: "ma",
    entries: [
      { romaji: "ma", hiragana: "ま", katakana: "マ" },
      { romaji: "mi", hiragana: "み", katakana: "ミ" },
      { romaji: "mu", hiragana: "む", katakana: "ム" },
      { romaji: "me", hiragana: "め", katakana: "メ" },
      { romaji: "mo", hiragana: "も", katakana: "モ" },
    ],
  },
  {
    name: "ya",
    entries: [
      { romaji: "ya", hiragana: "や", katakana: "ヤ" },
      { romaji: "yu", hiragana: "ゆ", katakana: "ユ" },
      { romaji: "yo", hiragana: "よ", katakana: "ヨ" },
    ],
  },
  {
    name: "ra",
    entries: [
      { romaji: "ra", hiragana: "ら", katakana: "ラ" },
      { romaji: "ri", hiragana: "り", katakana: "リ" },
      { romaji: "ru", hiragana: "る", katakana: "ル" },
      { romaji: "re", hiragana: "れ", katakana: "レ" },
      { romaji: "ro", hiragana: "ろ", katakana: "ロ" },
    ],
  },
  {
    name: "wa + n",
    entries: [
      { romaji: "wa", hiragana: "わ", katakana: "ワ" },
      { romaji: "wo", hiragana: "を", katakana: "ヲ" },
      { romaji: "n", hiragana: "ん", katakana: "ン" },
    ],
  },
];

const state = {
  mode: "hiragana",
  level: 0,
  queue: [],
  currentIndex: 0,
  streak: 0,
  resetMode: "level",
  isWaitingAfterError: false,
  mistakes: new Map(),
};

const savedTheme = localStorage.getItem("kana-theme");
const modeButtons = document.querySelectorAll(".mode-button");
const resetButtons = document.querySelectorAll(".reset-button");
const themeSwitch = document.querySelector("#themeSwitch");
const currentKana = document.querySelector("#currentKana");
const kanaTrack = document.querySelector("#kanaTrack");
const answerForm = document.querySelector("#answerForm");
const answerInput = document.querySelector("#answerInput");
const answerButton = answerForm.querySelector("button");
const levelLabel = document.querySelector("#levelLabel");
const streakLabel = document.querySelector("#streakLabel");
const progressLabel = document.querySelector("#progressLabel");
const lineLabel = document.querySelector("#lineLabel");
const resetModeLabel = document.querySelector("#resetModeLabel");
const feedback = document.querySelector("#feedback");
const mistakeList = document.querySelector("#mistakeList");
const emptyHistory = document.querySelector("#emptyHistory");
const clearHistory = document.querySelector("#clearHistory");

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeSwitch.setAttribute("aria-pressed", String(theme === "dark"));
  localStorage.setItem("kana-theme", theme);
}

function shuffle(items) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function getLevelEntries() {
  return kanaRows.slice(0, state.level + 1).flatMap((row) => row.entries);
}

function startLevel(message = "") {
  state.queue = shuffle(getLevelEntries());
  state.currentIndex = 0;
  state.isWaitingAfterError = false;
  answerInput.value = "";
  answerInput.disabled = false;
  answerButton.disabled = false;
  setFeedback(message || "Digite a leitura do kana destacado.", "");
  render();
}

function setFeedback(message, type) {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`.trim();
}

function render() {
  const current = state.queue[state.currentIndex];
  const total = state.queue.length;
  const answered = state.currentIndex;

  levelLabel.textContent = String(state.level + 1);
  streakLabel.textContent = String(state.streak);
  progressLabel.textContent = `${answered}/${total}`;
  lineLabel.textContent = `Linhas: ${kanaRows.slice(0, state.level + 1).map((row) => row.name).join(", ")}`;
  resetModeLabel.textContent = state.resetMode === "total" ? "Resetar tudo" : "Resetar nível";
  currentKana.textContent = current[state.mode];
  currentKana.setAttribute("aria-label", `Kana atual ${current[state.mode]}`);
  currentKana.classList.toggle("error", state.isWaitingAfterError);

  kanaTrack.innerHTML = "";

  state.queue.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className = "kana-card";
    card.textContent = entry[state.mode];
    card.setAttribute("aria-label", index === state.currentIndex ? `Kana atual ${entry[state.mode]}` : entry[state.mode]);

    if (index < state.currentIndex) {
      card.classList.add("done");
    }

    if (entry === current) {
      card.classList.add("active");
    }

    if (entry === current && state.isWaitingAfterError) {
      card.classList.add("error");
    }

    kanaTrack.append(card);
  });

  const activeCard = kanaTrack.querySelector(".kana-card.active");
  activeCard?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

  renderMistakes();
}

function renderMistakes() {
  const mistakes = [...state.mistakes.values()].sort((a, b) => b.count - a.count);
  mistakeList.innerHTML = "";
  emptyHistory.hidden = mistakes.length > 0;

  mistakes.forEach((mistake) => {
    const item = document.createElement("li");
    item.className = "mistake-item";

    item.innerHTML = `
      <div class="mistake-kana">
        <span class="mistake-symbol">${mistake.symbol}</span>
        <span class="mistake-copy">
          <strong>${mistake.romaji}</strong>
          <span>${mistake.mode}</span>
        </span>
      </div>
      <span class="mistake-count">${mistake.count}x</span>
    `;

    mistakeList.append(item);
  });
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase();
}

function registerMistake(entry, typedAnswer) {
  const key = `${state.mode}:${entry.romaji}`;
  const existing = state.mistakes.get(key);

  state.mistakes.set(key, {
    symbol: entry[state.mode],
    romaji: entry.romaji,
    mode: state.mode,
    lastAnswer: typedAnswer,
    count: existing ? existing.count + 1 : 1,
  });
}

function resetAfterMistake(entry) {
  state.streak = 0;

  if (state.resetMode === "total") {
    state.level = 0;
    startLevel(`Errou. Era "${entry.romaji}". Voltando para o nível 1.`);
    return;
  }

  startLevel(`Errou. Era "${entry.romaji}". Reiniciando este nível.`);
}

function showMistakeBeforeReset(entry) {
  state.isWaitingAfterError = true;
  state.streak = 0;
  answerInput.disabled = true;
  answerButton.disabled = true;
  answerInput.value = "";
  setFeedback(`Errou. Era "${entry.romaji}".`, "error");
  render();

  window.setTimeout(() => {
    resetAfterMistake(entry);
    answerInput.focus();
  }, 1000);
}

function handleCorrectAnswer() {
  state.currentIndex += 1;

  if (state.currentIndex < state.queue.length) {
    setFeedback("Boa. Próximo kana.", "success");
    render();
    return;
  }

  state.streak += 1;

  if (state.level < kanaRows.length - 1) {
    state.level += 1;
    startLevel("Nível completo. Indo para o próximo.");
    return;
  }

  setFeedback("Você completou todos os kana básicos. Streak aumentada e o treino recomeçou.", "success");
  state.level = 0;
  startLevel("Todos os níveis completos. Recomeçando do nível 1.");
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (state.isWaitingAfterError) {
    return;
  }

  const current = state.queue[state.currentIndex];
  const typedAnswer = normalizeAnswer(answerInput.value);

  if (!typedAnswer) {
    setFeedback("Digite uma resposta antes de continuar.", "error");
    return;
  }

  if (typedAnswer === current.romaji) {
    answerInput.value = "";
    handleCorrectAnswer();
    return;
  }

  registerMistake(current, typedAnswer);
  showMistakeBeforeReset(current);
});

modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    state.level = 0;
    state.currentIndex = 0;
    state.streak = 0;

    modeButtons.forEach((item) => item.classList.toggle("active", item === button));
    startLevel(`Modo ${state.mode} selecionado. Começando pelo nível 1.`);
    answerInput.focus();
  });
});

resetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.resetMode = button.dataset.resetMode;
    resetButtons.forEach((item) => item.classList.toggle("active", item === button));
    setFeedback(
      state.resetMode === "total"
        ? "Ao errar, o jogo volta para o nível 1."
        : "Ao errar, apenas o nível atual reinicia.",
      ""
    );
    render();
    answerInput.focus();
  });
});

themeSwitch.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  applyTheme(currentTheme === "dark" ? "light" : "dark");
  answerInput.focus();
});

clearHistory.addEventListener("click", () => {
  state.mistakes.clear();
  renderMistakes();
  answerInput.focus();
});

applyTheme(savedTheme === "dark" ? "dark" : "light");
startLevel();
