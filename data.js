// Little Lamb 2025-2026 — Year content & Program data
// Edit this file to change photos, scripts, timings, or songs.

// Self-contained standalone build: all media is bundled inside this folder.
const F1 = "p1/";
const F2 = "p2/";
const F3 = "p3/";
const FM = "pm/";
const LF = "./";

const SESSIONS = [
  {
    id: "s1",
    date: "November 1, 2025",
    title: "I Am a Little Lamb",
    pillar: "My God",
    pillarColor: "#7ec4ff",
    activity: "Paper-plate sheep craft with cotton balls",
    verse: "The Lord is my Shepherd. — Psalm 23:1",
    child: "Raphael",
    verseClip: "verse-clips/raphael.mp4",
    kidsLine: "Jesus is my Shepherd!",
    photos: [
      F3 + "20251101_162050.jpg",
      F3 + "20251101_162110.jpg",
      F3 + "20251101_162145.jpg",
      F3 + "20251101_162207.jpg",
      F3 + "20251101_162234.jpg",
      F3 + "20251101_162242.jpg"
    ]
  },
  {
    id: "s2",
    date: "November 15, 2025",
    title: "Following the Shepherd",
    pillar: "My God",
    pillarColor: "#7ec4ff",
    activity: "Sheep coloring & sticker activity",
    verse: "I know my sheep and they know me. — John 10:14",
    kidsLine: "I follow Jesus!",
    photos: [
      F3 + "20251115_161614.jpg",
      F3 + "20251115_161836.jpg",
      F3 + "20251115_161919.jpg",
      F3 + "20251115_162001.jpg",
      F3 + "20251115_162032.jpg"
    ]
  },
  {
    id: "s3",
    date: "January 10, 2026",
    title: "God Loves Me",
    pillar: "My God",
    pillarColor: "#7ec4ff",
    activity: "'GOD LOVES ME' stone mosaic on canvas",
    verse: "See what great love the Father has given us. — 1 John 3:1",
    kidsLine: "God loves me!",
    photos: [
      F3 + "20260110_160714.jpg",
      F3 + "20260110_161606.jpg",
      F3 + "20260110_161613.jpg",
      F3 + "20260110_161640.jpg"
    ]
  },
  {
    id: "s4",
    date: "January 24, 2026",
    title: "I Am Special",
    pillar: "Myself",
    pillarColor: "#ffb84d",
    activity: "Paper-bag dolls with yarn hair & sequin faces",
    verse: "I am wonderfully made. — Psalm 139:14",
    child: "Aleiah",
    verseClip: "verse-clips/aleiah.mp4",
    kidsLine: "God made me special!",
    photos: [
      F2 + "20260124_155948.jpg",
      F2 + "20260124_161155.jpg",
      F2 + "20260124_161941.jpg",
      F2 + "20260124_164617.jpg",
      F2 + "20260124_165204.jpg"
    ]
  },
  {
    id: "s5",
    date: "February 7, 2026",
    title: "Bread of Life",
    pillar: "My Family",
    pillarColor: "#ff8fa3",
    activity: "Hands-on dough making — kneading together",
    verse: "I am the bread of life. — John 6:35",
    child: "Amy Reyna",
    verseClip: "verse-clips/amy-reyna.mp4",
    kidsLine: "We share like a family!",
    photos: [
      F2 + "20260207_155511.jpg",
      F2 + "20260207_155512.jpg",
      F2 + "20260207_155542.jpg",
      F2 + "20260207_155636.jpg"
    ]
  },
  {
    id: "s6",
    date: "March 7, 2026",
    title: "Bible Friends",
    pillar: "My God",
    pillarColor: "#7ec4ff",
    activity: "Bubble science + paper-doll Bible characters",
    verse: "Love one another. — John 13:34",
    child: "Bernice",
    verseClip: "verse-clips/bernice.mp4",
    kidsLine: "I have Bible friends!",
    photos: [
      F1 + "20260307_155243.jpg",
      F1 + "20260307_163758.jpg",
      F1 + "20260307_164734.jpg",
      F1 + "20260307_164811.jpg"
    ]
  },
  {
    id: "s7",
    date: "April 4, 2026",
    title: "Wonder of Creation",
    pillar: "My World",
    pillarColor: "#a78bfa",
    activity: "Star craft — God made the sky",
    verse: "He made the stars. — Genesis 1:16",
    child: "Daris",
    verseClip: "verse-clips/daris.mp4",
    kidsLine: "God made the stars!",
    photos: [
      F1 + "20260404_160359.jpg",   // NEW — colorful stars on the black board
      F1 + "20260404_165333.jpg",   // NEW — star activity at the table
      F1 + "20260404_154300.jpg",
      F1 + "20260404_154334.jpg",
      F1 + "20260404_155311.jpg",
      F1 + "20260404_155318.jpg"
    ]
  },
  {
    id: "s8",
    date: "April 18, 2026",
    title: "Community Helpers",
    pillar: "My Family",
    pillarColor: "#ff8fa3",
    activity: "Learning about firefighters, doctors, police, teachers",
    verse: "Be kind to one another. — Ephesians 4:32",
    child: "Elizabeth",
    verseClip: "verse-clips/elizabeth.mp4",
    kidsLine: "I help my community!",
    photos: [
      FM + "20260418_163232.jpg",   // NEW — the kids holding up their Community Helpers signs
      FM + "20260418_162936.jpg",
      FM + "20260418_163005.jpg",
      FM + "20260418_163007.jpg",
      FM + "20260418_163039.jpg",
      FM + "20260418_163126.jpg"
    ]
  },
  {
    id: "s9",
    date: "May 30, 2026",
    title: "Musical Me — Praising God with Music",
    pillar: "My God",
    pillarColor: "#7ec4ff",
    activity: "Met 5 instruments (guitar, keyboard, xylophone, tambourine, shaker) and played along to Bible songs",
    verse: "Make a joyful noise unto the Lord. — Psalm 100:1",
    kidsLine: "We praise God with music!",
    photos: [
      LF + "musicvideo1.mp4",
      LF + "video2.mp4",
      LF + "video3.mp4",
      LF + "video4.mp4",
      LF + "video5.mp4",
      LF + "xylophone-child.mp4",
      LF + "music1.jpeg",
      LF + "music2.jpeg",
      LF + "music3.jpeg",
      LF + "plant1.jpeg",
      LF + "plant2.jpeg"
    ]
  }
];

