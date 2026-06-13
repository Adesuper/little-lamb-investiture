// Little Lamb Program Walkthrough — interactive logic

// ---------- Global Background Music (BGM) ----------
// Lives in document.body so it survives all view re-renders.
// Used for "I Am a Little Lamb Today" during photo slideshow (slides 1-4).
// Auto-pauses on slide 5 (where the song "Oh What a Miracle" plays instead).
const BGM = {
  audio: null,
  src: "i-am-a-little-lamb.mp3",
  init() {
    if (this.audio) return;
    this.audio = document.createElement("audio");
    this.audio.id = "global-bgm";
    this.audio.src = this.src;
    this.audio.loop = true;
    this.audio.volume = 0.45;
    this.audio.style.display = "none";
    document.body.appendChild(this.audio);
    this.audio.addEventListener("play", () => renderBgmWidget());
    this.audio.addEventListener("pause", () => renderBgmWidget());
  },
  play() {
    this.init();
    return this.audio.play();
  },
  pause() {
    if (this.audio) this.audio.pause();
  },
  isPlaying() {
    return this.audio && !this.audio.paused && this.audio.currentTime > 0;
  },
  toggle() {
    if (this.isPlaying()) { this.pause(); return Promise.resolve(false); }
    return this.play().then(() => true).catch(() => false);
  }
};

function renderBgmWidget() {
  let widget = document.getElementById("bgm-widget");
  if (!widget) {
    widget = document.createElement("div");
    widget.id = "bgm-widget";
    widget.title = "Click to pause Little Lamb song";
    document.body.appendChild(widget);
    // Widget click = ALWAYS pause (widget only visible while playing)
    widget.addEventListener("click", () => {
      BGM.pause();
      renderBgmWidget();
    });
  }
  const playing = BGM.isPlaying();
  widget.innerHTML = playing ? "🐑 ⏸ Pause Music" : "";
  widget.style.display = playing ? "flex" : "none";
}

// BGM plays ONLY on the year-photos slide (slide 2). Auto-pause everywhere else.
// This is enforced on every step render so it can't drift out of sync.
function autoPauseBgmForSongSlide() {
  if (currentView !== "program") {
    if (BGM.isPlaying()) BGM.pause();
    return;
  }
  const step = PROGRAM[currentStepIndex];
  const isPhotoSlide = step && step.show && step.show.type === "year-photos-combined";
  if (!isPhotoSlide && BGM.isPlaying()) BGM.pause();
}

let currentView = "program";
let currentSessionId = null;
let currentStepIndex = 0;
let lightboxIndex = 0;
let lightboxList = [];
let carouselIndex = 0;
let carouselTimer = null;
let stepTimerSec = 0;
let stepTimerInterval = null;
let showKidActions = true;
let audienceMode = false;

// ---------- Routing ----------
function setView(name, payload) {
  currentView = name;
  if (name === "session") currentSessionId = payload;
  if (name !== "program") stopCarousel();
  render();
  window.scrollTo(0, 0);
  updateNav();
}

function updateNav() {
  document.querySelectorAll("nav.topbar button[data-view]").forEach(b => {
    b.classList.toggle("active", b.dataset.view === currentView);
  });
}

// ---------- Render dispatcher ----------
function render() {
  const main = document.getElementById("main");
  if (currentView === "home")     main.innerHTML = renderHome();
  else if (currentView === "program")  main.innerHTML = renderProgram();
  else if (currentView === "pillars")  main.innerHTML = renderPillars();
  else if (currentView === "session")  main.innerHTML = renderSession(currentSessionId);
  else if (currentView === "songs")    main.innerHTML = renderSongs();
  else if (currentView === "verses")   main.innerHTML = renderVerses();
  else if (currentView === "practice") main.innerHTML = renderPractice();
  attachHandlers();
  if (currentView === "program") onStepRendered();
  if (audienceMode) renderAudience();
}

// ---------- Home ----------
function renderHome() {
  return `
    <div class="hero">
      <div class="big-emoji">🐑</div>
      <h1>Little Lamb Investiture</h1>
      <h2>Class of 2025–2026 ✨</h2>
      <p style="font-size: 1.2rem; max-width: 680px; margin: 16px auto; color: var(--soft);">
        A celebration with our pastor, staff, parents, and church family —
        honoring the year God walked with these little ones.
      </p>
      <div style="margin-top: 24px;">
        <button class="btn-big" data-view="program">▶️ Start the Investiture</button>
        <button class="btn-big secondary" data-view="pillars">🌈 Browse Sessions</button>
        <button class="btn-big secondary" data-view="songs">🎵 Songs</button>
        <button class="btn-big secondary" data-view="verses">📖 Verses</button>
        <button class="btn-big secondary" data-view="practice">🎤 Practice</button>
        <button class="btn-big secondary" onclick="window.location.href='flashcards.html'">📇 Print Flash Cards</button>
        <button class="btn-big secondary" onclick="window.location.href='stickers.html'">✂️ Print Stickers</button>
        <button class="btn-big secondary" onclick="window.location.href='name-tags.html'">🏷️ Print Name Tags</button>
        <button class="btn-big secondary" onclick="window.location.href='today.html'">📅 Today's Rehearsal Plan</button>
      </div>
      <p style="margin-top: 28px; color: var(--soft); font-size: 0.95rem; line-height: 1.6;">
        ✨ <strong>For the presenter:</strong> Click "Start the Investiture" → press <strong>F</strong> or click "🎬 Show Audience" for fullscreen mode.<br>
        Text and photos will appear LARGE on the screen for everyone to see, even from the back row.
      </p>
    </div>
  `;
}

