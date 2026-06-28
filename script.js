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
  scriptMode: "hiragana",
  trainingMode: "levels",
  levelScope: "cumulative",
  selectedRows: new Set(["na"]),
  level: 0,
  queue: [],
  currentIndex: 0,
  streak: 0,
  resetMode: "level",
  isWaitingAfterError: false,
  mistakes: new Map(),
};

const savedTheme = localStorage.getItem("kana-theme");
const scriptButtons = document.querySelectorAll(".script-button");
const trainingButtons = document.querySelectorAll(".training-button");
const scopeButtons = document.querySelectorAll(".scope-button");
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
const trainingModeLabel = document.querySelector("#trainingModeLabel");
const levelScopeLabel = document.querySelector("#levelScopeLabel");
const levelScopePanel = document.querySelector("#levelScopePanel");
const groupPanel = document.querySelector("#groupPanel");
const groupGrid = document.querySelector("#groupGrid");
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

function getScriptLabel(scriptMode = state.scriptMode) {
  const labels = {
    hiragana: "hiragana",
    katakana: "katakana",
    both: "hiragana + katakana",
  };

  return labels[scriptMode];
}

function expandEntries(entries) {
  const scripts = state.scriptMode === "both" ? ["hiragana", "katakana"] : [state.scriptMode];

  return entries.flatMap((entry) =>
    scripts.map((script) => ({
      ...entry,
      script,
      symbol: entry[script],
    }))
  );
}

function getLevelEntries() {
  if (state.trainingMode === "groups") {
    const selectedEntries = kanaRows
      .filter((row) => state.selectedRows.has(row.name))
      .flatMap((row) => row.entries);

    return expandEntries(selectedEntries);
  }

  const rows = state.levelScope === "current"
    ? [kanaRows[state.level]]
    : kanaRows.slice(0, state.level + 1);

  return expandEntries(rows.flatMap((row) => row.entries));
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
  const selectedRowNames = kanaRows
    .filter((row) => state.selectedRows.has(row.name))
    .map((row) => row.name);

  levelLabel.textContent = state.trainingMode === "groups" ? "-" : String(state.level + 1);
  streakLabel.textContent = String(state.streak);
  progressLabel.textContent = `${answered}/${total}`;
  trainingModeLabel.textContent = state.trainingMode === "groups" ? "Grupos" : "Níveis";
  levelScopeLabel.textContent = state.levelScope === "current" ? "Grupo atual" : "Acumulativo";
  levelScopePanel.hidden = state.trainingMode === "groups";
  groupPanel.hidden = state.trainingMode !== "groups";
  lineLabel.textContent = state.trainingMode === "groups"
    ? `Grupos: ${selectedRowNames.join(", ")} | Kana: ${getScriptLabel()}`
    : `Linhas: ${getActiveLevelRows().map((row) => row.name).join(", ")} | Kana: ${getScriptLabel()}`;
  resetModeLabel.textContent = state.resetMode === "total" ? "Resetar tudo" : "Resetar nível";
  currentKana.textContent = current.symbol;
  currentKana.setAttribute("aria-label", `Kana atual ${current.symbol}`);
  currentKana.classList.toggle("error", state.isWaitingAfterError);

  kanaTrack.innerHTML = "";

  state.queue.forEach((entry, index) => {
    const card = document.createElement("div");
    card.className = "kana-card";
    card.textContent = entry.symbol;
    card.setAttribute("aria-label", index === state.currentIndex ? `Kana atual ${entry.symbol}` : entry.symbol);

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

function getActiveLevelRows() {
  if (state.levelScope === "current") {
    return [kanaRows[state.level]];
  }

  return kanaRows.slice(0, state.level + 1);
}

function renderGroupButtons() {
  groupGrid.innerHTML = "";

  kanaRows.forEach((row) => {
    const button = document.createElement("button");
    button.className = "group-button";
    button.type = "button";
    button.dataset.group = row.name;
    button.textContent = row.name.toUpperCase();
    button.classList.toggle("active", state.selectedRows.has(row.name));
    groupGrid.append(button);
  });
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase();
}

function registerMistake(entry, typedAnswer) {
  const key = `${entry.script}:${entry.romaji}`;
  const existing = state.mistakes.get(key);

  state.mistakes.set(key, {
    symbol: entry.symbol,
    romaji: entry.romaji,
    mode: entry.script,
    lastAnswer: typedAnswer,
    count: existing ? existing.count + 1 : 1,
  });
}

function resetAfterMistake(entry) {
  state.streak = 0;

  if (state.resetMode === "total" && state.trainingMode === "levels") {
    state.level = 0;
    startLevel(`Errou. Era "${entry.romaji}". Voltando para o nível 1.`);
    return;
  }

  if (state.trainingMode === "groups") {
    startLevel(`Errou. Era "${entry.romaji}". Reiniciando os grupos escolhidos.`);
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

  if (state.trainingMode === "groups") {
    startLevel("Grupo completo. Reembaralhando os kana escolhidos.");
    return;
  }

  if (state.level < kanaRows.length - 1) {
    state.level += 1;
    startLevel("Nível completo. Indo para o próximo.");
    return;
  }

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

scriptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.scriptMode = button.dataset.scriptMode;
    state.level = 0;
    state.currentIndex = 0;
    state.streak = 0;

    scriptButtons.forEach((item) => item.classList.toggle("active", item === button));
    startLevel(`Modo ${getScriptLabel()} selecionado. Começando novamente.`);
    answerInput.focus();
  });
});

trainingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.trainingMode = button.dataset.trainingMode;
    state.level = 0;
    state.currentIndex = 0;
    state.streak = 0;

    trainingButtons.forEach((item) => item.classList.toggle("active", item === button));
    startLevel(state.trainingMode === "groups"
      ? "Treino por grupos ativado."
      : "Treino por níveis ativado.");
    answerInput.focus();
  });
});

scopeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.levelScope = button.dataset.levelScope;
    state.level = 0;
    state.currentIndex = 0;
    state.streak = 0;

    scopeButtons.forEach((item) => item.classList.toggle("active", item === button));
    startLevel(state.levelScope === "current"
      ? "Modo fácil ativado: só o grupo atual aparece."
      : "Modo acumulativo ativado.");
    answerInput.focus();
  });
});

groupGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".group-button");

  if (!button) {
    return;
  }

  const group = button.dataset.group;

  if (state.selectedRows.has(group) && state.selectedRows.size === 1) {
    setFeedback("Escolha pelo menos um grupo para treinar.", "error");
    answerInput.focus();
    return;
  }

  if (state.selectedRows.has(group)) {
    state.selectedRows.delete(group);
  } else {
    state.selectedRows.add(group);
  }

  renderGroupButtons();
  state.trainingMode = "groups";
  trainingButtons.forEach((item) => item.classList.toggle("active", item.dataset.trainingMode === "groups"));
  startLevel("Grupos atualizados. Treino reembaralhado.");
  answerInput.focus();
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
renderGroupButtons();
startLevel();