const PILLARS = [
  { name: "My God",    color: "#7ec4ff", emoji: "🐑", tagline: "Jesus is my Shepherd",     sessions: ["s1","s2","s3","s6","s9"] },
  { name: "Myself",    color: "#ffb84d", emoji: "✨", tagline: "I am wonderfully made",    sessions: ["s4"] },
  { name: "My World",  color: "#a78bfa", emoji: "⭐", tagline: "God made everything",      sessions: ["s7"] },
  { name: "My Family", color: "#ff8fa3", emoji: "❤️", tagline: "We love and we share",     sessions: ["s5","s8"] }
];

// SONG_PARTS_6 — 6-kid version. Each kid has a solo line; everyone joins on choruses + "Oh what a miracle I am!"
const SONG_PARTS_6 = [
  { part: 1, leadLine: "I have hands! Watch me clap!",          action: "Hold hands up, then clap loudly twice",       note: "Most confident kid — sets the energy",     emoji: "👏", color: "#7ec4ff" },
  { part: 2, leadLine: "I have feet! Watch me stand!",          action: "Stamp feet, stand up tall and proud",          note: "Good for a kid who likes being on stage",   emoji: "🦶", color: "#ffb84d" },
  { part: 3, leadLine: "I have arms! Watch me swing!",          action: "Swing both arms big from side to side",        note: "Wiggly kid who loves to move",              emoji: "💃", color: "#a78bfa" },
  { part: 4, leadLine: "I have one foot! Watch me balance!",    action: "Stand on one foot, arms out for balance",      note: "Kid who likes a challenge",                  emoji: "🤸", color: "#ff8fa3" },
  { part: 5, leadLine: "I am something special, so very special!", action: "Hands on heart, big smile, look at audience", note: "Sweet, expressive kid",                  emoji: "💖", color: "#fcd34d" },
  { part: 6, leadLine: "There is nobody quite like me!",        action: "Point to self with both thumbs, twirl once",   note: "Perfect closer — a kid who beams with joy", emoji: "🌟", color: "#86efac" }
];

