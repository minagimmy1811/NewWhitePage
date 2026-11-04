/* =========================================================
   SETTINGS — how Maria's answers reach you
   ========================================================= */
const CONFIG = {
    // Your WhatsApp number: country code + number, no "+" or spaces.
    // Used for the "Send my answers to him" button on the last page (always works).
    whatsappNumber: "201064124272",

    // LIVE notifications on your phone, answer by answer (free, no account):
    // install the "ntfy" app (Android / iPhone) and subscribe to this exact topic name.
    // Anyone who knows the topic name can read it, so keep it to yourself.
    ntfyTopic: "maria-newpage-fef74f3e82fe",

    // OPTIONAL: automatic WhatsApp message to you, without her pressing anything.
    // Get a free key from CallMeBot (see README.md) and paste it here.
    callmebotApiKey: "",
};

/* =========================================================
   Helpers
   ========================================================= */
const $ = (id) => document.getElementById(id);
const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const MET_ON = new Date(2023, 6, 23); // 23 July 2023
const daysSince = (d) => Math.floor((Date.now() - d.getTime()) / 86400000);
const BROKE_UP = new Date(2024, 4, 10); // 10 May 2024
function sinceBreakup() {
    const now = new Date();
    let months = (now.getFullYear() - BROKE_UP.getFullYear()) * 12 + now.getMonth() - BROKE_UP.getMonth();
    if (now.getDate() < BROKE_UP.getDate()) months--;
    const y = Math.floor(months / 12);
    const m = months % 12;
    const part = (n, w) => n + " " + w + (n === 1 ? "" : "s");
    return y && m ? part(y, "year") + " and " + part(m, "month") : y ? part(y, "year") : part(m, "month");
}

const card = $("card");
const mascot = $("mascot");
const bubble = $("bubble");
const questionEl = $("question");
const subtitleEl = $("subtitle");
const extraEl = $("extra");
const buttons = $("buttons");
const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const reaction = $("reaction");
const reactionText = $("reactionText");
const nextBtn = $("nextBtn");

/* ---------- things the NO button says while it runs away ---------- */
const pleas = [
    "Are you sure? 🥺",
    "Really sure??",
    "Think again! 🤔",
    "Last chance!",
    "Surely not? 😳",
    "You might regret this!",
    "Have a heart! 💔",
    "Don't be so cold 🥶",
    "Is that your final answer?",
    "You're breaking my heart 😭",
    "Wrong button 😏",
    "Try the green one 👉",
];

const dodgeBubbles = ["Hehe 😜", "Too slow 🐢", "Nope! 🙅‍♀️", "Catch me if you can 🏃‍♀️", "Almost 😂", "Not today 😎", "Missed! 🎯"];

/* =========================================================
   The stages
   q      : the question (typed out)
   sub    : small text under it (can contain HTML)
   yes/no : what appears after she answers
   party  : "yes" | "no" | "both" -> confetti on that answer
   extra  : function that draws something extra on the page
   onAnswer: special effect after answering
   ========================================================= */
