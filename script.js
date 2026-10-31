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
   dodge  : how many times NO runs away before she can click it
   party  : "yes" | "no" | "both" -> confetti on that answer
   trap   : true -> YES is the "wrong" answer (shock face + shake)
   extra  : function that draws something extra on the page
   onAnswer: special effect after answering
   ========================================================= */
const stages = [
    {
        label: "Stage 0 · Warm up",
        mascot: "💌",
        q: "Hi Maria! Someone built a whole website just for you. Wanna see it?",
        sub: "Every page has only two buttons. Choose wisely 😌",
        yes: "Good choice! Fasten your seatbelt, this is going to be a ride 🎢",
        no: "You found the NO button… but you're already here, so let's go anyway 😂",
        dodge: 3,
        party: "yes",
    },
    {
        label: "Stage 1 · The beginning",
        mascot: "👀",
        q: "Do you remember the 23rd of July 2023?",
        sub: "Hint: two people met and had no idea what was coming.",
        extra: (el) => {
            el.innerHTML = '<div class="counter" id="counter">0</div><div class="counter-label">days since that day — and I remember it</div>';
            countUp($("counter"), daysSince(MET_ON));
        },
        yes: "The day we first met! 23/7/2023. I still remember it like it was yesterday 🗓️",
        no: "Wow. I remember it and you don't?! 23/7/2023 — the day we met. Write it down 📝",
        dodge: 2,
        party: "yes",
    },
    {
        label: "Stage 2 · First message",
        mascot: "💬",
        q: "10th of September 2023… does that ring a bell?",
        sub: "Not your birthday. That was 6 days earlier 😉",
        yes: "Yep! The day we started talking. Who knew a few texts would turn into all of that 📱✨",
        no: "That's the day we started talking! I remember, so you're officially losing this game 😎",
        dodge: 2,
    },
    {
        label: "Stage 3 · Hangout #1",
        mascot: "🚶‍♀️",
        q: "Do you remember the first time we hung out?",
        sub: "I'll give you a second… ⏳",
        yes: "29th of September 2023! See? I didn't even need a calendar 🧠",
        no: "29th of September 2023. Our very first hangout. Don't worry, I've got the memory for both of us 💾",
        dodge: 2,
    },
    {
        label: "Stage 4 · Hangout #2",
        mascot: "✌️",
        q: "And the second time? Bet you don't know this one.",
        sub: "Wait… you don't even like hanging out much. So it must've been worth it 😏",
        yes: "7th of October 2023! Two hangouts — from YOU?! That's basically a world record 🏆",
        no: "7th of October 2023! Two hangouts from someone who hates going out. Clearly I was special 😌",
        dodge: 3,
    },
    {
        label: "Stage 5 · Official",
        mascot: "💘",
        q: "13th of October 2023. You know what happened, right?",
        sub: "The day the status changed 👀",
        yes: "We started dating! 13/10/2023 — the main episode 💕",
        no: "We started DATING, Maria! 13/10/2023! How do you forget the main episode?! 😂",
        dodge: 4,
        party: "yes",
        onAnswer: () => heartRain(40),
    },
    {
        label: "Stage 6 · First date",
        mascot: "🍽️",
        q: "Do you remember our first time going out as a couple?",
        sub: "It was literally the next day. Someone was excited 🙈",
        yes: "14th of October 2023! One day after it became official. No time was wasted 😂",
        no: "14th of October 2023 — the very next day! I remember, so you owe me a point 🎯",
        dodge: 2,
    },
    {
        label: "Stage 7 · Important date",
        mascot: "🎂",
        q: "Do you think I remember your birthday?",
        sub: "Careful… this is a test of MY memory, not yours.",
        extra: (el) => {
            el.innerHTML = '<div class="cake" id="cake"><span class="flame">🔥</span><span class="flame">🔥</span><span class="flame">🔥</span>🎂</div>';
        },
        yes: "Of course I do — the 4th of September! 🎉 Make a wish, I just blew the candles for you 🕯️",
        no: "Excuse me?! The 4th of September! I would NEVER forget it 😤🎂",
        dodge: 3,
        party: "both",
        onAnswer: () => { const c = $("cake"); if (c) c.classList.add("blown"); },
    },
    {
        label: "Stage 8 · Cartoon quiz",
        mascot: "🐶",
        q: "Is Scooby Doo still the best show in the world?",
        sub: "Zoinks! Think carefully…",
        yes: "Scooby-Dooby-Doo! 🐾 Scooby Doo, Meet the Robinsons and Aladdin — your top 3. Told you I remember.",
        no: "Ruh-roh! 😱 Then is it Meet the Robinsons? Or Aladdin? Either way, I know your top 3 by heart 📺",
        dodge: 2,
        party: "yes",
    },
    {
        label: "Stage 9 · Movie night",
        mascot: "🧞",
        q: "Movie night! YES = Meet the Robinsons, NO = Aladdin.",
        sub: "There's no wrong answer. Except the one you're about to pick 😂",
        yes: "Meet the Robinsons! \"Keep moving forward\" — remember that line, it's coming back later 👀",
        no: "Aladdin! 🧞‍♂️ If I found a magic lamp, one wish would be getting this exact answer 😄",
        dodge: 0,
        party: "both",
    },
    {
        type: "game",
        label: "Stage 10 · Mini game",
        mascot: "🍗",
        q: "Feed Maria! Catch 6 snacks 🍗🧸🥫",
        sub: "Tap the food before it falls. But DON'T touch the mint 🌿 — I know you hate it.",
    },
    {
        label: "Stage 11 · A little snack",
        mascot: "🍬",
        q: "Speaking of mint… want a mint gum?",
        sub: "Fresh breath, cool vibes…",
        yes: "WHO ARE YOU AND WHAT HAVE YOU DONE WITH MARIA?! 🚨 She HATES mint gum!",
        no: "Correct! Mint gum = disgusting. Have some gummy bears instead 🧸 I know you love them.",
        dodge: 0,
        trap: true,
        party: "no",
    },
    {
        label: "Stage 12 · Weekend plans",
        mascot: "🎉",
        q: "Wanna go to a huge party with 200 strangers and talk to everyone?",
        sub: "Small talk, loud music, meeting new people…",
        yes: "Liar 😂 You don't like being social and you don't like going out too much. I KNOW you.",
        no: "Exactly what I expected 😂 Staying home > socializing. I remember, don't worry.",
        dodge: 0,
        trap: true,
        party: "no",
    },
    {
        label: "Stage 13 · Chores",
        mascot: "🧽",
        q: "Would you like to wash the dishes after dinner?",
        sub: "There's only like… 47 plates 🍽️",
        yes: "Hold on, let me call a doctor 🚑 Maria NEVER volunteers to wash the dishes.",
        no: "Of course not 😂 You hate washing the dishes. Noted since forever.",
        dodge: 0,
        trap: true,
        party: "no",
    },
    {
        label: "Stage 14 · Gift time",
        mascot: "💍",
        q: "I got you a gift… a pair of earrings! Do you like them?",
        sub: "Sparkly, shiny, beautiful… ✨",
        yes: "Gotcha! 😂 It was a trap. You don't like wearing earrings — I'd get you a bracelet instead 📿",
        no: "Correct!! Earrings are a no. Bracelets are a YES. Told you I remember 📿",
        dodge: 0,
        trap: true,
        party: "no",
    },
    {
        label: "Stage 15 · The real gift",
        mascot: "🧦",
        q: "Okay, real gift: socks with cartoon characters on them. Yes?",
        sub: "Imagine Scooby Doo on your feet 🐶🧦",
        yes: "I knew it! Cartoon socks are the way to your heart 🧦❤️",
        no: "Lies! You love cartoon socks. I'm wrapping them anyway 🎁🧦",
        dodge: 4,
        party: "yes",
    },
    {
        label: "Stage 16 · Laptop decoration",
        mascot: "💻",
        q: "Does your laptop need one more sticker?",
        sub: "There's always room for one more…",
        yes: "Obviously! A laptop without stickers is just a sad grey rectangle 😂",
        no: "Suspicious 🤨 You love laptop stickers. Is there just no space left? 😂",
        dodge: 3,
        party: "yes",
    },
    {
        label: "Stage 17 · Food",
        mascot: "😋",
        q: "Are you hungry right now?",
        sub: "Before you answer: you love food so much, the answer is always the same 😂",
        yes: "Of course you are 😂 Chicken? Gummy bears? Red Bull on the side? Your order is ready 🍗🧸🥫",
        no: "I don't believe you. You're ALWAYS hungry 😂 Chicken is on its way 🍗",
        dodge: 5,
        party: "yes",
    },
    {
        label: "Stage 18 · Energy check",
        mascot: "⚡",
        q: "Need a Red Bull to survive the rest of this website?",
        sub: "It gives you wiiiings 🪽",
        yes: "Here you go 🥫⚡ One cold Red Bull… and there it flies 🪽",
        no: "Saving it for later, smart. Still, I know it's your favorite 🥫",
        dodge: 2,
        onAnswer: (choice) => { if (choice === "YES") flyAway("🥫"); },
    },
    {
        label: "Stage 19 · Photo time",
        mascot: "📸",
        q: "Can I take a normal, nice, pretty picture of you?",
        sub: "3… 2… 1… smile 😊",
        yes: "Normal?! 😂 We both know you'd make a weird face. Then you'd take a close-up of MY eyes 👁️👁️",
        no: "Right, normal pictures are boring. Weirdo pictures only 🤪 — and close-ups of people's eyes 👁️",
        dodge: 2,
        onAnswer: () => { cameraFlash(); setMascot("👁️👁️", "shock"); },
    },
    {
        type: "loading",
        label: "Stage 20 · Processing",
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
        ],
    },
    {
        label: "Stage 21 · The proof",
        mascot: "📷",
        q: "So… do you believe me now that I remember every single detail?",
        sub: "",
        extra: (el) => drawPolaroids(el),
        yes: "I told you. Every date, every like, every dislike. It's all still here 🧠❤️",
        no: "Scroll through those photos again 😂 I remember every single detail about you.",
        dodge: 6,
        party: "yes",
    },
    {
        label: "The last page",
        mascot: "📖",
        q: "Do you want to start a brand new page?",
        sub: "<span class=\"hand\">Keep moving forward…</span><br>No tricks on this one. The NO button stays still — your answer is yours.",
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
        dodge: 0,
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
let dodgesLeft = 0;
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
    dodgesLeft = s.dodge || 0;
    noTries = 0;

    drawProgress();
    $("stageLabel").textContent = s.label;
    setMascot(s.mascot, "");
    bubble.classList.add("hidden");
    subtitleEl.innerHTML = "";
    extraEl.innerHTML = "";
    buttons.classList.add("hidden");
    reaction.classList.add("hidden");

    card.classList.remove("leave", "shake");
    void card.offsetWidth;
    card.classList.add("enter");

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

    const wrongAnswer = s.trap ? choice === "YES" : false;
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
function dodge() {
    if (dodgesLeft <= 0) return false;
    dodgesLeft--;
    noTries++;

    const yesGrow = 1 + noTries * 0.18;
    const noShrink = Math.max(0.6, 1 - noTries * 0.07);
    yesBtn.style.setProperty("--grow", yesGrow.toFixed(2));
    noBtn.style.setProperty("--shrink", noShrink.toFixed(2));

    const pad = 16;
    const w = noBtn.offsetWidth;
    const h = noBtn.offsetHeight;
    // move it to <body> so the card's 3D/blur effects can't trap it off-screen
    if (noBtn.parentNode !== document.body) document.body.appendChild(noBtn);
    noBtn.classList.add("runaway");
    noBtn.style.left = rand(pad, Math.max(pad, window.innerWidth - w - pad)) + "px";
    noBtn.style.top = rand(pad, Math.max(pad, window.innerHeight - h - pad)) + "px";
    noBtn.textContent = dodgesLeft > 0 ? pleas[(noTries - 1) % pleas.length] : "Fine… NO 🙄";

    setMascot(stages[current].mascot, "sad");
    say(pick(dodgeBubbles));
    return true;
}

function resetButtons() {
    if (noBtn.parentNode !== buttons) buttons.appendChild(noBtn);
    noBtn.classList.remove("runaway");
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.style.setProperty("--shrink", 1);
    yesBtn.style.setProperty("--grow", 1);
    noBtn.textContent = "NO";
}

noBtn.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") dodge(); // on phones a tap = click below
});
noBtn.addEventListener("click", () => {
    if (dodge()) return; // it ran away instead of being clicked
    answer("NO");
});
yesBtn.addEventListener("click", (e) => {
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