// SONG_PARTS_4 — 4-kid version (in case some kids absent).
// All 4 kids sing the bridge "I am something special / There is nobody quite like me" TOGETHER.
const SONG_PARTS_4 = [
  { part: 1, leadLine: "I have hands! Watch me clap!",          action: "Hold hands up, then clap loudly twice",        note: "Most confident kid — sets the energy",       emoji: "👏", color: "#7ec4ff" },
  { part: 2, leadLine: "I have feet! Watch me stand!",          action: "Stamp feet, stand up tall and proud",          note: "Good for a kid who likes being on stage",     emoji: "🦶", color: "#ffb84d" },
  { part: 3, leadLine: "I have arms! Watch me swing!",          action: "Swing both arms big from side to side",        note: "Wiggly kid who loves to move",                emoji: "💃", color: "#a78bfa" },
  { part: 4, leadLine: "I have one foot! Watch me balance!",    action: "Stand on one foot, arms out for balance",      note: "Kid who likes a challenge",                   emoji: "🤸", color: "#ff8fa3" },
  { part: "ALL", leadLine: "I am something special, so very special — there is nobody quite like me!", action: "All 4 kids together: hands on heart → point to self → twirl", note: "Everyone sings the bridge as a group — twice in the song", emoji: "🌟", color: "#fcd34d", isGroup: true }
];

// Default = 6-kid version; flip variable below to "4-kids" if some are absent today.
const SONG_PARTS = SONG_PARTS_6;

const SONGS = [
  {
    title: "Jesus Loves Me",
    lyrics: [
      "Jesus loves me, this I know,",
      "For the Bible tells me so.",
      "Little ones to Him belong,",
      "They are weak, but He is strong.",
      "",
      "Yes, Jesus loves me!",
      "Yes, Jesus loves me!",
      "Yes, Jesus loves me!",
      "The Bible tells me so."
    ]
  },
  {
    title: "Oh What a Miracle I Am",
    // Real lyrics from the kids' practice video "What A Miracle (Pre-dance Saturday)".
    // Each "(2x)" means the line repeats.
    lyrics: [
      "I have hands, I have hands",
      "Watch me clap, watch me clap",
      "Oh, what a miracle I am!",
      "",
      "I have feet, I have feet",
      "Watch me stand, watch me stand",
      "Oh, what a miracle I am!",
      "",
      "Oh, what a miracle, oh, what a miracle,",
      "Every little part of me",
      "I am something special, so very special,",
      "There is nobody quite like me",
      "",
      "I have arms, I have arms",
      "Watch me swing, watch me swing",
      "Oh, what a miracle I am!",
      "",
      "I have one foot, I have one foot",
      "Watch me balance, watch me balance",
      "Oh, what a miracle I am!",
      "",
      "Oh, what a miracle, oh, what a miracle,",
      "Every little part of me",
      "I am something special, so very special,",
      "There is nobody quite like me",
      "",
      "There is nobody quite like me!"
    ]
  },
  {
    title: "Twinkle Twinkle Little Star",
    lyrics: [
      "Twinkle, twinkle, little star,",
      "How I wonder what you are.",
      "Up above the world so high,",
      "Like a diamond in the sky.",
      "Twinkle, twinkle, little star,",
      "How I wonder what you are."
    ]
  },
  {
    title: "This Little Light of Mine",
    lyrics: [
      "This little light of mine,",
      "I'm gonna let it shine!",
      "This little light of mine,",
      "I'm gonna let it shine!",
      "Let it shine, let it shine, let it shine!"
    ]
  }
];

