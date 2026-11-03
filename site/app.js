"use strict";

const EXAM_SIZE = 30;
const MAX_WRONG_TO_PASS = 5; // como en el examen real: hasta 5 errores aprueba.
const KEYS = ["1", "2", "3", "4", "5", "6"];

const $ = (id) => document.getElementById(id);

const state = {
  all: [],        // todas las preguntas cargadas
  quiz: [],       // preguntas de esta ronda, con opciones mezcladas
  i: 0,           // índice de la pregunta actual
  mode: "exam",   // "exam" o "practice"
  answered: false // en práctica: si ya respondió la pregunta actual
};

/* ---------- Utilidades ---------- */

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else node.setAttribute(k, v);
  }
  for (const c of children) node.append(c);
  return node;
}

function show(screenId) {
  for (const s of document.querySelectorAll(".screen")) s.hidden = s.id !== screenId;
  $("quit").hidden = screenId !== "quiz";
  window.scrollTo(0, 0);
}

// Prepara una pregunta para la ronda: mezcla las opciones y recuerda cuál es la correcta.
// Si la pregunta trae "optionImages" (mismo orden que "options"), cada opción se arma
// con su imagen además de su texto, y se mezclan juntas.
function prepare(q) {
  const opts = shuffle(q.options.map((text, idx) => ({
    text,
    image: q.optionImages ? q.optionImages[idx] : null,
    ok: idx === q.correct
  })));
  return { ...q, opts, picked: null };
}

/* ---------- Carga ---------- */