// ---------- Memory Verse Wall ----------
function renderVerses() {
  // Highlight the song-aligned verse first
  const songVerse = SESSIONS.find(s => s.id === "s4"); // Psalm 139:14
  const others = SESSIONS.filter(s => s.id !== "s4");
  const verseCard = (s, big) => `
    <div class="verse-card ${big ? 'big' : ''}" style="border-color: ${s.pillarColor}; background: linear-gradient(180deg, #fff, ${s.pillarColor}22);">
      <div class="verse-pillar" style="color: ${s.pillarColor};">${pillarEmoji(s.pillar)} ${s.pillar}</div>
      <h3>${s.title}</h3>
      <div class="verse-big">"${s.verse.split(" — ")[0]}"</div>
      <div class="verse-ref">— ${s.verse.split(" — ")[1] || ""}</div>
      <div class="verse-kidsline">Kids say: <strong>"${s.kidsLine}"</strong></div>
    </div>
  `;
  return `
    <h1 class="section-title">📖 Our Memory Verses</h1>
    <p class="section-subtitle">Every verse we hid in our hearts this year</p>

    <div class="verse-spotlight">
      <div class="spot-badge">🎵 Song Verse — "Oh What a Miracle I Am"</div>
      ${verseCard(songVerse, true)}
      <p class="spot-note">
        This is the verse that goes with our song. When we sing "God made my fingers, my eyes and my toes" — this is what the Bible says about it.
        Pair it with <strong>Psalm 100:3</strong> — "It is he who made us, and we are his."
      </p>
    </div>

    <h2 class="section-title" style="margin-top: 50px; font-size: 1.4rem;">All 8 verses from the year</h2>
    <div class="verses-grid">
      ${SESSIONS.map(s => verseCard(s, false)).join("")}
    </div>

    <div class="verses-tips">
      <h3>💡 How to memorize verses with kids</h3>
      <ul>
        <li><strong>Say it 3 times together</strong> — once normally, once loud, once whispered.</li>
        <li><strong>Add hand motions</strong> — kids remember what their body does.</li>
        <li><strong>Call & response</strong> — you say a phrase, they finish it.</li>
        <li><strong>One verse per week</strong> — don't pile them on. The year had 8, that's perfect.</li>
      </ul>
    </div>
  `;
}

// ---------- Practice: Oh What a Miracle I Am ----------
function renderPractice() {
  const song = SONGS.find(s => s.title === "Oh What a Miracle I Am");
  const lyricsHtml = song
    ? song.lyrics.map(l => l ? `<div class="line">${l}</div>` : `<div class="line spacer">&nbsp;</div>`).join("")
    : "";
  const partsHtml = SONG_PARTS.map(p => `
    <div class="song-part-card" style="border-color: ${p.color};">
      <div class="sp-header" style="background: ${p.color};">
        <span class="sp-number">${p.part}</span>
        <span class="sp-name-line">Kid: <span class="sp-line">______________________</span></span>
      </div>
      <div class="sp-body">
        <div class="sp-line-text">"${p.leadLine}"</div>
        <div class="sp-action"><strong>Action:</strong> ${p.action}</div>
        <div class="sp-note">💡 ${p.note}</div>
      </div>
    </div>
  `).join("");
  return `
    <h1 class="section-title">🎤 Practice: Oh What a Miracle I Am</h1>
    <p class="section-subtitle">Watch · learn the motions · split into parts for each kid</p>

    <div class="practice-grid">
      <div class="practice-video">
        <h3>🎬 The Song Video</h3>
        <div class="video-wrap">
          <video src="oh-what-a-miracle.mp4" controls preload="metadata"></video>
        </div>
        <p style="margin-top: 8px; color: var(--soft); font-size: 0.9rem; text-align: center;">
          The actual kids' practice video — plays from your local folder, no internet needed.
        </p>
      </div>

      <div class="practice-lyrics">
        <h3>📝 Full Lyrics</h3>
        <div class="lyrics-big">${lyricsHtml}</div>
      </div>
    </div>

    <h2 class="section-title" style="margin-top: 40px; font-size: 1.4rem;">👧🧒 Song Split — One Part Per Kid</h2>
    <p class="section-subtitle">Assign each of the 6 kids a lead line. Everyone joins on "Oh, what a miracle I am!" and on the chorus.</p>

    <div class="song-parts-grid">
      ${partsHtml}
    </div>

    <div class="how-to-split">
      <h3>🎯 How the song flows in performance</h3>
      <ol>
        <li><strong>Kid 1</strong> sings their solo line · everyone joins on "Oh, what a miracle I am!"</li>
        <li><strong>Kid 2</strong> sings their solo line · everyone joins on "Oh, what a miracle I am!"</li>
        <li><strong>EVERYONE</strong> sings the chorus together</li>
        <li><strong>Kid 3</strong> sings their solo line · everyone joins on "Oh, what a miracle I am!"</li>
        <li><strong>Kid 4</strong> sings their solo line · everyone joins on "Oh, what a miracle I am!"</li>
        <li><strong>EVERYONE</strong> sings the chorus together</li>
        <li><strong>Kid 5</strong> sings their solo · then <strong>Kid 6</strong> sings the final line — big smile, big finish!</li>
      </ol>
      <p><strong>Why this works:</strong> Every child gets a moment of solo confidence, but no one is alone for long. The "Oh, what a miracle I am!" everyone-line lifts each kid up after they sing their part.</p>
    </div>

    <h2 class="section-title" style="margin-top: 40px; font-size: 1.4rem;">📅 Tomorrow's Class Plan (last class!)</h2>
    <div class="class-plan">
      <div class="plan-row"><span class="plan-time">0–5 min</span><span class="plan-task">Warm-up + recite <strong>Psalm 139:14</strong> together</span></div>
      <div class="plan-row"><span class="plan-time">5–10 min</span><span class="plan-task">Watch the song video twice — just listen first time, sing along second time</span></div>
      <div class="plan-row highlight"><span class="plan-time">10–25 min</span><span class="plan-task">👧🧒 <strong>ASSIGN PARTS:</strong> pick a kid for each of the 6 song parts. Hand out their song-part card.</span></div>
      <div class="plan-row"><span class="plan-time">25–40 min</span><span class="plan-task">Practice each kid's part — they say their line and do their action solo. Praise loudly.</span></div>
      <div class="plan-row"><span class="plan-time">40–50 min</span><span class="plan-task">Full run-through with all parts + chorus. Repeat.</span></div>
      <div class="plan-row highlight"><span class="plan-time">50–55 min</span><span class="plan-task">🎥 <strong>RECORD</strong> the full song with all parts — 2 takes (landscape mode)</span></div>
      <div class="plan-row"><span class="plan-time">55–60 min</span><span class="plan-task">Hand out verse flash cards · closing prayer</span></div>
    </div>

    <div class="verses-tips" style="margin-top: 28px;">
      <h3>🎥 Recording tips for the investiture video</h3>
      <ul>
        <li><strong>Phone landscape mode</strong> — 16:9 looks better on the projector.</li>
        <li><strong>Stand 6–8 feet back</strong> — get all 6 kids in frame.</li>
        <li><strong>Get 2 takes</strong> — one is always better than the other.</li>
        <li><strong>Quiet room</strong> — close door, turn off fans.</li>
      </ul>
    </div>

    <div style="text-align:center; margin-top: 30px;">
      <a href="flashcards.html" style="display:inline-block; background: linear-gradient(180deg,#f59e0b,#b45309); color:#fff; padding:14px 30px; border-radius:999px; font-weight:800; text-decoration:none; font-size:1.05rem; margin: 6px;">📇 Print Verse Flash Cards</a>
      <a href="song-parts.html" style="display:inline-block; background: linear-gradient(180deg,#a78bfa,#7c3aed); color:#fff; padding:14px 30px; border-radius:999px; font-weight:800; text-decoration:none; font-size:1.05rem; margin: 6px;">🎵 Print Song-Part Cards</a>
    </div>
  `;
}

