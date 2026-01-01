/* quiz.js - MySkinlyst Quiz (9 screens total)
   Screen 1: Intro
   Screen 2: Quiz (Q1..Q8 inside)
*/

(function () {
  const screenIntro = document.getElementById("screen-1");
  const screenQuiz = document.getElementById("screen-2");

  const startQuizBtn = document.getElementById("startQuizBtn");

  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  const progressTrack = document.querySelector(".progress-track");

  const questionNumber = document.getElementById("questionNumber");
  const questionTitle = document.getElementById("questionTitle");
  const optionsWrap = document.getElementById("optionsWrap");
  const quizHint = document.getElementById("quizHint");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const resultBtn = document.getElementById("resultBtn");

  const questions = [
    {
      title: "Apa jenis kelamin kamu?",
      options: [
        { key: "A", label: "Laki-laki" },
        { key: "B", label: "Perempuan" },
      ],
      affectsResult: false,
    },
    {
      title: "Berapa rentang usia kamu saat ini?",
      options: [
        { key: "A", label: "< 18 tahun" },
        { key: "B", label: "18–25 tahun" },
        { key: "C", label: "26–35 tahun" },
        { key: "D", label: "> 35 tahun" },
      ],
      affectsResult: false,
    },
    {
      title: "Kamu tinggal di wilayah dengan iklim seperti apa?",
      options: [
        { key: "A", label: "Panas dan lembap (contoh: Surabaya, Jakarta)" },
        { key: "B", label: "Sejuk atau dingin (contoh: Malang, Bandung)" },
        { key: "C", label: "Sangat panas dan cenderung kering (contoh: Nusa Tenggara, Bali saat kemarau)" },
      ],
      affectsResult: false,
    },
    {
      title: "Setelah cuci muka, 1–2 jam kemudian wajah terasa",
      options: [
        { key: "A", label: "Kering atau ketarik" },
        { key: "B", label: "Berminyak di hampir seluruh wajah" },
        { key: "C", label: "Nyaman, seimbang" },
      ],
      affectsResult: true,
    },
    {
      title: "Kondisi pori-pori di wajahmu?",
      options: [
        { key: "A", label: "Hampir tidak terlihat" },
        { key: "B", label: "Besar di seluruh wajah" },
        { key: "C", label: "Normal" },
      ],
      affectsResult: true,
    },
    {
      title: "Masalah kulit yang paling sering kamu alami?",
      options: [
        { key: "A", label: "Mengelupas, pecah-pecah" },
        { key: "B", label: "Jerawat, komedo, kilap berlebih" },
        { key: "C", label: "Jarang masalah" },
      ],
      affectsResult: true,
    },
    {
      title: "Bagaimana tekstur kulit kamu secara keseluruhan?",
      options: [
        { key: "A", label: "Terkadang terasa kasar, terutama di daerah pipi atau sekitar hidung" },
        { key: "B", label: "Terasa tebal dan cenderung memiliki tekstur tidak merata" },
        { key: "C", label: "Halus, kenyal" },
      ],
      affectsResult: true,
    },
    {
      title: "Bagaimana reaksi kulitmu saat mencoba produk skincare baru?",
      options: [
        { key: "A", label: "Awalnya baik, tapi lama-kelamaan terasa kering atau ketarik" },
        { key: "B", label: "Berminyak di area tertentu, tapi bagian lain tetap normal" },
        { key: "C", label: "Tidak ada reaksi berarti, terasa aman" },
      ],
      affectsResult: true,
    },
  ];

  const answers = new Array(questions.length).fill(null);
  let qIndex = 0;

  const skinMap = { A: "dry", B: "oily", C: "normal" };

  function showIntro() {
    screenIntro.classList.remove("hidden");
    screenQuiz.classList.add("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showQuiz() {
    screenIntro.classList.add("hidden");
    screenQuiz.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function progressForCurrentQuestion() {
    const step = 100 / questions.length; // 12.5
    const base = qIndex * step;
    const hasAnswer = answers[qIndex] !== null;
    return Math.min(100, hasAnswer ? base + step : base);
  }

  function updateProgressUI() {
    const pct = progressForCurrentQuestion();
    progressFill.style.width = `${pct}%`;
    progressTrack?.setAttribute("aria-valuenow", String(Math.round(pct)));

    const completed = qIndex + (answers[qIndex] ? 1 : 0);
    progressText.textContent = `${completed} / ${questions.length}`;
  }

  function renderQuestion() {
    const q = questions[qIndex];

    questionNumber.textContent = `${qIndex + 1} / ${questions.length}`;
    questionTitle.textContent = `${qIndex + 1}. ${q.title}`;
    optionsWrap.innerHTML = "";

    const selectedKey = answers[qIndex];

    q.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.setAttribute("role", "radio");
      btn.setAttribute("aria-checked", "false");

      if (selectedKey === opt.key) {
        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");
      }

      btn.innerHTML = `
        <span class="option-prefix">${opt.key}.</span>
        <span class="option-label">${opt.label}</span>
      `;

      btn.addEventListener("click", () => {
        answers[qIndex] = opt.key;

        [...optionsWrap.querySelectorAll(".option-btn")].forEach((b) => {
          b.classList.remove("selected");
          b.setAttribute("aria-checked", "false");
        });

        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");

        if (qIndex < questions.length - 1) nextBtn.disabled = false;
        else resultBtn.disabled = false;

        quizHint.textContent = "";
        updateProgressUI();
      });

      optionsWrap.appendChild(btn);
    });

    const hasAnswer = answers[qIndex] !== null;
    const isLast = qIndex === questions.length - 1;

    // Prev: if Q1, go back to intro
    prevBtn.disabled = false;

    resultBtn.classList.toggle("hidden", !isLast);
    nextBtn.classList.toggle("hidden", isLast);

    if (!isLast) nextBtn.disabled = !hasAnswer;
    else resultBtn.disabled = !hasAnswer;

    updateProgressUI();
  }

  function goToQuestion(index) {
    qIndex = Math.max(0, Math.min(questions.length - 1, index));
    renderQuestion();
  }

  function computeResultSlug() {
    const counts = { dry: 0, oily: 0, normal: 0 };

    // Only Q4..Q8 => indices 3..7
    for (let i = 3; i <= 7; i++) {
      const key = answers[i];
      const slug = skinMap[key];
      if (slug) counts[slug]++;
    }

    const max = Math.max(counts.dry, counts.oily, counts.normal);
    const priority = ["dry", "oily", "normal"]; // tie -> dry first
    return priority.find((k) => counts[k] === max) || "normal";
  }

  function ensureAllAnswered() {
    const firstMissing = answers.findIndex((a) => a === null);
    if (firstMissing !== -1) {
      quizHint.textContent = "Pilih salah satu jawaban dulu ya 😊";
      goToQuestion(firstMissing);
      return false;
    }
    return true;
  }

  /* Events */
  startQuizBtn?.addEventListener("click", () => {
    showQuiz();
    qIndex = 0;
    renderQuestion();
  });

  prevBtn?.addEventListener("click", () => {
    if (qIndex === 0) {
      showIntro();
      return;
    }
    goToQuestion(qIndex - 1);
  });

  nextBtn?.addEventListener("click", () => {
    if (answers[qIndex] === null) {
      quizHint.textContent = "Pilih salah satu jawaban dulu ya 😊";
      return;
    }
    if (qIndex < questions.length - 1) goToQuestion(qIndex + 1);
  });

  resultBtn?.addEventListener("click", () => {
    if (answers[qIndex] === null) {
      quizHint.textContent = "Pilih salah satu jawaban dulu ya 😊";
      return;
    }
    if (!ensureAllAnswered()) return;

    const slug = computeResultSlug();
    if (slug === "dry") window.location.href = "results-dry.html";
    else if (slug === "oily") window.location.href = "results-oily.html";
    else window.location.href = "results-normal.html";
  });

  // Default: Intro (Screen 1)
  showIntro();
})();