const stages = [
    {
        label: "Stage 0 · Warm up",
        verse: { text: "I thank my God upon every remembrance of you.", ref: "Philippians 1:3" },
        mascot: "💌",
        q: "Hi Maria! Someone built a whole website just for you. Wanna see it?",
        sub: "Every page has only two buttons. Choose wisely 😌",
        yes: "Good choice! Fasten your seatbelt, this is going to be a ride 🎢",
        no: "You found the NO button… but you're already here, so let's go anyway 😂",
        party: "yes",
    },
    {
        label: "Stage 1 · The beginning",
        verse: { text: "…yet I will not forget you. See, I have inscribed you on the palms of My hands.", ref: "Isaiah 49:15–16" },
        mascot: "👀",
        q: "Do you remember the 23rd of July 2023?",
        sub: "Hint: two people met and had no idea what was coming.",
        extra: (el) => {
            el.innerHTML = '<div class="counter" id="counter">0</div><div class="counter-label">days since that day — and I remember it</div>';
            countUp($("counter"), daysSince(MET_ON));
        },
        yes: "The day we first met! 23/7/2023. I still remember it like it was yesterday 🗓️",
        no: "Wow. I remember it and you don't?! 23/7/2023 — the day we met. Write it down 📝",
        party: "yes",
    },
    {
        label: "Stage 2 · First message",
        verse: { text: "Let me see your face, let me hear your voice; for your voice is sweet, and your face is lovely.", ref: "Song of Songs 2:14" },
        mascot: "💬",
        q: "10th of September 2023… does that ring a bell?",
        sub: "Not your birthday. That was 6 days earlier 😉",
        yes: "Yep! The day we started talking. Who knew a few texts would turn into all of that 📱✨",
        no: "That's the day we started talking! I remember, so you're officially losing this game 😎",
    },
    {
        label: "Stage 3 · Hangout #1",
        verse: { text: "Two are better than one, because they have a good reward for their labor.", ref: "Ecclesiastes 4:9" },
        mascot: "🚶‍♀️",
        q: "Do you remember the first time we hung out?",
        sub: "I'll give you a second… ⏳",
        yes: "29th of September 2023! See? I didn't even need a calendar 🧠",
        no: "29th of September 2023. Our very first hangout. Don't worry, I've got the memory for both of us 💾",
    },
    {
        label: "Stage 4 · Hangout #2",
        verse: { text: "For wherever you go, I will go; and wherever you lodge, I will lodge.", ref: "Ruth 1:16" },
        mascot: "✌️",
        q: "And the second time? Bet you don't know this one.",
        sub: "Wait… you don't even like hanging out much. So it must've been worth it 😏",
        yes: "7th of October 2023! Two hangouts — from YOU?! That's basically a world record 🏆",
        no: "7th of October 2023! Two hangouts from someone who hates going out. Clearly I was special 😌",
    },
    {
        label: "Stage 5 · Official",
        verse: { text: "I am my beloved's, and my beloved is mine.", ref: "Song of Songs 6:3" },
        mascot: "💘",
        q: "13th of October 2023. You know what happened, right?",
        sub: "The day the status changed 👀",
        yes: "We started dating! 13/10/2023 — the main episode 💕",
        no: "We started DATING, Maria! 13/10/2023! How do you forget the main episode?! 😂",
        party: "yes",
        onAnswer: () => heartRain(40),
    },
    {
        label: "Stage 6 · First date",
        verse: { text: "He brought me to the banqueting house, and his banner over me was love.", ref: "Song of Songs 2:4" },
        mascot: "🍽️",
        q: "Do you remember our first time going out as a couple?",
        sub: "It was literally the next day. Someone was excited 🙈",
        yes: "14th of October 2023! One day after it became official. No time was wasted 😂",
        no: "14th of October 2023 — the very next day! I remember, so you owe me a point 🎯",
    },
    {
        label: "Stage 7 · Important date",
        verse: { text: "This is the day the LORD has made; we will rejoice and be glad in it.", ref: "Psalm 118:24" },
        mascot: "🎂",
        q: "Do you think I remember your birthday?",
        sub: "Careful… this is a test of MY memory, not yours.",
        extra: (el) => {
            el.innerHTML = '<div class="cake" id="cake"><span class="flame">🔥</span><span class="flame">🔥</span><span class="flame">🔥</span>🎂</div>';
        },
        yes: "Of course I do — the 4th of September! 🎉 Make a wish, I just blew the candles for you 🕯️",
        no: "Excuse me?! The 4th of September! I would NEVER forget it 😤🎂",
        party: "both",
        onAnswer: () => { const c = $("cake"); if (c) c.classList.add("blown"); },
    },
    {
        label: "Stage 8 · Cartoon quiz",
        verse: { text: "A faithful friend is a strong defence: and he that hath found such an one hath found a treasure.", ref: "Sirach 6:14" },
        mascot: "🐶",
        q: "Is Scooby Doo still the best show in the world?",
        sub: "Zoinks! Think carefully…",
        yes: "Scooby-Dooby-Doo! 🐾 Scooby Doo, Meet the Robinsons and Aladdin — your top 3. Told you I remember.",
        no: "Ruh-roh! 😱 Then is it Meet the Robinsons? Or Aladdin? Either way, I know your top 3 by heart 📺",
        party: "yes",
    },
    {
        label: "Stage 9 · Movie night",
        verse: { text: "Rise up, my love, my fair one, and come away.", ref: "Song of Songs 2:10" },
        mascot: "🧞",
        q: "Movie night: Meet the Robinsons first, then Aladdin. Deal?",
        sub: "Popcorn included. Talking during the movie is not 🤫",
        yes: "Deal! \"Keep moving forward\" — remember that line, it's coming back later 👀 And then a whole new world 🧞‍♂️",
        no: "Aladdin! 🧞‍♂️ If I found a magic lamp, one wish would be getting this exact answer 😄",
        party: "both",
    },
    {
        type: "game",
        label: "Stage 10 · Mini game",
        verse: { text: "Better is a dinner of herbs where love is, than a fatted calf with hatred.", ref: "Proverbs 15:17" },
        mascot: "🍗",
        q: "Feed Maria! Catch 6 snacks 🍗🧸🥫",
        sub: "Tap the food before it falls. But DON'T touch the mint 🌿 — I know you hate it.",
    },
    {
        label: "Stage 11 · A little snack",
        verse: { text: "Oh, taste and see that the LORD is good.", ref: "Psalm 34:8" },
        mascot: "🍬",
        q: "Speaking of mint… you still hate mint gum, right?",
        sub: "Fresh breath, cool vibes… disgusting 🤢",
        yes: "Correct! Mint gum = disgusting. Have some gummy bears instead 🧸 I know you love them.",
        no: "WHO ARE YOU AND WHAT HAVE YOU DONE WITH MARIA?! 🚨",
        party: "yes",
    },
    {
        label: "Stage 12 · Weekend plans",
        verse: { text: "…that you also aspire to lead a quiet life…", ref: "1 Thessalonians 4:11" },
        mascot: "🎉",
        q: "Staying home > a huge party with 200 strangers. Agreed?",
        sub: "Small talk, loud music, meeting new people… no thanks 😂",
        yes: "Exactly what I expected 😂 You don't like being social or going out too much. I KNOW you.",
        no: "Liar 😂",
        party: "yes",
    },
    {
        label: "Stage 13 · Chores",
        verse: { text: "Bear one another's burdens, and so fulfill the law of Christ.", ref: "Galatians 6:2" },
        mascot: "🧽",
        q: "47 dirty plates after dinner 🍽️ Should I wash them for you?",
        sub: "Because we both know you're not touching them 😂",
        yes: "Of course 😂 You hate washing the dishes. Noted since forever. I'll do it 🧽",
        no: "Hold on, let me call a doctor 🚑",
        party: "yes",
    },
    {
        label: "Stage 14 · Gift time",
        verse: { text: "You have ravished my heart with one look of your eyes, with one link of your necklace.", ref: "Song of Songs 4:9" },
        mascot: "💍",
        q: "I got you earrings… just kidding 😂 Should I swap them for a bracelet?",
        sub: "Sparkly, shiny, and NOT in your ears ✨",
        yes: "Knew it! You don't like wearing earrings — bracelets all the way. Told you I remember 📿",
        no: "Gotcha 😂",
        party: "yes",
    },
    {
        label: "Stage 15 · The real gift",
        verse: { text: "Let all that you do be done with love.", ref: "1 Corinthians 16:14" },
        mascot: "🧦",
        q: "Okay, real gift: socks with cartoon characters on them. Yes?",
        sub: "Imagine Scooby Doo on your feet 🐶🧦",
        yes: "I knew it! Cartoon socks are the way to your heart 🧦❤️",
        no: "Lies! You love cartoon socks. I'm wrapping them anyway 🎁🧦",
        party: "yes",
    },
    {
        label: "Stage 16 · Laptop decoration",
        verse: { text: "But above all these things put on love, which is the bond of perfection.", ref: "Colossians 3:14" },
        mascot: "💻",
        q: "Does your laptop need one more sticker?",
        sub: "There's always room for one more…",
        yes: "Obviously! A laptop without stickers is just a sad grey rectangle 😂",
        no: "Suspicious 🤨 You love laptop stickers. Is there just no space left? 😂",
        party: "yes",
    },
    {
        label: "Stage 17 · Food",
        verse: { text: "Go, eat your bread with joy.", ref: "Ecclesiastes 9:7" },
        mascot: "😋",
        q: "Are you hungry right now?",
        sub: "Before you answer: you love food so much, the answer is always the same 😂",
        yes: "Of course you are 😂 Chicken? Gummy bears? Red Bull on the side? Your order is ready 🍗🧸🥫",
        no: "I don't believe you. You're ALWAYS hungry 😂 Chicken is on its way 🍗",
        party: "yes",
    },
    {
        label: "Stage 18 · Energy check",
        verse: { text: "But those who wait on the LORD shall renew their strength; they shall mount up with wings like eagles.", ref: "Isaiah 40:31" },
        mascot: "⚡",
        q: "Need a Red Bull to survive the rest of this website?",
        sub: "It gives you wiiiings 🪽",
        yes: "Here you go 🥫⚡ One cold Red Bull… and there it flies 🪽",
        no: "Saving it for later, smart. Still, I know it's your favorite 🥫",
        onAnswer: (choice) => { if (choice === "YES") flyAway("🥫"); },
    },
    {
        label: "Stage 19 · Photo time",
        verse: { text: "Behold, you are fair, my love! Behold, you are fair! You have dove's eyes.", ref: "Song of Songs 1:15" },
        mascot: "📸",
        q: "Can I take a normal, nice, pretty picture of you?",
        sub: "3… 2… 1… smile 😊",
        yes: "Normal?! 😂 We both know you'd make a weird face. Then you'd take a close-up of MY eyes 👁️👁️",
        no: "Right, normal pictures are boring. Weirdo pictures only 🤪 — and close-ups of people's eyes 👁️",
        onAnswer: () => { cameraFlash(); setMascot("👁️👁️", "shock"); },
    },
    {
        type: "loading",
        label: "Stage 20 · Processing",
        verse: { text: "Many waters cannot quench love, nor can the floods drown it.", ref: "Song of Songs 8:7" },
        mascot: "🧠",
        q: "Loading every single detail about Maria…",
        sub: "",
        lines: [
            "Remembering 23/07/2023 — the day we met",
            "Remembering 10/09/2023 — the first messages",
            "Replaying 29/09 and 07/10 — two whole hangouts",
            "Saving 13/10/2023 and 14/10/2023 forever",
            "Lighting candles for the 4th of September",
            "Restocking chicken, gummy bears & Red Bull",
            "Deleting all mint gum from the universe",
            "Hiding the dishes and the earrings",
            "Still loving you: " + sinceBreakup() + " since 10/05/2024 and counting",
        ],
    },
    {
        label: "Stage 21 · The proof",
        verse: { text: "So Jacob served seven years for Rachel, and they seemed only a few days to him because of the love he had for her.", ref: "Genesis 29:20", note: () => "Jacob waited 7 years. It's been " + sinceBreakup() + " since 10/05/2024 — and to me they've felt like a few days, because I never stopped loving you." },
        mascot: "📷",
        q: "So… do you believe me now that I remember every single detail?",
        sub: "",
        extra: (el) => drawPolaroids(el),
        yes: "I told you. Every date, every like, every dislike. It's all still here 🧠❤️",
        no: "Scroll through those photos again 😂 I remember every single detail about you.",
        party: "yes",
    },
    {
        type: "letter",
        label: "",
        mascot: "",
        q: "",
        letter: ["All of this is good but it’s not what originally this page was intended to be for. This page wasn’t meant to just express my feelings towards you and that I remember all of these details. I love you and this isn’t the problem. Ana 3aref enna momkn zaman makonash andag haga f enena n manage el 3elaka kwys w mahatenash standards sah msheina 3aleha 3shan kda el denia bazet w ana 3aref eny ghaltan fy Wghet nzarek w Wghet nzary w el 3aks saheeh. Ana kaman 3aref en ehtmalyet enk trodi olayela bas habeit a3ml el landing page di 3shan A2olk ely f3ln gowaya w akhod el risk 3shan marga3sh a2ol yaretny 3mlt kda. Ana olt abl kda yaretny 3mlt X w ma3mltosh w nedmt fa msh 3aiz akarar el ghalta Di tany. I hope enk tkoni kwysa w aked aked i hope enk takhdi el page di kolha ka haga heartwarming msh ka haga badghat 3aleke beeha aw bhawel awsal beeha l haga ana 3aiz awasal haga w 3aref en el ehtmaleya el akhr enha matenfa3sh.", "Thank you Maria ♥️."],
    },
    {
        label: "The last page",
        verse: { text: "Do not remember the former things, nor consider the things of old. Behold, I will do a new thing.", ref: "Isaiah 43:18–19" },
        mascot: "📖",
        q: "Do you want to start a brand new page?",
        sub: "<span class=\"hand\">Keep moving forward…</span>",
        extra: (el) => {
            el.innerHTML =
                '<div class="book" id="book">' +
                '<div class="page left">Chapter 1<br>2023 – 2024</div>' +
                '<div class="page right">Chapter 2<br>❤️ ?</div>' +
                '<div class="page turn">The end?</div>' +
                "</div>";
        },
        yes: "This is the best answer I've ever gotten 🥹 A brand new page it is. I'll be waiting for your message ❤️",
        no: "That's okay. Thank you for reading until the end. I just wanted you to know I remember every single detail — and I always will 🤍",
        party: "yes",
        final: true,
        onAnswer: (choice) => {
            if (choice === "YES") {
                const b = $("book");
                if (b) b.classList.add("flip");
                heartRain(80);
                setMascot("🥹", "love");
            } else {
                setMascot("🤍", "");
            }
        },
    },
];

