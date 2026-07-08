const tabDefaults = {
  today: "today-home",
  speak: "speak-roleplay-list",
  listen: "listen-library",
  review: "review-home",
  progress: "progress-dashboard",
};

let recordInterval;
let recordSeconds = 0;

function formatTime(seconds) {
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function setActiveButton(selector, matchAttribute, value) {
  document.querySelectorAll(selector).forEach((button) => {
    button.classList.toggle("is-active", button.getAttribute(matchAttribute) === value);
  });
}

function stopRecording() {
  const panel = document.querySelector(".record-panel");
  const label = document.querySelector("[data-record-label]");
  const button = document.querySelector("[data-record]");

  window.clearInterval(recordInterval);
  recordInterval = undefined;

  if (panel) panel.classList.remove("is-recording");
  if (label) label.textContent = recordSeconds > 0 ? "Attempt captured" : "Ready to record";
  if (button) button.setAttribute("aria-label", "Start recording");
}

function showScreen(id) {
  const next = document.getElementById(id);
  if (!next || !next.classList.contains("mobile-screen")) return;

  stopRecording();

  document.querySelectorAll(".mobile-screen").forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === id);
  });

  next.scrollTop = 0;
  setActiveButton(".learner-nav [data-target]", "data-target", id);

  const tab = next.dataset.tab;
  const tabBar = document.querySelector(".tab-bar");

  if (tabBar) {
    tabBar.classList.toggle("is-hidden", tab === "none");
  }

  document.querySelectorAll("[data-tab-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.tabTarget === tab);
  });
}

function showCoachScreen(id) {
  const next = document.getElementById(id);
  if (!next || !next.classList.contains("coach-screen")) return;

  document.querySelectorAll(".coach-screen").forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === id);
  });

  setActiveButton("[data-coach-target]", "data-coach-target", id);
}

function setMode(mode) {
  const prototype = document.querySelector(".prototype");
  if (!prototype) return;

  prototype.dataset.mode = mode;
  setActiveButton("[data-mode-target]", "data-mode-target", mode);

  if (mode === "coach") {
    showCoachScreen(document.querySelector(".coach-screen.is-active")?.id || "coach-overview");
  } else {
    showScreen(document.querySelector(".mobile-screen.is-active")?.id || "welcome");
  }
}

function toggleTranscript(button) {
  const target = document.getElementById(button.dataset.toggle);
  if (!target) return;

  const isOpening = target.hidden;
  target.hidden = !isOpening;
  button.setAttribute("aria-expanded", String(isOpening));
  button.querySelector("svg")?.classList.toggle("rotate", isOpening);
}

function toggleRecording() {
  const panel = document.querySelector(".record-panel");
  const label = document.querySelector("[data-record-label]");
  const time = document.querySelector("[data-record-time]");
  const button = document.querySelector("[data-record]");

  if (!panel || !label || !time || !button) return;

  if (recordInterval) {
    stopRecording();
    return;
  }

  recordSeconds = 0;
  time.textContent = formatTime(recordSeconds);
  label.textContent = "Recording";
  button.setAttribute("aria-label", "Stop recording");
  panel.classList.add("is-recording");

  recordInterval = window.setInterval(() => {
    recordSeconds += 1;
    time.textContent = formatTime(recordSeconds);
  }, 1000);
}

function revealAnswer(button) {
  const answer = document.querySelector(".answer-card");
  if (!answer) return;

  answer.hidden = false;
  button.querySelector("span").textContent = "Answer shown";
  button.disabled = true;
}

function saveReview(button) {
  button.classList.add("is-saved");
  button.querySelector("span").textContent = "Saved to review";
  button.querySelector("svg")?.setAttribute("data-lucide", "bookmark-check");
  refreshIcons();
}

function appendChatReply(reply) {
  const thread = document.querySelector(".chat-thread");
  if (!thread) return;

  const learner = document.createElement("article");
  learner.className = "bubble learner";
  learner.innerHTML = `<span>Anika</span><p>${reply}</p>`;
  thread.appendChild(learner);

  const coach = document.createElement("article");
  coach.className = "bubble coach";
  coach.innerHTML = "<span>Mme Dubois</span><p>D'accord, je vais regarder les disponibilités pour faire passer quelqu'un.</p>";
  thread.appendChild(coach);

  thread.lastElementChild?.scrollIntoView({ behavior: "smooth", block: "end" });
}

document.addEventListener("click", (event) => {
  const targetButton = event.target.closest("[data-target]");
  if (targetButton) {
    showScreen(targetButton.dataset.target);
    return;
  }

  const tabButton = event.target.closest("[data-tab-target]");
  if (tabButton) {
    showScreen(tabDefaults[tabButton.dataset.tabTarget]);
    return;
  }

  const modeButton = event.target.closest("[data-mode-target]");
  if (modeButton) {
    setMode(modeButton.dataset.modeTarget);
    return;
  }

  const coachButton = event.target.closest("[data-coach-target]");
  if (coachButton) {
    showCoachScreen(coachButton.dataset.coachTarget);
    return;
  }

  const transcriptButton = event.target.closest("[data-toggle]");
  if (transcriptButton) {
    toggleTranscript(transcriptButton);
    return;
  }

  if (event.target.closest("[data-record]")) {
    toggleRecording();
    return;
  }

  const revealButton = event.target.closest("[data-reveal]");
  if (revealButton) {
    revealAnswer(revealButton);
    return;
  }

  const saveButton = event.target.closest("[data-save-review]");
  if (saveButton) {
    saveReview(saveButton);
    return;
  }

  const chatButton = event.target.closest("[data-chat-reply]");
  if (chatButton) {
    appendChatReply(chatButton.dataset.chatReply);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const initialMode = params.get("mode") === "coach" ? "coach" : "learner";
  const initialScreen = params.get("screen");

  setMode(initialMode);

  if (initialMode === "coach") {
    showCoachScreen(initialScreen || "coach-overview");
  } else {
    showScreen(initialScreen || document.querySelector(".mobile-screen.is-active")?.id || "welcome");
  }

  refreshIcons();
});