// ---------- Pillars ----------
function renderPillars() {
  return `
    <h1 class="section-title">Our Year in Four Pillars 🌈</h1>
    <p class="section-subtitle">Tap a pillar to see those sessions</p>
    <div class="pillars-grid">
      ${PILLARS.map(p => `
        <div class="pillar-card" data-pillar="${p.name}" style="border-color: ${p.color};">
          <span class="emoji">${p.emoji}</span>
          <h3 style="color: ${p.color};">${p.name}</h3>
          <p>${p.tagline}</p>
          <span class="session-count">${p.sessions.length} ${p.sessions.length === 1 ? 'session' : 'sessions'}</span>
        </div>
      `).join("")}
    </div>
    <h2 class="section-title" style="margin-top: 50px;">All Sessions 📸</h2>
    <div class="pillars-grid">
      ${SESSIONS.map(s => `
        <div class="pillar-card" data-session="${s.id}" style="border-color: ${s.pillarColor};">
          <span class="emoji">${pillarEmoji(s.pillar)}</span>
          <h3 style="color: ${s.pillarColor}; font-size: 1.2rem;">${s.title}</h3>
          <p style="font-size: 0.9rem;">${s.date}</p>
          <span class="session-count">${s.photos.length} photos</span>
        </div>
      `).join("")}
    </div>
  `;
}
function pillarEmoji(name) {
  const p = PILLARS.find(x => x.name === name);
  return p ? p.emoji : "🌟";
}

// ---------- Session ----------
function renderSession(id) {
  const s = SESSIONS.find(x => x.id === id);
  if (!s) return `<p>Session not found.</p>`;
  return `
    <button class="btn-big secondary" data-view="pillars" style="font-size: 0.95rem; padding: 10px 18px;">← Back</button>
    <div class="session-header" style="border-top-color: ${s.pillarColor};">
      <div class="date">${s.date} • ${s.pillar}</div>
      <h2>${s.title}</h2>
      <div class="activity">${s.activity}</div>
      <div class="verse">"${s.verse}"</div>
      <div class="kids-line">Kids say: "${s.kidsLine}"</div>
    </div>
    <div class="gallery">
      ${s.photos.map((src, i) => `
        <div class="photo" data-index="${i}">
          ${src.endsWith(".mp4")
            ? `<video src="${src}" muted></video>`
            : `<img src="${src}" alt="${s.title}" loading="lazy">`}
        </div>
      `).join("")}
    </div>
  `;
}

// ---------- Songs ----------
function renderSongs() {
  return `
    <h1 class="section-title">Songs We Sang 🎵</h1>
    <p class="section-subtitle">Sing along with us!</p>
    <div class="songs-grid">
      ${SONGS.map(song => `
        <div class="song-card">
          <h3>🎤 ${song.title}</h3>
          <div class="lyrics">${song.lyrics.join("<br>")}</div>
        </div>
      `).join("")}
    </div>
  `;
}