const memories = [
    ["👀", "23/07/2023", "We met"],
    ["🎂", "04/09", "Your birthday"],
    ["💬", "10/09/2023", "We started talking"],
    ["🚶‍♀️", "29/09/2023", "First hangout"],
    ["✌️", "07/10/2023", "Second hangout"],
    ["💘", "13/10/2023", "We started dating"],
    ["🍽️", "14/10/2023", "First date as a couple"],
    ["🐶", "Top 3", "Scooby Doo, Meet the Robinsons, Aladdin"],
    ["🧦", "Loves", "Cartoon socks & laptop stickers"],
    ["🍗", "Loves", "Chicken, gummy bears, food (all of it)"],
    ["🥫", "Loves", "Red Bull & bracelets 📿"],
    ["🤪", "Loves", "Weirdo pictures & photos of people's eyes"],
    ["🌿", "Hates", "Mint gum"],
    ["🏠", "Hates", "Going out too much & being social"],
    ["🙅‍♀️", "Hates", "Earrings & washing the dishes"],
];

/* =========================================================
   State
   ========================================================= */
let current = 0;
let noTries = 0;
let typing = null;
let finished = false;
const answers = []; // { q, answer, noTries }

/* =========================================================
   Sending answers to you
   ========================================================= */
function ntfy(title, text) {
    if (!CONFIG.ntfyTopic) return;
    const url = "https://ntfy.sh/" + encodeURIComponent(CONFIG.ntfyTopic) +
        "?title=" + encodeURIComponent(title) + "&tags=love_letter";
    // text/plain body = simple request, works from any static page
    fetch(url, { method: "POST", mode: "no-cors", keepalive: true, body: text }).catch(() => {});
}

