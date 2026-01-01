/* quiz.js - Skinlyst Quiz (single-page, 10 screens total)
   Screens:
   1) Hero
   2) Intro
   3-10) Questions 1-8
*/

(function () {
  const screens = {
    hero: document.getElementById("screen-hero"),
    intro: document.getElementById("screen-intro"),
    quiz: document.getElementById("screen-quiz"),
  };

  // Hero controls
  const mulaiAnalisisBtn = document.getElementById("mulaiAnalisisBtn");
  const analisisChoice = document.getElementById("analisisChoice");
  const quizJenisBtn = document.getElementById("quizJenisBtn");
  const scanWajahBtn = document.getElementById("scanWajahBtn");

  // Intro controls
  const mulaiSekarangBtn = document.getElementById("mulaiSekarangBtn");

  // Quiz UI
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

  // 8 Questions
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

  // Answers for Q1..Q8
  // Store chosen key string (e.g. "A", "B", "C")
  const answers = new Array(questions.length).fill(null);

  // Current question index (0..7)
  let qIndex = 0;

  // Result mapping for Q4..Q8 only
  const skinMap = {
    A: "dry",
    B: "oily",
    C: "normal",
  };

  function showScreen(name) {
    Object.values(screens).forEach((el) => el.classList.add("hidden"));
    screens[name].classList.remove("hidden");

    // Small UX: scroll to top of content area on screen change
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function setChoiceVisibility(open) {
    analisisChoice.classList.toggle("hidden", !open);
    analisisChoice.setAttribute("aria-hidden", String(!open));
  }

  function progressForCurrentQuestion() {
    // Requirement:
    // - Progress increases only AFTER selecting an option.
    // - On Qn page (index i), before answer = i*12.5, after answer = (i+1)*12.5
    const step = 100 / questions.length; // 12.5
    const base = qIndex * step;
    const hasAnswer = answers[qIndex] !== null;
    const pct = Math.min(100, hasAnswer ? base + step : base);
    return pct;
  }

  function updateProgressUI() {
    const pct = progressForCurrentQuestion();
    progressFill.style.width = `${pct}%`;
    progressTrack?.setAttribute("aria-valuenow", String(Math.round(pct)));

    // progressText shows "current / total" like screenshot style
    // We'll display how many questions have been "completed" up to current:
    // completed = qIndex + (answered? 1 : 0)
    const completed = qIndex + (answers[qIndex] ? 1 : 0);
    progressText.textContent = `${completed} / ${questions.length}`;
  }

  function renderQuestion() {
    const q = questions[qIndex];

    // header
    questionNumber.textContent = `${qIndex + 1} / ${questions.length}`;
    questionTitle.textContent = `${qIndex + 1}. ${q.title}`;

    // options
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

        // Update selection styles
        [...optionsWrap.querySelectorAll(".option-btn")].forEach((b) => {
          b.classList.remove("selected");
          b.setAttribute("aria-checked", "false");
        });
        btn.classList.add("selected");
        btn.setAttribute("aria-checked", "true");

        // Enable navigation
        if (qIndex < questions.length - 1) {
          nextBtn.disabled = false;
        } else {
          resultBtn.disabled = false;
        }

        quizHint.textContent = "";
        updateProgressUI();
      });

      optionsWrap.appendChild(btn);
    });

    // buttons + states
    const hasAnswer = answers[qIndex] !== null;

    // Prev always available in quiz (Q1 goes back to intro)
    prevBtn.disabled = false;

    // Show result button only on last question
    const isLast = qIndex === questions.length - 1;
    resultBtn.classList.toggle("hidden", !isLast);
    nextBtn.classList.toggle("hidden", isLast);

    if (!isLast) {
      nextBtn.disabled = !hasAnswer;
    } else {
      resultBtn.disabled = !hasAnswer;
    }

    updateProgressUI();
  }

  function goToQuestion(index) {
    qIndex = Math.max(0, Math.min(questions.length - 1, index));
    renderQuestion();
  }

  function computeResultSlug() {
    // Only Q4..Q8 => indices 3..7
    const counts = { dry: 0, oily: 0, normal: 0 };

    for (let i = 3; i <= 7; i++) {
      const key = answers[i]; // A/B/C
      const slug = skinMap[key];
      if (slug) counts[slug]++;
    }

    const max = Math.max(counts.dry, counts.oily, counts.normal);

    // tie handling: pick one "terserah" (we’ll use priority dry > oily > normal)
    const priority = ["dry", "oily", "normal"];
    const winner = priority.find((k) => counts[k] === max) || "normal";
    return winner;
  }

  function ensureAllAnswered() {
    // For safety, require every question answered
    const firstMissing = answers.findIndex((a) => a === null);
    if (firstMissing !== -1) {
      quizHint.textContent = "Pilih salah satu jawaban dulu ya 😊";
      goToQuestion(firstMissing);
      return false;
    }
    return true;
  }

  /* =========================
     Events
  ========================= */
  // Start: reveal quiz/scan choices
  mulaiAnalisisBtn?.addEventListener("click", () => {
    const isHidden = analisisChoice.classList.contains("hidden");
    setChoiceVisibility(isHidden);
  });

  // Choose quiz
  quizJenisBtn?.addEventListener("click", () => {
    showScreen("intro");
  });

  // Choose scan wajah
  scanWajahBtn?.addEventListener("click", () => {
    // Change this filename if yours differs
    window.location.href = "scan.html";
  });

  // Intro -> start quiz
  mulaiSekarangBtn?.addEventListener("click", () => {
    showScreen("quiz");
    qIndex = 0;
    renderQuestion();
  });

  // Prev button
  prevBtn?.addEventListener("click", () => {
    if (qIndex === 0) {
      // back to intro screen
      showScreen("intro");
      return;
    }
    goToQuestion(qIndex - 1);
  });

  // Next button
  nextBtn?.addEventListener("click", () => {
    if (answers[qIndex] === null) {
      quizHint.textContent = "Pilih salah satu jawaban dulu ya 😊";
      return;
    }
    if (qIndex < questions.length - 1) {
      goToQuestion(qIndex + 1);
    }
  });

  // Result button
  resultBtn?.addEventListener("click", () => {
    if (answers[qIndex] === null) {
      quizHint.textContent = "Pilih salah satu jawaban dulu ya 😊";
      return;
    }

    // If user somehow skips answers, force them to complete
    if (!ensureAllAnswered()) return;

    const slug = computeResultSlug();

    if (slug === "dry") window.location.href = "results-dry.html";
    else if (slug === "oily") window.location.href = "results-oily.html";
    else window.location.href = "results-normal.html";
  });

  // Default: hero only
  showScreen("hero");
  setChoiceVisibility(false);
})();