// ---------- PROGRAM ----------
function renderProgram() {
  const total = PROGRAM.length;
  const step = PROGRAM[currentStepIndex];
  const progressPct = ((currentStepIndex + 1) / total) * 100;
  return `
    <div class="program-layout">
      <aside class="program-sidebar">
        <h3>Run of Show</h3>
        ${PROGRAM.map((p, i) => `
          <button class="step-link ${i === currentStepIndex ? 'active' : ''} ${i < currentStepIndex ? 'done' : ''}" data-step="${i}">
            <span class="step-time">${p.time} • ${formatDuration(p.durationSec)}</span>
            ${i + 1}. ${p.title}
          </button>
        `).join("")}
      </aside>
      <div class="program-main">
        <div class="program-controls">
          <div class="progress">
            <div class="progress-label">Step ${currentStepIndex + 1} of ${total}</div>
            <div class="progress-bar"><div class="progress-fill" style="width: ${progressPct}%;"></div></div>
          </div>
          <div class="timer" id="step-timer">${formatTime(stepTimerSec)}</div>
          <button id="timer-toggle">${stepTimerInterval ? "⏸ Pause" : "▶ Start"}</button>
          <button class="secondary" id="timer-reset">🔄</button>
          <button class="secondary" id="prev-step">◀</button>
          <button id="next-step">Next ▶</button>
          <button class="hot" id="audience-btn" title="Show full-screen audience view (F)">🎬 Show Audience</button>
          <label class="toggle">
            <input type="checkbox" id="kid-actions-toggle" ${showKidActions ? 'checked' : ''}>
            Kid actions
          </label>
        </div>

        <div class="step-card" style="border-top-color: ${stepColor(step)};">
          <div class="step-meta">
            <span class="badge">${step.time} – ${formatDuration(step.durationSec)}</span>
            <span>👤 ${step.who}</span>
            <span style="margin-left: auto; color: var(--soft); font-size: 0.85rem;">🔒 Presenter only — not shown to audience</span>
          </div>
          <h2>${step.title}</h2>
          <div class="script-block">
            <span class="label">📘 Teacher script (you say this)</span>
            ${step.script}
          </div>
          ${showKidActions ? `
            <div class="kids-block">
              <span class="label">🟧 Kids action</span>
              ${step.kidsAction}
            </div>
          ` : ''}
        </div>

        <div style="text-align: center; margin: 8px 0; color: var(--soft); font-size: 0.9rem;">
          ⬇️ Audience preview ⬇️ &nbsp;&nbsp; <span style="background: var(--sun); padding: 2px 10px; border-radius: 999px;">Press F or click "🎬 Show Audience" for fullscreen</span>
        </div>

        <div class="screen-area" id="screen-area">
          ${renderScreen(step.show)}
        </div>
      </div>
    </div>
  `;
}