function callmebot(text) {
    if (!CONFIG.callmebotApiKey || !CONFIG.whatsappNumber) return;
    const url = "https://api.callmebot.com/whatsapp.php?phone=%2B" + CONFIG.whatsappNumber +
        "&text=" + encodeURIComponent(text) + "&apikey=" + encodeURIComponent(CONFIG.callmebotApiKey);
    fetch(url, { mode: "no-cors", keepalive: true }).catch(() => {});
}

function answersAsText() {
    return "Maria's answers 💌\n\n" + answers.map((a, i) => {
        const tries = a.noTries > 0 ? " (tried to press NO " + a.noTries + "x)" : "";
        return (i + 1) + ". " + a.q + " → " + a.answer + tries;
    }).join("\n");
}

function sendSummary(title) {
    const text = answersAsText();
    ntfy(title, text);
    callmebot(title + "\n\n" + text);
}

// If she closes the page halfway, you still get what she answered so far.
window.addEventListener("pagehide", () => {
    if (finished || answers.length === 0) return;
    sendSummary("Maria left after " + answers.length + " answers");
    finished = true;
});

/* =========================================================
   Intro: the envelope
   ========================================================= */
$("envelope").addEventListener("click", (e) => {
    const env = e.currentTarget;
    if (env.classList.contains("open")) return;
    env.classList.add("open");
    burstHearts(e.clientX, e.clientY, 14);
    ntfy("Maria opened the website 👀", "She just opened the envelope.");
    setTimeout(() => $("intro").classList.add("leaving"), 1500);
    setTimeout(() => {
        $("intro").classList.add("hidden");
        $("stageWrap").classList.remove("hidden");
        render();
    }, 2150);
});

/* =========================================================
   Rendering a stage
   ========================================================= */
function drawProgress() {
    const wrap = $("heartsProgress");
    wrap.innerHTML = "";
    stages.forEach((_, i) => {
        const h = document.createElement("span");
        h.textContent = "❤";
        if (i < current) h.className = "done";
        if (i === current) h.className = "now";
        wrap.appendChild(h);
    });
}