async function load() {
  try {
    const res = await fetch("questions.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    // Las preguntas marcadas como "verify" todavía no están confirmadas: no se muestran.
    state.all = data.filter((q) => !q.verify);
    setupHome();
    show("home");
  } catch (err) {
    console.error("No se pudo cargar questions.json:", err);
    show("load-error");
  }
}

/* ---------- Inicio ---------- */

function setupHome() {
  $("exam-size").textContent = Math.min(EXAM_SIZE, state.all.length);

  const counts = new Map();
  for (const q of state.all) counts.set(q.category, (counts.get(q.category) || 0) + 1);
  const cats = [...counts.keys()].sort((a, b) => a.localeCompare(b, "es"));

  const sel = $("topic");
  sel.replaceChildren(el("option", { value: "", text: `Todos los temas (${state.all.length})` }));
  for (const c of cats) sel.append(el("option", { value: c, text: `${c} (${counts.get(c)})` }));

  const syncTopic = () => {
    const mode = document.querySelector('input[name="mode"]:checked').value;
    $("topic-wrap").hidden = mode !== "practice";
  };
  for (const r of document.querySelectorAll('input[name="mode"]')) r.addEventListener("change", syncTopic);
  syncTopic();
}

$("setup").addEventListener("submit", (e) => {
  e.preventDefault();
  const mode = document.querySelector('input[name="mode"]:checked').value;
  if (mode === "exam") {
    startQuiz("exam", shuffle(state.all).slice(0, EXAM_SIZE));
  } else {
    const topic = $("topic").value;
    const pool = topic ? state.all.filter((q) => q.category === topic) : state.all;
    startQuiz("practice", shuffle(pool));
  }
});

/* ---------- Ronda ---------- */

function startQuiz(mode, questions) {
  state.mode = mode;
  state.quiz = questions.map(prepare);
  state.i = 0;
  buildRoad();
  show("quiz");
  renderQuestion();
}

function buildRoad() {
  const road = $("road");
  road.replaceChildren(...state.quiz.map(() => el("span", { class: "seg" })));
  road.classList.toggle("dense", state.quiz.length > 40);
}

function paintRoad(reveal = false) {
  const segs = $("road").children;
  state.quiz.forEach((q, idx) => {
    const s = segs[idx];
    s.className = "seg";
    if (q.picked !== null && (reveal || state.mode === "practice")) {
      s.classList.add(q.opts[q.picked].ok ? "ok" : "bad");
    } else if (q.picked !== null) {
      s.classList.add("done");
    }
    if (!reveal && idx === state.i && q.picked === null) s.classList.add("current");
  });
}

function renderQuestion() {
  const q = state.quiz[state.i];
  state.answered = false;

  $("q-count").textContent = `Pregunta ${state.i + 1} de ${state.quiz.length}`;
  $("q-cat").textContent = q.category;
  $("q-text").textContent = q.question;
  $("feedback").hidden = true;

  const img = $("q-image");
  if (q.image) {
    img.src = q.image;
    img.alt = q.imageAlt || "Imagen de la pregunta";
    img.hidden = false;
  } else {
    img.removeAttribute("src");
    img.hidden = true;
  }

  const next = $("next");
  next.disabled = true;
  next.textContent = state.i === state.quiz.length - 1
    ? (state.mode === "exam" ? "Ver resultado" : "Terminar")
    : "Siguiente";

  const hasImages = q.opts.some((o) => o.image);
  const box = $("options");
  box.classList.toggle("options-img", hasImages);
  box.replaceChildren(...q.opts.map((o, idx) => {
    const key = el("span", { class: "opt-key", "aria-hidden": "true", text: KEYS[idx] });
    const content = hasImages
      ? el("span", { class: "opt-img-wrap" },
          el("img", { class: "opt-img", src: o.image, alt: o.text, loading: "lazy" }),
          el("span", { class: "opt-img-label", text: o.text }))
      : el("span", { text: o.text });
    const b = el("button", { type: "button", class: "opt", "aria-pressed": "false" }, key, content);
    b.addEventListener("click", () => pick(idx));
    return b;
  }));

  paintRoad();
  $("q-text").focus({ preventScroll: true });
}

function pick(idx) {
  const q = state.quiz[state.i];
  const buttons = [...$("options").children];

  if (state.mode === "exam") {
    // En el simulacro se puede cambiar la respuesta hasta pasar a la siguiente.
    q.picked = idx;
    buttons.forEach((b, j) => b.setAttribute("aria-pressed", String(j === idx)));
    $("next").disabled = false;
    paintRoad();
    return;
  }

  if (state.answered) return;
  state.answered = true;
  q.picked = idx;

  const correctIdx = q.opts.findIndex((o) => o.ok);
  const ok = idx === correctIdx;
  buttons.forEach((b) => (b.disabled = true));
  buttons[correctIdx].classList.add("is-correct");
  if (!ok) buttons[idx].classList.add("is-wrong");
  buttons[idx].setAttribute("aria-pressed", "true");

  const fb = $("feedback");
  fb.classList.toggle("bad", !ok);
  $("fb-verdict").textContent = ok ? "Correcto." : `Incorrecto. La respuesta es: ${q.opts[correctIdx].text}`;
  $("fb-text").textContent = q.explanation;
  $("fb-source").textContent = q.source ? `Fuente: ${q.source}` : "";
  fb.hidden = false;

  $("next").disabled = false;
  $("next").focus({ preventScroll: true });
  paintRoad();
}

function nextQuestion() {
  if ($("next").disabled) return;
  if (state.i < state.quiz.length - 1) {
    state.i++;
    renderQuestion();
  } else {
    showResults();
  }
}

$("next").addEventListener("click", nextQuestion);

/* ---------- Resultado ---------- */

function showResults() {
  const total = state.quiz.length;
  const right = state.quiz.filter((q) => q.opts[q.picked].ok).length;
  const wrongCount = total - right;
  const pct = Math.round((right / total) * 100);

  $("score-num").textContent = right;
  $("score-of").textContent = `de ${total}`;

  const sign = $("score-sign");
  sign.classList.remove("pass", "fail");

  if (state.mode === "exam") {
    // Igual que el examen real: aprueba con hasta MAX_WRONG_TO_PASS errores.
    const passed = wrongCount <= MAX_WRONG_TO_PASS;
    sign.classList.add(passed ? "pass" : "fail");
    $("score-text").textContent = passed
      ? `Aprobado. Te equivocaste en ${wrongCount} de ${total} (el máximo permitido es ${MAX_WRONG_TO_PASS}).`
      : `No aprobado. Te equivocaste en ${wrongCount} de ${total} (el máximo permitido es ${MAX_WRONG_TO_PASS}).`;
  } else {
    $("score-text").textContent = right === total
      ? `Respondiste todo bien (${pct}%).`
      : `Respondiste bien el ${pct}% de las preguntas.`;
  }

  // Resultado por tema, de peor a mejor.
  const byCat = new Map();
  for (const q of state.quiz) {
    const t = byCat.get(q.category) || { right: 0, total: 0 };
    t.total++;
    if (q.opts[q.picked].ok) t.right++;
    byCat.set(q.category, t);
  }
  const rows = [...byCat.entries()].sort((a, b) => a[1].right / a[1].total - b[1].right / b[1].total);
  $("by-topic").replaceChildren(...rows.map(([cat, t]) => {
    const bar = el("span", { class: "bar" }, el("span"));
    bar.firstChild.style.width = `${(t.right / t.total) * 100}%`;
    return el("li", {}, el("span", { text: cat }), el("span", { class: "tally", text: `${t.right} de ${t.total}` }), bar);
  }));

  const wrong = state.quiz.filter((q) => !q.opts[q.picked].ok);
  $("review-title").hidden = wrong.length === 0;
  $("retry-wrong").hidden = wrong.length === 0;
  $("review").replaceChildren(...wrong.map((q) => {
    const correct = q.opts.find((o) => o.ok).text;
    return el("li", {},
      el("p", { class: "rq", text: q.question }),
      el("p", { class: "yours", text: `Tu respuesta: ${q.opts[q.picked].text}` }),
      el("p", { class: "right", text: `Correcta: ${correct}` }),
      el("p", { class: "why", text: q.explanation }),
      el("p", { class: "source", text: q.source ? `Fuente: ${q.source}` : "" }));
  }));

  state.lastWrong = wrong;
  paintRoad(true);
  show("results");
}

$("retry-wrong").addEventListener("click", () => {
  // Vuelve a las preguntas originales para mezclar las opciones de nuevo.
  const originals = state.lastWrong.map(({ opts, picked, ...q }) => q);
  startQuiz("practice", shuffle(originals));
});

function goHome() {
  $("road").replaceChildren();
  $("road").classList.remove("dense");
  show("home");
}

$("home-btn").addEventListener("click", goHome);
$("quit").addEventListener("click", goHome);
$("brand").addEventListener("click", (e) => { e.preventDefault(); if (state.all.length) goHome(); });

/* ---------- Teclado ---------- */

document.addEventListener("keydown", (e) => {
  if ($("quiz").hidden || e.altKey || e.ctrlKey || e.metaKey) return;
  const idx = KEYS.indexOf(e.key);
  if (idx !== -1 && idx < state.quiz[state.i].opts.length) {
    e.preventDefault();
    pick(idx);
  } else if (e.key === "Enter" && document.activeElement !== $("quit")) {
    // Enter siempre avanza (si ya hay respuesta), aunque el foco esté en una opción.
    e.preventDefault();
    nextQuestion();
  }
});

load();