function stepColor(step) {
  if (step.show && step.show.type === "sessions") {
    const sId = step.show.sessionIds[0];
    const s = SESSIONS.find(x => x.id === sId);
    return s ? s.pillarColor : "var(--sun)";
  }
  if (step.show && step.show.type === "song-with-photos") {
    const sId = step.show.sessionIds && step.show.sessionIds[0];
    const s = SESSIONS.find(x => x.id === sId);
    return s ? s.pillarColor : "var(--sun)";
  }
  return "var(--sun)";
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s === 0 ? `${m} min` : `${m}m ${s}s`;
}
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ---------- Screen content (used by both preview and audience view) ----------
function renderScreen(show, big) {
  if (!show) return `<div class="screen-title"><h1>—</h1></div>`;
  if (show.type === "title") {
    return `
      <div class="screen-title ${big ? 'big' : ''}">
        <div class="sparkle">✨</div>
        <h1>${show.title}</h1>
        <h2>${show.subtitle || ""}</h2>
        <div class="sparkle right">⭐</div>
      </div>`;
  }
  if (show.type === "all-photos") {
    const allPhotos = SESSIONS.flatMap(s => s.photos.map(p => ({ src: p, caption: s.title + " — " + s.date })));
    return renderCarousel(allPhotos, big);
  }
  if (show.type === "year-photos-combined") {
    // Curated slideshow — representative photos per session (no duplicates).
    // Skips videos and music sheets (those are on slide 4). Plant photos appended at end.
    // Target: ~25 photos. Run length at 4.5s each = ~110 seconds, fits in slide 2's 3 min.
    const SELECTION = [
      { id: "s1", count: 3 },  // Sheep crafts — most varied
      { id: "s2", count: 2 },  // More sheep
      { id: "s3", count: 2 },  // God Loves Me stone
      { id: "s4", count: 3 },  // Marvelous Me — "I Am Special" paper-bag dolls
      { id: "s6", count: 2 },  // Bible friends + bubbles
      { id: "s7", count: 4 },  // Star crafts — incl. the stars on the board
      { id: "s5", count: 2 },  // Bread making
      { id: "s8", count: 4 }   // Community helpers — incl. the group holding their signs
    ];
    const allPhotos = [];
    SELECTION.forEach(sel => {
      const s = SESSIONS.find(x => x.id === sel.id);
      if (!s) return;
      // Skip videos (.mp4) — only include photos
      const photos = s.photos.filter(p => !p.toLowerCase().endsWith(".mp4")).slice(0, sel.count);
      photos.forEach(p => allPhotos.push({ src: p, caption: s.title }));
    });
    // Append plant photos (skipping music sheets and videos in s9) to land near 25 total.
    const plantSources = ["./plant1.jpeg", "./plant2.jpeg", "./plant3.jpeg"];
    plantSources.forEach(p => allPhotos.push({ src: p, caption: "Our plants — caring for what God made" }));

    const playing = BGM.isPlaying();
    return `
      <div class="year-photos-wrap">
        ${renderCarousel(allPhotos, big)}
        <div class="slide2-music-controls">
          <button class="slide2-music-btn" id="slide2-music-btn" style="${playing ? 'display:none' : ''}">🐑 Play "I Am a Little Lamb Today"</button>
          <button class="slide2-music-stop" id="slide2-music-stop" style="${playing ? '' : 'display:none'}">⏸ Pause Music</button>
        </div>
      </div>
    `;
  }
  if (show.type === "verses-display") {
    // Big grid of verses and kids' lines, color-coded by pillar.
    // Pass sessionIds in show.sessionIds to display only specific verses (one per child).
    // If omitted, shows all 9 verses.
    const ids = show.sessionIds && show.sessionIds.length ? show.sessionIds : SESSIONS.map(s => s.id);
    const verseSessions = ids.map(id => SESSIONS.find(s => s.id === id)).filter(Boolean);
    return `
      <div class="verses-display ${big ? 'big' : ''}">
        <h2>📖 Some of the Things We Learned This Year</h2>
        <div class="vd-grid">
          ${verseSessions.map(s => {
            const verseText = s.verse.split(" — ")[0].replace(/^"|"$/g, "");
            const verseRef = s.verse.split(" — ")[1] || "";
            return `
              <div class="vd-card" style="border-color: ${s.pillarColor}; background: linear-gradient(180deg, #fff, ${s.pillarColor}22);">
                <div class="vd-emoji">${pillarEmoji(s.pillar)}</div>
                <div class="vd-verse">"${verseText}"</div>
                <div class="vd-ref">— ${verseRef}</div>
                <div class="vd-kidsline">"${s.kidsLine}"</div>
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }
  if (show.type === "music-videos") {
    // Kids' instrument videos in sequence. Xylophone ends as the closing highlight.
    // video3 removed — looked repetitive.
    const videos = [
      { src: "musicvideo1.mp4", caption: "Our music time" },
      { src: "video2.mp4", caption: "Our music time" },
      { src: "video4.mp4", caption: "Our music time" },
      { src: "video5.mp4", caption: "Our music time" },
      { src: "xylophone-child.mp4", caption: "Xylophone — making music for Jesus" }
    ];
    return renderCarousel(videos, big);
  }
  if (show.type === "song-big") {
    const song = SONGS.find(s => s.title === show.songTitle);
    if (!song) return `<div class="screen-title"><h1>${show.songTitle}</h1></div>`;
    return `
      <div class="song-big-stage ${big ? 'big' : ''}">
        <h2>🎵 ${song.title}</h2>
        <div class="song-big-lyrics">
          ${song.lyrics.map(l => l ? `<div class="big-line">${l}</div>` : `<div class="big-line spacer">&nbsp;</div>`).join("")}
        </div>
        <div class="song-audio-controls">
          <button class="song-play-btn" id="song-play-btn">▶ Play Song (Audio Only)</button>
          <button class="song-stop-btn" id="song-stop-btn" style="display:none;">⏸ Pause</button>
          <audio id="song-audio" src="oh-what-a-miracle.mp4" preload="auto" loop></audio>
        </div>
      </div>
    `;
  }
  if (show.type === "video") {
    // Embedded finished video (e.g. the produced "Oh What a Miracle I Am" film).
    // Captions are baked into the video, so this is the full audience-ready piece.
    return `
      <div class="screen-video ${big ? 'big' : ''}">
        ${show.title ? `<div class="screen-video-title">🎵 ${show.title}</div>` : ""}
        <video src="${show.src}" controls autoplay playsinline preload="metadata"></video>
      </div>`;
  }
  if (show.type === "song-parts-stage") {
    // Visual song-parts cards — one per kid (4 or 6 variant). Audio plays while kids see their part.
    const parts = show.variant === "4-kids" ? SONG_PARTS_4 : SONG_PARTS_6;
    return `
      <div class="song-parts-stage ${big ? 'big' : ''}">
        <h2>🎵 Oh What a Miracle I Am</h2>
        <p class="sps-sub">${show.variant === "4-kids" ? "4-Kid Version · Bridge sung by ALL" : "6-Kid Version · One part per child"}</p>
        <div class="sps-grid sps-${show.variant === "4-kids" ? "four" : "six"}">
          ${parts.map(p => `
            <div class="sps-card ${p.isGroup ? 'sps-group' : ''}" style="border-color: ${p.color}; background: linear-gradient(180deg, #fff, ${p.color}33);">
              <div class="sps-num" style="background: ${p.color};">${p.isGroup ? "ALL" : p.part}</div>
              <div class="sps-emoji">${p.emoji}</div>
              <div class="sps-line">"${p.leadLine}"</div>
              <div class="sps-act">${p.action}</div>
            </div>
          `).join("")}
        </div>
        <div class="sps-audio">
          <button class="sps-play" id="sps-play">▶ Play Song</button>
          <button class="sps-pause" id="sps-pause" style="display:none;">⏸ Pause</button>
          <audio id="sps-audio" src="oh-what-a-miracle.mp3" preload="auto" loop></audio>
        </div>
      </div>
    `;
  }
  if (show.type === "sessions") {
    const photos = show.sessionIds.flatMap(id => {
      const s = SESSIONS.find(x => x.id === id);
      return s ? s.photos.map(p => ({ src: p, caption: s.title })) : [];
    });
    return renderCarousel(photos, big);
  }
  if (show.type === "song") {
    const song = SONGS.find(s => s.title === show.songTitle);
    if (!song) return `<div class="screen-title"><h1>${show.songTitle}</h1></div>`;
    return `<div class="screen-song ${big ? 'big' : ''}">
      <h2>🎵 ${song.title} 🎵</h2>
      <div class="lyrics-big">${song.lyrics.map(l => l ? `<div class="line">${l}</div>` : `<div class="line spacer">&nbsp;</div>`).join("")}</div>
    </div>`;
  }
  if (show.type === "song-with-photos") {
    const song = SONGS.find(s => s.title === show.songTitle);
    const photos = show.sessionIds.flatMap(id => {
      const s = SESSIONS.find(x => x.id === id);
      return s ? s.photos.map(p => ({ src: p, caption: s.title })) : [];
    });
    return `
      <div class="song-with-photos ${big ? 'big' : ''}">
        <div class="swp-song">
          <h2>🎵 ${song ? song.title : show.songTitle}</h2>
          <div class="lyrics-big">${song ? song.lyrics.map(l => l ? `<div class="line">${l}</div>` : `<div class="line spacer">&nbsp;</div>`).join("") : ""}</div>
        </div>
        <div class="swp-photos">${renderCarousel(photos, big)}</div>
      </div>
    `;
  }
  return "";
}