function setMascot(emoji, mood) {
    mascot.textContent = emoji;
    mascot.className = "mascot";
    void mascot.offsetWidth;
    if (mood) mascot.classList.add(mood);
}

function say(text) {
    bubble.textContent = text;
    bubble.classList.remove("hidden");
    bubble.style.animation = "none";
    void bubble.offsetWidth;
    bubble.style.animation = "";
}

function render() {
    const s = stages[current];
    resetButtons();
    noTries = 0;

    drawProgress();
    $("stageLabel").textContent = s.label;
    setMascot(s.mascot, "");
    bubble.classList.add("hidden");
    subtitleEl.innerHTML = "";
    extraEl.innerHTML = "";
    buttons.classList.add("hidden");
    reaction.classList.add("hidden");

    card.classList.remove("leave", "shake", "letter-page");
    void card.offsetWidth;
    card.classList.add("enter");

    showVerse(s.verse);

    if (s.type === "letter") return showLetter(s);

    typeText(questionEl, s.q, () => {
        subtitleEl.innerHTML = s.sub || "";
        subtitleEl.classList.add("fade-in");
        if (s.extra) s.extra(extraEl);
        if (s.type === "game") return startGame();
        if (s.type === "loading") return startLoading(s);
        buttons.classList.remove("hidden");
        buttons.classList.add("fade-in");
    });
}

// A page with only his message on it: no emoji, no buttons, no verse.
function showLetter(s) {
    card.classList.add("letter-page");
    mascot.textContent = "";
    questionEl.textContent = "";
    const paper = document.createElement("div");
    paper.className = "letter-paper";
    s.letter.forEach((line, i) => {
        const p = document.createElement("p");
        p.textContent = line;
        if (i === s.letter.length - 1) p.className = "letter-sign";
        p.style.animationDelay = 0.3 + i * 0.9 + "s";
        paper.appendChild(p);
    });
    extraEl.appendChild(paper);
    reactionText.textContent = "";
    nextBtn.textContent = "Continue ➜";
    setTimeout(() => reaction.classList.remove("hidden"), reduceMotion ? 0 : 2200);
    ntfy("Maria is reading your letter 💌", "She reached the page with your message.");
}

function showVerse(v) {
    const box = $("verse");
    if (!v) { box.classList.add("hidden"); return; }
    $("verseText").textContent = "“" + v.text + "”";
    $("verseRef").textContent = "— " + v.ref;
    const note = $("verseNote");
    note.textContent = v.note ? v.note() : "";
    note.classList.toggle("hidden", !v.note);
    box.classList.remove("hidden", "verse-in");
    void box.offsetWidth;
    box.classList.add("verse-in");
}

function typeText(el, text, done) {
    clearInterval(typing);
    if (reduceMotion) {
        el.textContent = text;
        return done();
    }
    const chars = Array.from(text); // keeps emojis whole
    let i = 0;
    el.innerHTML = '<span></span><span class="caret"></span>';
    const span = el.firstChild;
    typing = setInterval(() => {
        span.textContent += chars[i++];
        if (i >= chars.length) {
            clearInterval(typing);
            setTimeout(() => {
                el.textContent = text;
                done();
            }, 250);
        }
    }, 28);
}

function answer(choice) {
    const s = stages[current];
    answers.push({ q: s.q, answer: choice, noTries: noTries });
    ntfy("Maria answered " + choice + " " + (choice === "YES" ? "✅" : "❌"),
        s.q + (noTries ? "\n(she tried to press NO " + noTries + " times first 😂)" : ""));

    resetButtons();
    buttons.classList.add("hidden");
    reactionText.textContent = choice === "YES" ? s.yes : s.no;
    reaction.classList.remove("hidden");
    nextBtn.textContent = s.final ? "See my answers 📋" : "Next ➜";

    const wrongAnswer = false;
    setMascot(s.mascot, wrongAnswer ? "shock" : choice === "YES" ? "happy" : "sad");

    const p = s.party;
    if (p === "both" || (p === "yes" && choice === "YES") || (p === "no" && choice === "NO")) {
        burstConfetti(s.final ? 280 : 130);
    }
    if (wrongAnswer || (!p && choice === "NO")) {
        card.classList.remove("enter", "shake");
        void card.offsetWidth;
        card.classList.add("shake");
    }
    if (s.onAnswer) s.onAnswer(choice);

    if (s.final) {
        finished = true;
        sendSummary("Maria answered " + choice + " to a brand new page " + (choice === "YES" ? "❤️" : "🤍"));
    }
}

function next() {
    card.classList.remove("enter");
    card.classList.add("leave");
    setTimeout(() => {
        if (current < stages.length - 1) {
            current++;
            render();
        } else {
            showResults();
        }
    }, reduceMotion ? 0 : 380);
}

/* =========================================================
   The NO button: runs away, shrinks, begs. YES grows. 🏃‍♀️
   ========================================================= */
let lastDodge = 0;
const noSpot = document.createElement("span");
noSpot.setAttribute("aria-hidden", "true");
let lastPointer = { x: -999, y: -999 };

function noIsActive() {
    return !buttons.classList.contains("hidden");
}