// PROGRAM = Investiture run-of-show. Short version — only a few minutes.
// Audience: pastors, staff, parents, church members.
// Goal: show what we did → kids recite verses → kids sing "Oh What a Miracle I Am" with motions.
// The song is the ONLY song; lyrics are displayed BIG so kids can act and audience can read along.
const PROGRAM = [
  {
    id: 1,
    time: "0:00",
    durationSec: 60,
    title: "Welcome & Opening Prayer",
    who: "Director / Teacher",
    script: "Pastor, staff, parents, church family — welcome to the Little Lamb Investiture. Thank you for being here to celebrate these precious children. Let us begin with prayer. (Pray.)",
    kidsAction: "Children stand quietly in two rows behind the teacher, hands folded.",
    show: { type: "title", title: "Little Lamb Investiture", subtitle: "Class of 2025–2026 · A Year With Jesus" }
  },
  {
    id: 2,
    time: "1:00",
    durationSec: 180,
    title: "Our Year Together (Slideshow)",
    who: "Auto-play slideshow",
    script: "Take a look at the year we shared. Sheep crafts, stone canvases, bread we kneaded together, stars we colored, paper-bag dolls, helpers in our community, plants we cared for, and our music meeting just last week.",
    kidsAction: "Children sit in front row and watch the slideshow with their parents.",
    show: { type: "year-photos-combined" }
  },
  {
    id: 3,
    time: "4:00",
    durationSec: 150,
    title: "Some Things We Learned — Verses (One Per Child)",
    who: "Children recite one by one",
    script: "These children hid God's Word in their hearts this year. Let them share what they learned. Each child has one short verse.",
    kidsAction: "Each of the 6 children steps forward in turn and says their assigned verse (shown on screen). Audience applauds after each child.",
    // 6 EASIEST verses — one per child. Assign at tomorrow's class.
    show: { type: "verses-display", sessionIds: ["s6","s4","s7","s1","s8","s5"] }
  },
  {
    id: 4,
    time: "6:30",
    durationSec: 180,
    title: "🎼 Our Music — Playing Instruments for Jesus",
    who: "Music videos play · Children watch with audience",
    script: "Our Little Lambs learned five instruments this year — guitar, keyboard, xylophone, tambourine, and shaker. Watch them play.",
    kidsAction: "Children sit and watch the videos with the audience. When the videos end, they stand quietly, ready to sing.",
    show: { type: "music-videos" }
  },
  {
    id: 5,
    time: "9:30",
    durationSec: 180,
    title: "🎵 Oh What a Miracle I Am — The Song",
    who: "All children sing — each kid leads their part",
    script: "Our featured song. Each child has a moment to lead a line; everyone joins on the choruses. Watch the actions — clap, stand, swing, balance, point.",
    kidsAction: "Each child steps forward when their part comes up, does the action, sings their line. All join on 'Oh what a miracle I am!' and on choruses.",
    show: { type: "video", src: "oh-what-a-miracle-final.mp4", title: "Oh What a Miracle I Am" }
  },
  {
    id: 6,
    time: "12:30",
    durationSec: 60,
    title: "Hand Off to Director",
    who: "Teacher → Director",
    script: "Thank you parents, thank you church family. I now hand the program to our Director for the investiture of these Little Lambs.",
    kidsAction: "Children line up in order to receive their pins and certificates.",
    show: { type: "title", title: "Investiture Ceremony 🌟", subtitle: "Class of 2025–2026" }
  }
];