function renderCarousel(photos, big) {
  if (!photos.length) return `<div class="screen-title"><h1>No photos</h1></div>`;
  carouselIndex = Math.min(carouselIndex, photos.length - 1);
  const cur = photos[carouselIndex];
  const isVideo = cur.src.endsWith(".mp4");
  return `
    <div class="carousel ${big ? 'big' : ''}" data-photos='${JSON.stringify(photos).replace(/'/g, "&#39;")}'>
      <button class="car-nav prev" data-car="prev">‹</button>
      ${isVideo
        ? `<video src="${cur.src}" autoplay playsinline controls></video>`
        : `<img src="${cur.src}" alt="" class="kenburns">`}
      <button class="car-nav next" data-car="next">›</button>
      <div class="caption">${cur.caption || ""} &nbsp;•&nbsp; ${carouselIndex + 1}/${photos.length}</div>
    </div>
  `;
}

function onStepRendered() {
  // Auto-pause BGM when entering the actual song slide
  autoPauseBgmForSongSlide();

  // Wire Slide 2 background music ("I Am a Little Lamb Today") — uses global BGM
  document.querySelectorAll(".slide2-music-controls").forEach(box => {
    const playBtn = box.querySelector(".slide2-music-btn");
    const stopBtn = box.querySelector(".slide2-music-stop");
    if (!playBtn) return;

    const showPlay = () => { playBtn.style.display = ""; stopBtn.style.display = "none"; };
    const showStop = () => { playBtn.style.display = "none"; stopBtn.style.display = ""; };

    playBtn.addEventListener("click", () => {
      BGM.play().then(showStop).catch(() => {
        playBtn.textContent = "⚠️ Place i-am-a-little-lamb.mp3 in investiture folder";
      });
    });
    stopBtn.addEventListener("click", () => { BGM.pause(); showPlay(); });
  });

  // Wire song-parts-stage audio (slide 5: visual song parts)
  document.querySelectorAll(".sps-audio").forEach(box => {
    const audio = box.querySelector("audio");
    const playBtn = box.querySelector(".sps-play");
    const pauseBtn = box.querySelector(".sps-pause");
    if (!audio || !playBtn) return;

    const showPlay = () => { playBtn.style.display = ""; pauseBtn.style.display = "none"; };
    const showPause = () => { playBtn.style.display = "none"; pauseBtn.style.display = ""; };

    playBtn.addEventListener("click", () => {
      audio.play().then(showPause).catch(() => {
        playBtn.textContent = "⚠️ Audio missing — drop oh-what-a-miracle.mp3 in folder";
      });
    });
    pauseBtn.addEventListener("click", () => { audio.pause(); showPlay(); });
    audio.addEventListener("ended", showPlay);
  });

  // Wire song audio controls (slide 5: Oh What a Miracle)
  document.querySelectorAll(".song-audio-controls").forEach(box => {
    const audio = box.querySelector("audio");
    const playBtn = box.querySelector(".song-play-btn");
    const stopBtn = box.querySelector(".song-stop-btn");
    if (!audio || !playBtn) return;

    const showPlay = () => { playBtn.style.display = ""; stopBtn.style.display = "none"; };
    const showStop = () => { playBtn.style.display = "none"; stopBtn.style.display = ""; };

    playBtn.addEventListener("click", () => {
      audio.play().then(showStop).catch(() => {
        playBtn.textContent = "⚠️ Audio file missing — drop oh-what-a-miracle.mp3 in folder";
      });
    });
    stopBtn.addEventListener("click", () => { audio.pause(); showPlay(); });
    audio.addEventListener("ended", showPlay);

    // Try autoplay; if blocked or file missing, user clicks the button
    audio.play().then(showStop).catch(() => {});
  });

  // Wire up carousels in both preview and audience layers
  document.querySelectorAll(".carousel").forEach(car => {
    const photos = JSON.parse(car.dataset.photos.replace(/&#39;/g, "'"));
    if (!carouselTimer) startCarousel(photos);

    // When a video finishes, auto-advance to the next item
    car.querySelectorAll("video").forEach(v => {
      v.addEventListener("ended", () => {
        stopCarousel();
        carouselIndex = (carouselIndex + 1) % photos.length;
        refreshScreens();
        startCarousel(photos);
      });
      // Try autoplay; if blocked, do nothing (user can click play)
      const playPromise = v.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
    });

    car.querySelectorAll("[data-car]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        stopCarousel();
        const dir = e.currentTarget.dataset.car === "prev" ? -1 : 1;
        carouselIndex = (carouselIndex + dir + photos.length) % photos.length;
        refreshScreens();
        startCarousel(photos);
      });
    });
  });
}