// The NO button can never be pressed: it runs before a finger or cursor reaches it.
function dodge() {
    if (!noIsActive()) return;
    const now = performance.now();
    if (now - lastDodge < 220) return; // one jump per attempt
    lastDodge = now;
    noTries++;

    // YES grows (but never wider than the screen), NO shrinks a bit
    const vw = window.innerWidth;
    const curGrow = parseFloat(yesBtn.style.getPropertyValue("--grow")) || 1;
    const maxGrow = Math.min(2.4, curGrow * (vw * 0.85) / Math.max(1, yesBtn.offsetWidth));
    yesBtn.style.setProperty("--grow", Math.min(maxGrow, 1 + noTries * 0.15).toFixed(2));
    noBtn.style.setProperty("--shrink", Math.max(0.7, 1 - noTries * 0.05).toFixed(2));
    noBtn.textContent = pleas[(noTries - 1) % pleas.length];

    // move it to <body> so the card's 3D/blur effects can't trap it off-screen
    // (an empty placeholder keeps YES from sliding into the spot she was aiming at)
    if (noBtn.parentNode !== document.body) {
        noSpot.style.width = noBtn.offsetWidth + "px";
        noSpot.style.height = noBtn.offsetHeight + "px";
        buttons.appendChild(noSpot);
        document.body.appendChild(noBtn);
    }
    noBtn.classList.add("runaway");
    placeNo();

    setMascot(stages[current].mascot, "sad");
    say(noTries >= 6 && noTries % 3 === 0 ? "The green button is RIGHT there 👉" : pick(dodgeBubbles));
}

// Pick a spot on screen far from her finger and not on top of YES.
function placeNo() {
    const vv = window.visualViewport;
    const vw = vv ? vv.width : window.innerWidth;
    const vh = vv ? vv.height : window.innerHeight;
    const w = noBtn.offsetWidth;
    const h = noBtn.offsetHeight;
    const pad = 12;
    // measure YES at its final (grown) size, not mid-animation
    const prevTransition = yesBtn.style.transition;
    yesBtn.style.transition = "none";
    const yes = yesBtn.getBoundingClientRect();
    yesBtn.style.transition = prevTransition;
    let best = null;
    let bestDist = -1;
    for (let i = 0; i < 30; i++) {
        const x = rand(pad, Math.max(pad, vw - w - pad));
        const y = rand(pad, Math.max(pad, vh - h - pad));
        const overYes = x < yes.right + 24 && x + w > yes.left - 24 && y < yes.bottom + 24 && y + h > yes.top - 24;
        if (overYes) continue;
        const d = Math.hypot(x + w / 2 - lastPointer.x, y + h / 2 - lastPointer.y);
        if (d > bestDist) { best = { x, y }; bestDist = d; }
        if (d > Math.min(vw, vh) * 0.45) break;
    }
    if (!best) best = { x: pad, y: pad };
    noBtn.style.left = best.x + "px";
    noBtn.style.top = best.y + "px";
    noBtn.classList.remove("jump");
    void noBtn.offsetWidth;
    noBtn.classList.add("jump");
}

function resetButtons() {
    noSpot.remove();
    if (noBtn.parentNode !== buttons) buttons.appendChild(noBtn);
    noBtn.classList.remove("runaway");
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.style.setProperty("--shrink", 1);
    yesBtn.style.setProperty("--grow", 1);
    noBtn.textContent = "NO";
}

// Is a finger / cursor at (x, y) close to the NO button?
function nearNo(x, y, margin) {
    const r = noBtn.getBoundingClientRect();
    return x > r.left - margin && x < r.right + margin && y > r.top - margin && y < r.bottom + margin;
}

// cursor or finger moving toward NO -> it runs
window.addEventListener("pointermove", (e) => {
    lastPointer = { x: e.clientX, y: e.clientY };
    if (noIsActive() && nearNo(e.clientX, e.clientY, e.pointerType === "mouse" ? 60 : 40)) dodge();
}, { passive: true });

// finger lands on or near NO -> it's gone before the tap finishes
window.addEventListener("pointerdown", (e) => {
    lastPointer = { x: e.clientX, y: e.clientY };
    if (noIsActive() && nearNo(e.clientX, e.clientY, 30)) {
        if (e.target === noBtn) e.preventDefault();
        dodge();
    }
}, true);

// keyboard (Enter / Space) or anything else that "clicks" it -> it runs
noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dodge();
});
yesBtn.addEventListener("click", (e) => {
    // a click right after NO ran away was aimed at NO, not a real YES
    if (performance.now() - lastDodge < 500) return;
    burstHearts(e.clientX, e.clientY, 10);
    answer("YES");
});
nextBtn.addEventListener("click", next);

/* =========================================================
   Stage extras
   ========================================================= */
function countUp(el, target) {
    if (!el) return;
    const start = performance.now();
    const dur = 1600;
    (function step(now) {
        const t = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString();
        if (t < 1) requestAnimationFrame(step);
    })(start);
}

function drawPolaroids(el) {
    const grid = document.createElement("div");
    grid.className = "polaroids";
    memories.forEach(([emoji, date, text], i) => {
        const p = document.createElement("div");
        p.className = "polaroid";
        p.style.animationDelay = i * 0.12 + "s";
        p.innerHTML = '<div class="ph">' + emoji + '</div><div class="pd">' + date + '</div><div class="pt">' + text + "</div>";
        grid.appendChild(p);
    });
    el.appendChild(grid);
}