function refreshScreens() {
  const step = PROGRAM[currentStepIndex];
  const preview = document.getElementById("screen-area");
  if (preview) preview.innerHTML = renderScreen(step.show, false);
  const audience = document.getElementById("audience-screen");
  if (audience) audience.innerHTML = renderScreen(step.show, true);
  // Re-wire carousels (no timer restart) and re-bind video handlers
  document.querySelectorAll(".carousel").forEach(car => {
    const photos = JSON.parse(car.dataset.photos.replace(/&#39;/g, "'"));

    // Re-bind video autoplay + ended-listener after re-render
    car.querySelectorAll("video").forEach(v => {
      v.addEventListener("ended", () => {
        stopCarousel();
        carouselIndex = (carouselIndex + 1) % photos.length;
        refreshScreens();
        startCarousel(photos);
      });
      const playPromise = v.play();
      if (playPromise && playPromise.catch) playPromise.catch(() => {});
    });

    car.querySelectorAll("[data-car]").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        stopCarousel();
        const dir = e.currentTarget.dataset.car === "prev" ? -1 : 1;
        carouselIndex = (carouselIndex + dir + photos.length) % photos.length;
        refreshScreens();
        startCarousel(photos);
      });
    });
  });
}

function startCarousel(photos) {
  stopCarousel();
  if (!photos || photos.length < 2) return;
  // If the current item is a video, do NOT start the timer.
  // The video's "ended" event handler will advance the carousel.
  const current = photos[carouselIndex];
  if (current && current.src && current.src.endsWith(".mp4")) return;
  carouselTimer = setInterval(() => {
    carouselIndex = (carouselIndex + 1) % photos.length;
    refreshScreens();
  }, 4500);
}
function stopCarousel() {
  if (carouselTimer) { clearInterval(carouselTimer); carouselTimer = null; }
}

// ---------- Step navigation ----------
function goToStep(i) {
  if (i < 0 || i >= PROGRAM.length) return;
  currentStepIndex = i;
  carouselIndex = 0;
  stopCarousel();
  render();
}
function nextStep() { goToStep(currentStepIndex + 1); }
function prevStep() { goToStep(currentStepIndex - 1); }

// ---------- Step timer ----------
function toggleStepTimer() {
  if (stepTimerInterval) {
    clearInterval(stepTimerInterval);
    stepTimerInterval = null;
  } else {
    stepTimerInterval = setInterval(() => {
      stepTimerSec++;
      const el = document.getElementById("step-timer");
      if (el) el.textContent = formatTime(stepTimerSec);
      const step = PROGRAM[currentStepIndex];
      if (step && stepTimerSec >= step.durationSec) {
        if (currentStepIndex < PROGRAM.length - 1) {
          stepTimerSec = 0;
          nextStep();
        } else {
          clearInterval(stepTimerInterval);
          stepTimerInterval = null;
        }
      }
    }, 1000);
  }
  const btn = document.getElementById("timer-toggle");
  if (btn) btn.textContent = stepTimerInterval ? "⏸ Pause" : "▶ Start";
}
function resetStepTimer() {
  if (stepTimerInterval) { clearInterval(stepTimerInterval); stepTimerInterval = null; }
  stepTimerSec = 0;
  const el = document.getElementById("step-timer");
  if (el) el.textContent = formatTime(stepTimerSec);
  const btn = document.getElementById("timer-toggle");
  if (btn) btn.textContent = "▶ Start";
}

// ---------- Audience view (fullscreen, no script) ----------
function openAudience() {
  audienceMode = true;
  renderAudience();
  // Try fullscreen
  const el = document.getElementById("audience-overlay");
  if (el && el.requestFullscreen) el.requestFullscreen().catch(() => {});
}
function closeAudience() {
  audienceMode = false;
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  const el = document.getElementById("audience-overlay");
  if (el) el.classList.remove("active");
}
function renderAudience() {
  const step = PROGRAM[currentStepIndex];
  const overlay = document.getElementById("audience-overlay");
  const sparkleHtml = Array.from({length: 8}).map(() => {
    const left = Math.random() * 90 + 5;
    const top = Math.random() * 90 + 5;
    const delay = Math.random() * 4;
    const sym = Math.random() > 0.5 ? "✨" : "⭐";
    return `<div class="bg-sparkle" style="left:${left}%; top:${top}%; animation-delay:${delay}s;">${sym}</div>`;
  }).join("");
  overlay.innerHTML = `
    <div class="audience-bg"></div>
    ${sparkleHtml}
    <div class="audience-step-badge">Step ${currentStepIndex + 1} / ${PROGRAM.length}</div>
    <button class="audience-close" id="audience-close" title="Exit (Esc)">✕</button>
    <button class="audience-nav prev" id="audience-prev" title="Previous (←)">‹</button>
    <button class="audience-nav next" id="audience-next" title="Next (→)">›</button>
    <div class="audience-screen" id="audience-screen">
      ${renderScreen(step.show, true)}
    </div>
  `;
  overlay.classList.add("active");
  document.getElementById("audience-close").addEventListener("click", closeAudience);
  document.getElementById("audience-prev").addEventListener("click", () => { prevStep(); });
  document.getElementById("audience-next").addEventListener("click", () => { nextStep(); });
  // wire carousels in audience layer
  onStepRendered();
}

// ---------- Handlers ----------
function attachHandlers() {
  document.querySelectorAll("[data-view]").forEach(el => {
    el.addEventListener("click", e => setView(e.currentTarget.dataset.view));
  });
  document.querySelectorAll("[data-pillar]").forEach(el => {
    el.addEventListener("click", e => {
      const name = e.currentTarget.dataset.pillar;
      const p = PILLARS.find(x => x.name === name);
      if (p && p.sessions[0]) setView("session", p.sessions[0]);
    });
  });
  document.querySelectorAll("[data-session]").forEach(el => {
    el.addEventListener("click", e => setView("session", e.currentTarget.dataset.session));
  });
  document.querySelectorAll(".gallery .photo").forEach((el, i) => {
    el.addEventListener("click", () => {
      const session = SESSIONS.find(s => s.id === currentSessionId);
      lightboxList = session ? session.photos : [];
      lightboxIndex = parseInt(el.dataset.index, 10);
      showLightbox();
    });
  });
  document.querySelectorAll(".sheet-thumb").forEach((el, i) => {
    el.addEventListener("click", () => {
      lightboxList = Array.from(document.querySelectorAll(".sheet-thumb")).map(t => t.dataset.sheet);
      lightboxIndex = i;
      showLightbox();
    });
  });

  // Program controls
  const next = document.getElementById("next-step");
  const prev = document.getElementById("prev-step");
  const tog = document.getElementById("timer-toggle");
  const rst = document.getElementById("timer-reset");
  const kid = document.getElementById("kid-actions-toggle");
  const aud = document.getElementById("audience-btn");
  if (next) next.addEventListener("click", nextStep);
  if (prev) prev.addEventListener("click", prevStep);
  if (tog) tog.addEventListener("click", toggleStepTimer);
  if (rst) rst.addEventListener("click", resetStepTimer);
  if (kid) kid.addEventListener("change", e => {
    showKidActions = e.target.checked;
    render();
  });
  if (aud) aud.addEventListener("click", openAudience);
  document.querySelectorAll(".step-link").forEach(el => {
    el.addEventListener("click", e => goToStep(parseInt(e.currentTarget.dataset.step, 10)));
  });
}

// ---------- Lightbox ----------
function showLightbox() {
  const lb = document.getElementById("lightbox");
  const content = document.getElementById("lightbox-content");
  const src = lightboxList[lightboxIndex];
  if (!src) return;
  if (src.endsWith(".mp4")) {
    content.innerHTML = `<video src="${src}" controls autoplay></video>`;
  } else {
    content.innerHTML = `<img src="${src}" alt="Photo">`;
  }
  lb.classList.add("active");
}
function hideLightbox() {
  document.getElementById("lightbox").classList.remove("active");
  document.getElementById("lightbox-content").innerHTML = "";
}
function lightboxNext(dir) {
  if (!lightboxList.length) return;
  lightboxIndex = (lightboxIndex + dir + lightboxList.length) % lightboxList.length;
  showLightbox();
}

// ---------- Keyboard ----------
document.addEventListener("keydown", e => {
  const lb = document.getElementById("lightbox");
  if (lb.classList.contains("active")) {
    if (e.key === "Escape") hideLightbox();
    else if (e.key === "ArrowLeft") lightboxNext(-1);
    else if (e.key === "ArrowRight") lightboxNext(1);
    return;
  }
  if (audienceMode) {
    if (e.key === "Escape") closeAudience();
    else if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") { e.preventDefault(); nextStep(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") prevStep();
    return;
  }
  if (currentView === "program") {
    if (e.key.toLowerCase() === "f") openAudience();
    else if (e.key === "ArrowRight" || e.key === "PageDown") nextStep();
    else if (e.key === "ArrowLeft" || e.key === "PageUp") prevStep();
    else if (e.key === " ") { e.preventDefault(); toggleStepTimer(); }
  }
});

// Exit fullscreen handler
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && audienceMode) {
    audienceMode = false;
    const el = document.getElementById("audience-overlay");
    if (el) el.classList.remove("active");
  }
});

// ---------- Init ----------
function init() {
  document.getElementById("lightbox-close").addEventListener("click", hideLightbox);
  document.getElementById("lightbox-prev").addEventListener("click", () => lightboxNext(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => lightboxNext(1));
  document.getElementById("lightbox").addEventListener("click", e => {
    if (e.target.id === "lightbox") hideLightbox();
  });
  for (let i = 0; i < 4; i++) {
    const s = document.createElement("div");
    s.className = "sheep-float";
    s.textContent = i % 2 === 0 ? "🐑" : "⭐";
    s.style.left = (Math.random() * 90 + 5) + "%";
    s.style.top = (Math.random() * 90 + 5) + "%";
    s.style.animationDelay = (Math.random() * 5) + "s";
    document.body.appendChild(s);
  }
  // Initialize global BGM widget (hidden until music plays)
  BGM.init();
  renderBgmWidget();
  render();
  // On the published/standalone build (body[data-autoaudience]), open straight into
  // the big audience view. Press Esc (or the ✕ button) to drop back to the control pages.
  if (document.body.dataset.autoaudience) openAudience();
}
document.addEventListener("DOMContentLoaded", init);