/* ---------- the "loading memories" stage ---------- */
function startLoading(s) {
    extraEl.innerHTML = '<div class="load-pct" id="loadPct">0%</div>' +
        '<div class="loadbar"><div class="loadbar-fill" id="loadFill"></div></div>' +
        '<ul class="load-lines" id="loadLines"></ul>';
    const lines = $("loadLines");
    let i = 0;
    const timer = setInterval(() => {
        if (i < s.lines.length) {
            const li = document.createElement("li");
            li.innerHTML = '<span class="ok">✔</span> ' + s.lines[i];
            lines.appendChild(li);
            if (lines.children.length > 6) lines.firstChild.remove();
        }
        i++;
        const pct = Math.min(100, Math.round((i / s.lines.length) * 100));
        $("loadPct").textContent = pct + "%";
        $("loadFill").style.width = pct + "%";
        if (i >= s.lines.length) {
            clearInterval(timer);
            setTimeout(() => {
                $("loadPct").textContent = "100% — nothing was forgotten ✅";
                setMascot("🧠", "happy");
                burstConfetti(80);
                reactionText.textContent = "Memory check complete. Zero details lost 😎";
                reaction.classList.remove("hidden");
                nextBtn.textContent = "Next ➜";
            }, 400);
        }
    }, 650);
}

/* ---------- mini game: feed Maria ---------- */
function startGame() {
    const GOAL = 6;
    const good = ["🍗", "🧸", "🥫", "🍗", "🧸", "🍔", "🍟"];
    let score = 0;
    let mintHits = 0;
    let over = false;

    extraEl.innerHTML = '<div class="game" id="game"><div class="game-hud" id="hud"></div></div>';
    const game = $("game");
    const hud = $("hud");
    const updateHud = () => { hud.textContent = "🍽️ " + score + " / " + GOAL + "   ·   mint touched: " + mintHits + " 🌿"; };
    updateHud();

    function popText(x, y, text, color) {
        const t = document.createElement("span");
        t.className = "game-pop";
        t.textContent = text;
        t.style.left = x + "px";
        t.style.top = y + "px";
        t.style.color = color;
        game.appendChild(t);
        setTimeout(() => t.remove(), 800);
    }

    function spawn() {
        if (over) return;
        const isMint = Math.random() < 0.28;
        const s = document.createElement("span");
        s.className = "snack";
        s.textContent = isMint ? "🌿" : pick(good);
        s.style.left = rand(4, 82) + "%";
        const dur = rand(2.6, 3.8).toFixed(2) + "s";
        s.style.setProperty("--dur", dur);
        s.style.animationDuration = dur;
        s.style.setProperty("--spin", rand(-90, 90) + "deg");
        s.addEventListener("animationend", () => { if (!s.classList.contains("caught")) s.remove(); });
        s.addEventListener("pointerdown", (e) => {
            e.preventDefault();
            if (over || s.classList.contains("caught")) return;
            const r = game.getBoundingClientRect();
            const x = e.clientX - r.left;
            const y = e.clientY - r.top;
            // freeze it where it is, then pop it
            const st = getComputedStyle(s).transform;
            s.style.animation = "none";
            s.style.transform = st === "none" ? "" : st;
            s.classList.add("caught");
            requestAnimationFrame(() => {
                s.style.transition = "transform 0.3s ease, opacity 0.3s ease";
                s.style.transform = (st === "none" ? "" : st) + " scale(2)";
                s.style.opacity = "0";
            });
            setTimeout(() => s.remove(), 350);
            if (isMint) {
                mintHits++;
                score = Math.max(0, score - 1);
                popText(x, y, "EW MINT 🤢", "#e04a6c");
                card.classList.remove("enter", "shake");
                void card.offsetWidth;
                card.classList.add("shake");
                setMascot("🤢", "shock");
            } else {
                score++;
                popText(x, y, pick(["+1 yum!", "nom nom", "😋", "+1"]), "#29a873");
                setMascot("😋", "happy");
            }
            updateHud();
            if (score >= GOAL) win();
        });
        game.appendChild(s);
    }

    const timer = setInterval(spawn, 620);
    spawn();

    function win() {
        over = true;
        clearInterval(timer);
        game.querySelectorAll(".snack").forEach((s) => s.remove());
        const result = score + "/" + GOAL + " snacks, touched mint " + mintHits + "x";
        answers.push({ q: "Mini game: Feed Maria", answer: "GAME", detail: result, noTries: 0 });
        ntfy("Maria finished the mini game 🍗", result);
        burstConfetti(120);
        setMascot("🍗", "happy");
        reactionText.textContent = mintHits === 0
            ? "Perfect! Not a single mint leaf touched. Of course — you'd never 😂🍗"
            : "You touched the mint " + mintHits + " time" + (mintHits > 1 ? "s" : "") + " 🤢 I thought you hated it?! Still, you're fed 😂";
        reaction.classList.remove("hidden");
        nextBtn.textContent = "Next ➜";
    }
}

/* =========================================================
   Final results page
   ========================================================= */
function showResults() {
    current = stages.length;
    drawProgress();
    $("stageLabel").textContent = "Your answers";
    setMascot("📋", "happy");
    bubble.classList.add("hidden");
    questionEl.textContent = "Here's everything you answered";
    subtitleEl.innerHTML = "He's already getting them 👀";
    showVerse({ text: "Love bears all things, believes all things, hopes all things, endures all things. Love never fails.", ref: "1 Corinthians 13:7–8" });
    extraEl.innerHTML = "";

    const ul = document.createElement("ul");
    ul.className = "answers";
    answers.forEach((a, i) => {
        const li = document.createElement("li");
        li.style.animationDelay = i * 0.04 + "s";
        const q = document.createElement("span");
        q.textContent = a.q;
        if (a.noTries) {
            const sm = document.createElement("small");
            sm.textContent = "  (tried NO " + a.noTries + "x 😂)";
            q.appendChild(sm);
        }
        const tag = document.createElement("span");
        tag.className = "tag " + (a.answer === "GAME" ? "game" : a.answer.toLowerCase());
        tag.textContent = a.answer === "GAME" ? a.detail.split(",")[0] : a.answer;
        li.append(q, tag);
        ul.appendChild(li);
    });
    extraEl.appendChild(ul);

    if (CONFIG.whatsappNumber) {
        const btn = document.createElement("button");
        btn.className = "btn wa";
        btn.textContent = "Send my answers to him on WhatsApp 💬";
        btn.onclick = () => {
            const url = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(answersAsText());
            window.open(url, "_blank");
        };
        extraEl.appendChild(btn);
    }

    buttons.classList.add("hidden");
    reaction.classList.add("hidden");
    card.classList.remove("leave");
    void card.offsetWidth;
    card.classList.add("enter");
}

/* =========================================================
   Motion graphics 🎬
   ========================================================= */

/* ---------- confetti (rectangles + hearts) ---------- */
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];
let animating = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function burstConfetti(count) {
    if (reduceMotion) count = Math.min(count, 30);
    const colors = ["#ff6b8b", "#8b5cf6", "#3ccf91", "#ffd166", "#4cc9f0", "#ff8fb8"];
    for (let i = 0; i < count; i++) {
        pieces.push({
            x: window.innerWidth / 2 + rand(-40, 40),
            y: window.innerHeight * 0.55,
            vx: rand(-9, 9),
            vy: rand(-18, -6),
            size: rand(6, 13),
            color: pick(colors),
            rot: rand(0, Math.PI),
            vr: rand(-0.15, 0.15),
            heart: Math.random() < 0.3,
            life: 0,
        });
    }
    if (!animating) {
        animating = true;
        requestAnimationFrame(tick);
    }
}

function heartRain(count) {
    for (let i = 0; i < count; i++) {
        pieces.push({
            x: rand(0, window.innerWidth),
            y: rand(-300, -20),
            vx: rand(-1, 1),
            vy: rand(1, 4),
            size: rand(12, 22),
            color: pick(["#ff6b8b", "#e11d48", "#ff8fb8", "#8b5cf6"]),
            rot: rand(-0.4, 0.4),
            vr: rand(-0.03, 0.03),
            heart: true,
            life: 0,
        });
    }
    if (!animating) {
        animating = true;
        requestAnimationFrame(tick);
    }
}

function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach((p) => {
        p.vy += p.heart ? 0.12 : 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.heart) {
            ctx.font = p.size * 1.6 + "px serif";
            ctx.fillText("❤", -p.size / 2, p.size / 2);
        } else {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
    });
    pieces = pieces.filter((p) => p.y < canvas.height + 60 && p.life < 420);
    if (pieces.length) {
        requestAnimationFrame(tick);
    } else {
        animating = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/* ---------- hearts that burst from a click ---------- */
function burstHearts(x, y, n) {
    if (reduceMotion || x === undefined) return;
    const trail = $("trail");
    for (let i = 0; i < n; i++) {
        const h = document.createElement("span");
        h.className = "burst-heart";
        h.textContent = pick(["❤️", "💖", "💕", "💗", "✨"]);
        const ang = (Math.PI * 2 * i) / n;
        const dist = rand(50, 110);
        h.style.left = x + "px";
        h.style.top = y + "px";
        h.style.setProperty("--dx", Math.cos(ang) * dist + "px");
        h.style.setProperty("--dy", Math.sin(ang) * dist + "px");
        h.style.setProperty("--rot", rand(-60, 60) + "deg");
        trail.appendChild(h);
        setTimeout(() => h.remove(), 850);
    }
}

/* ---------- heart trail following the cursor / finger ---------- */
let lastTrail = 0;
window.addEventListener("pointermove", (e) => {
    if (reduceMotion) return;
    const now = performance.now();
    if (now - lastTrail < 60) return;
    lastTrail = now;
    const h = document.createElement("span");
    h.className = "trail-heart";
    h.textContent = pick(["💗", "💕", "✨", "💖"]);
    h.style.left = e.clientX + "px";
    h.style.top = e.clientY + "px";
    $("trail").appendChild(h);
    setTimeout(() => h.remove(), 900);
});

/* ---------- Red Bull flying away ---------- */
function flyAway(emoji) {
    const f = document.createElement("span");
    f.className = "fly";
    f.textContent = emoji + "🪽";
    f.style.left = "50%";
    f.style.top = "60%";
    document.body.appendChild(f);
    setTimeout(() => f.remove(), 1900);
}

/* ---------- camera flash ---------- */
function cameraFlash() {
    const fl = $("flash");
    fl.classList.remove("go");
    void fl.offsetWidth;
    fl.classList.add("go");
}

/* ---------- floating emojis in the background ---------- */
const floatEmojis = ["🐶", "🧸", "🍗", "🧦", "📸", "🥫", "📿", "💻", "🧞", "💕", "👁️", "💖", "🎂", "✨"];
function spawnFloater() {
    const el = document.createElement("span");
    el.className = "floater";
    el.textContent = pick(floatEmojis);
    el.style.left = rand(0, 100) + "vw";
    el.style.fontSize = rand(20, 44) + "px";
    el.style.animationDuration = rand(9, 17) + "s";
    $("floaters").appendChild(el);
    setTimeout(() => el.remove(), 18000);
}
if (!reduceMotion) {
    setInterval(spawnFloater, 1100);
    for (let i = 0; i < 8; i++) setTimeout(spawnFloater, i * 250);
}
