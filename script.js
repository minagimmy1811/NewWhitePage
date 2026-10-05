/* =========================================================
   SETTINGS — fill these in so you receive Maria's answers
   ========================================================= */
const CONFIG = {
    // Your email. Her answers get emailed to you through FormSubmit (free, no account).
    // The very first time, FormSubmit sends you a confirmation email — click "Activate" once.
    formsubmitEmail: "",

    // Optional: your WhatsApp number with country code, no "+" or spaces (e.g. "201001234567").
    // Adds a "Send my answers to him" button on the last page.
    whatsappNumber: "",
};

/* =========================================================
   Helpers
   ========================================================= */
const MET_ON = new Date(2023, 6, 23); // 23 July 2023
const daysSince = (d) => Math.floor((Date.now() - d.getTime()) / 86400000);

const $ = (id) => document.getElementById(id);
const card = $("card");
const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const buttons = $("buttons");
const reaction = $("reaction");
const reactionText = $("reactionText");
const nextBtn = $("nextBtn");

/* =========================================================
   The stages
   - dodge: how many times the NO button runs away before it lets her click it
   - party: "yes" | "no" | "both" -> which answer throws confetti
   ========================================================= */
const stages = [
    {
        label: "Stage 0 · Warm up",
        emoji: "💌",
        question: "Hi Maria! Someone built a whole website just for you. Wanna see it?",
        subtitle: "Every page has only two buttons. Choose wisely 😌",
        yes: "Good choice! Fasten your seatbelt, this is going to be a ride 🎢",
        no: "Okay okay, you found the NO button… but you're already here, so let's go anyway 😂",
        dodge: 3,
        party: "yes",
    },
    {
        label: "Stage 1 · The beginning",
        emoji: "👀",
        question: "Do you remember the 23rd of July 2023?",
        subtitle: "Hint: it's the day two people met and had no idea what was coming.",
        yes: "That's the day we first met! It's been " + daysSince(MET_ON) + " days and I still remember it 🗓️",
        no: "Wow. I remember it and you don't?! 23/7/2023 — the day we met. Write it down 📝",
        dodge: 1,
        party: "yes",
    },
    {
        label: "Stage 2 · First message",
        emoji: "💬",
        question: "10th of September 2023… does that ring a bell?",
        subtitle: "Not your birthday. That was 6 days earlier 😉",
        yes: "Yep! The day we started talking. Who knew a few texts would turn into all of that 📱✨",
        no: "That's the day we started talking! I remember it, so you're officially losing this game 😎",
        dodge: 1,
    },
    {
        label: "Stage 3 · Hangout #1",
        emoji: "🚶‍♀️🚶",
        question: "Do you remember our first time hanging out?",
        subtitle: "I'll give you a second…",
        yes: "29th of September 2023! See? I didn't even need a calendar 🧠",
        no: "29th of September 2023. Our very first hangout. Don't worry, I've got the memory for both of us 💾",
        dodge: 1,
    },
    {
        label: "Stage 4 · Hangout #2",
        emoji: "✌️",
        question: "And the second time? Bet you don't know this one.",
        subtitle: "Wait, I know you don't like hanging out too much… so it must have been worth it 😏",
        yes: "7th of October 2023! Two hangouts — from you?! That's basically a world record 🏆",
        no: "7th of October 2023! Two hangouts from someone who hates going out. Clearly I was special 😌",
        dodge: 2,
    },
    {
        label: "Stage 5 · Official",
        emoji: "💘",
        question: "13th of October 2023. You know what happened, right?",
        subtitle: "The day the status changed 👀",
        yes: "We started dating! 13/10/2023 — I remember it like it was yesterday 💕",
        no: "We started DATING, Maria! 13/10/2023! How do you forget the main episode?! 😂",
        dodge: 3,
        party: "yes",
    },
    {
        label: "Stage 6 · First date",
        emoji: "🍽️",
        question: "Do you remember our first time going out while dating?",
        subtitle: "It was literally the next day. Someone was excited 🙈",
        yes: "14th of October 2023! One day after it became official. No time was wasted 😂",
        no: "14th of October 2023 — the very next day! I remember, so you owe me a point 🎯",
        dodge: 1,
    },
    {
        label: "Stage 7 · Important date",
        emoji: "🎂",
        question: "Do you think I remember your birthday?",
        subtitle: "Careful… this is a test of my memory, not yours.",
        yes: "Of course I do — the 4th of September! 🎉 Happy belated birthday, by the way 🎁",
        no: "Excuse me?! The 4th of September! I would NEVER forget it 😤🎂",
        dodge: 2,
        party: "both",
    },
    {
        label: "Stage 8 · Cartoon quiz",
        emoji: "🐶",
        question: "Is Scooby Doo still the best show in the world?",
        subtitle: "Zoinks! Think carefully…",
        yes: "Scooby-Dooby-Doo! 🐾 I knew it. Scooby Doo, Meet the Robinsons and Aladdin — your top 3. Told you I remember everything.",
        no: "Ruh-roh! 😱 Okay then, is it Meet the Robinsons? Or Aladdin? Either way, I know your top 3 by heart 📺",
        dodge: 1,
    },
    {
        label: "Stage 9 · Movie night",
        emoji: "🧞",
        question: "Movie night: Meet the Robinsons or Aladdin? (YES = Robinsons, NO = Aladdin)",
        subtitle: "There's no wrong answer. Except the one you're about to pick 😂",
        yes: "Meet the Robinsons! \"Keep moving forward\" — remember that line, it's coming back later 👀",
        no: "Aladdin! 🧞‍♂️ If I found a magic lamp, one of my wishes would be getting this exact answer 😄",
        dodge: 0,
    },
    {
        label: "Stage 10 · A little snack",
        emoji: "🍬",
        question: "Want a mint gum?",
        subtitle: "Fresh breath, cool vibes…",
        yes: "WHO ARE YOU AND WHAT HAVE YOU DONE WITH MARIA?! 🚨 She HATES mint gum!",
        no: "Correct! Mint gum = disgusting. How about some gummy bears instead? 🧸 I know you love them.",
        dodge: 0,
        party: "no",
    },
    {
        label: "Stage 11 · Weekend plans",
        emoji: "🎉",
        question: "Want to go to a huge party with 200 strangers and talk to everyone?",
        subtitle: "Small talk, loud music, meeting new people…",
        yes: "Liar 😂 You don't like being sociable and you don't like hanging out too much. I KNOW you.",
        no: "Exactly what I expected 😂 Staying home > socializing. I remember, don't worry.",
        dodge: 0,
        party: "no",
    },
    {
        label: "Stage 12 · Chores",
        emoji: "🧽",
        question: "Would you like to wash the dishes after dinner?",
        subtitle: "There's only like… 47 plates 🍽️",
        yes: "Hold on, let me call a doctor 🚑 Maria NEVER volunteers to wash the dishes.",
        no: "Of course not 😂 You hate washing the dishes. Noted since forever.",
        dodge: 0,
        party: "no",
    },
    {
        label: "Stage 13 · Gift time",
        emoji: "💍",
        question: "I got you a gift… a pair of earrings! Do you like them?",
        subtitle: "Sparkly, shiny, beautiful…",
        yes: "Gotcha! 😂 It was a trap. You don't like wearing earrings — I'd get you a bracelet instead 📿",
        no: "Correct!! Earrings are a no. Bracelets are a YES. Told you I remember 📿",
        dodge: 0,
        party: "no",
    },
    {
        label: "Stage 14 · The real gift",
        emoji: "🧦",
        question: "Okay, real gift: socks with cartoon characters on them. Yes?",
        subtitle: "Imagine Scooby Doo on your feet 🐶🧦",
        yes: "I knew it! Cartoon socks are the way to your heart 🧦❤️",
        no: "Lies! You love cartoon socks. I'm wrapping them anyway 🎁🧦",
        dodge: 3,
        party: "yes",
    },
    {
        label: "Stage 15 · Laptop decoration",
        emoji: "💻",
        question: "Does your laptop need one more sticker?",
        subtitle: "There's always room for one more…",
        yes: "Obviously! A laptop without stickers is just a sad grey rectangle 😂",
        no: "Hmm, suspicious. You love laptop stickers. Is there just no space left? 😂",
        dodge: 2,
    },
    {
        label: "Stage 16 · Food",
        emoji: "🍗",
        question: "Are you hungry right now?",
        subtitle: "Before you answer: you love food so much that the answer is always the same 😂",
        yes: "Of course you are 😂 Chicken? Gummy bears? A Red Bull on the side? Your order is ready 🍗🧸🥫",
        no: "I don't believe you. You're ALWAYS hungry 😂 Chicken is on its way 🍗",
        dodge: 3,
        party: "yes",
    },
    {
        label: "Stage 17 · Energy check",
        emoji: "⚡",
        question: "Need a Red Bull to survive the rest of this website?",
        subtitle: "It gives you wiiiings 🪽",
        yes: "Here you go 🥫⚡ One Red Bull, cold, just how you like it.",
        no: "Saving it for later, smart. Still, I know it's your favorite 🥫",
        dodge: 1,
    },
    {
        label: "Stage 18 · Photo time",
        emoji: "📸",
        question: "Can I take a normal, nice, pretty picture of you?",
        subtitle: "Smile 😊",
        yes: "Normal?! 😂 We both know you'd make a weird face. And then you'd take a close-up of my eyes 👁️👁️",
        no: "Right, normal pictures are boring. Weirdo pictures only 🤪 — and close-ups of people's eyes 👁️",
        dodge: 1,
    },
    {
        label: "Stage 19 · The proof",
        emoji: "🧠",
        question: "So… do you believe me now that I remember every single detail?",
        subtitle: "",
        timeline: true,
        yes: "I told you. Every date, every like, every dislike. It's all still here 🧠❤️",
        no: "Scroll up and read that list again 😂 I remember every single detail about you.",
        dodge: 5,
        party: "yes",
    },
    {
        label: "The last page",
        emoji: "📖",
        question: "Do you want to start a brand new page?",
        subtitle: "<span class=\"hand\">Keep moving forward…</span><br>No tricks on this one. The NO button stays still — your answer is yours.",
        yes: "This is the best answer I've ever gotten. 🥹 A brand new page it is — I'll be waiting for your message ❤️",
        no: "That's okay. Thank you for reading until the end. I just wanted you to know that I remember every single detail — and I always will 🤍",
        dodge: 0,
        party: "yes",
        final: true,
    },
];

const timelineItems = [
    ["23/07/2023", "We met 👀"],
    ["04/09", "Your birthday 🎂"],
    ["10/09/2023", "We started talking 💬"],
    ["29/09/2023", "First hangout 🚶‍♀️"],
    ["07/10/2023", "Second hangout ✌️"],
    ["13/10/2023", "We started dating 💘"],
    ["14/10/2023", "First date as a couple 🍽️"],
    ["Top 3", "Scooby Doo, Meet the Robinsons, Aladdin 📺"],
    ["Love", "Cartoon socks, laptop stickers, chicken, gummy bears, food (all of it), weirdo pictures, photos of people's eyes, Red Bull, bracelets"],
    ["Hate", "Mint gum, hanging out too much, being sociable, earrings, washing the dishes"],
];

/* =========================================================
   State
   ========================================================= */
let current = 0;
let dodgesLeft = 0;
const answers = []; // { stage, question, answer }
let sent = false;

try {
    // fresh run each time she opens the site
    localStorage.removeItem("maria_answers");
} catch (e) { /* storage may be blocked — not needed to work */ }

/* =========================================================
   Rendering
   ========================================================= */
function render() {
    const s = stages[current];
    resetNoButton();
    dodgesLeft = s.dodge || 0;

    $("progressBar").style.width = (current / stages.length) * 100 + "%";
    $("stageLabel").textContent = s.label;
    $("emoji").textContent = s.emoji;
    $("question").textContent = s.question;

    const sub = $("subtitle");
    sub.innerHTML = s.subtitle;
    if (s.timeline) {
        const ul = document.createElement("ul");
        ul.className = "timeline";
        timelineItems.forEach(([date, text], i) => {
            const li = document.createElement("li");
            li.style.animationDelay = i * 0.15 + "s";
            li.innerHTML = "<b>" + date + "</b><span>" + text + "</span>";
            ul.appendChild(li);
        });
        sub.innerHTML = "";
        sub.appendChild(ul);
    }

    buttons.classList.remove("hidden");
    reaction.classList.add("hidden");

    card.classList.remove("swap");
    void card.offsetWidth; // restart animation
    card.classList.add("swap");
}

function answer(choice) {
    const s = stages[current];
    answers.push({ stage: s.label, question: s.question, answer: choice });
    try {
        localStorage.setItem("maria_answers", JSON.stringify(answers));
    } catch (e) { /* ignore */ }

    resetNoButton();
    buttons.classList.add("hidden");
    reactionText.textContent = choice === "YES" ? s.yes : s.no;
    reaction.classList.remove("hidden");
    nextBtn.textContent = s.final ? "See my answers 📋" : "Next ➜";

    const want = s.party;
    if (want === "both" || (want === "yes" && choice === "YES") || (want === "no" && choice === "NO")) {
        burstConfetti(s.final ? 260 : 120);
    } else {
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
    }

    if (s.final) sendAnswers();
}

function next() {
    if (current < stages.length - 1) {
        current++;
        render();
    } else {
        showResults();
    }
}

/* ---------- final results page ---------- */
function showResults() {
    $("progressBar").style.width = "100%";
    $("stageLabel").textContent = "Your answers";
    $("emoji").textContent = "📋";
    $("question").textContent = "Here's everything you answered";

    const sub = $("subtitle");
    sub.innerHTML = "";
    const ul = document.createElement("ul");
    ul.className = "answers";
    answers.forEach((a) => {
        const li = document.createElement("li");
        const q = document.createElement("span");
        q.textContent = a.question;
        const tag = document.createElement("span");
        tag.className = "tag " + a.answer.toLowerCase();
        tag.textContent = a.answer;
        li.append(q, tag);
        ul.appendChild(li);
    });
    sub.appendChild(ul);

    if (CONFIG.whatsappNumber) {
        const btn = document.createElement("button");
        btn.className = "btn yes";
        btn.textContent = "Send my answers to him 💬";
        btn.onclick = () => {
            const url = "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(answersAsText());
            window.open(url, "_blank");
        };
        sub.appendChild(btn);
    }

    const status = document.createElement("p");
    status.className = "send-status";
    status.id = "sendStatus";
    status.textContent = sent ? "Your answers were sent 💌" : "";
    sub.appendChild(status);

    buttons.classList.add("hidden");
    reaction.classList.add("hidden");
    card.classList.remove("swap");
    void card.offsetWidth;
    card.classList.add("swap");
}

function answersAsText() {
    return "Maria's answers 💌\n\n" +
        answers.map((a, i) => (i + 1) + ". " + a.question + " → " + a.answer).join("\n");
}

/* ---------- sending the answers to you ---------- */
function sendAnswers() {
    if (sent || !CONFIG.formsubmitEmail) return;
    const final = answers[answers.length - 1];
    fetch("https://formsubmit.co/ajax/" + encodeURIComponent(CONFIG.formsubmitEmail), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
            _subject: "Maria answered: " + (final ? final.answer : "?") + " to a brand new page 💌",
            _template: "box",
            "Final answer": final ? final.answer : "-",
            "All answers": answersAsText(),
        }),
    })
        .then((r) => {
            if (!r.ok) throw new Error("bad response");
            sent = true;
            const st = $("sendStatus");
            if (st) st.textContent = "Your answers were sent 💌";
        })
        .catch(() => { /* she can still use the WhatsApp button */ });
}

// If she closes the page halfway, still send whatever she answered so far.
window.addEventListener("pagehide", () => {
    if (sent || !CONFIG.formsubmitEmail || answers.length === 0) return;
    const data = new FormData();
    data.append("_subject", "Maria left the site after " + answers.length + " answers");
    data.append("All answers", answersAsText());
    data.append("_captcha", "false");
    navigator.sendBeacon("https://formsubmit.co/" + encodeURIComponent(CONFIG.formsubmitEmail), data);
    sent = true;
});

/* =========================================================
   The runaway NO button 🏃‍♀️
   ========================================================= */
const teases = [
    "Nope, try again 😏",
    "Too slow! 🐢",
    "Are you sure about that? 🤨",
    "The NO button is shy 🙈",
    "Almost! 😂",
    "Hehe, not today 😜",
];

function dodge() {
    if (dodgesLeft <= 0) return false;
    dodgesLeft--;
    const pad = 20;
    const w = noBtn.offsetWidth;
    const h = noBtn.offsetHeight;
    const x = pad + Math.random() * (window.innerWidth - w - pad * 2);
    const y = pad + Math.random() * (window.innerHeight - h - pad * 2);
    noBtn.classList.add("runaway");
    noBtn.style.left = x + "px";
    noBtn.style.top = y + "px";
    noBtn.textContent = dodgesLeft > 0 ? teases[Math.floor(Math.random() * teases.length)] : "Fine… NO 🙄";
    return true;
}

function resetNoButton() {
    noBtn.classList.remove("runaway");
    noBtn.style.left = "";
    noBtn.style.top = "";
    noBtn.textContent = "NO";
}

noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("click", () => {
    if (dodge()) return; // it ran away instead of being clicked
    answer("NO");
});
yesBtn.addEventListener("click", () => answer("YES"));
nextBtn.addEventListener("click", next);

/* =========================================================
   Confetti 🎊
   ========================================================= */
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
    const colors = ["#ff6b8b", "#8b5cf6", "#3ccf91", "#ffd166", "#4cc9f0"];
    for (let i = 0; i < count; i++) {
        pieces.push({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: Math.random() * -14 - 4,
            size: 6 + Math.random() * 6,
            color: colors[Math.floor(Math.random() * colors.length)],
            rot: Math.random() * Math.PI,
            vr: (Math.random() - 0.5) * 0.3,
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
        p.vy += 0.35;
        p.vx *= 0.99;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life++;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
    });
    pieces = pieces.filter((p) => p.y < canvas.height + 40 && p.life < 300);
    if (pieces.length) {
        requestAnimationFrame(tick);
    } else {
        animating = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

/* =========================================================
   Floating background emojis
   ========================================================= */
const floatEmojis = ["🐶", "🧸", "🍗", "🧦", "📸", "🥫", "📿", "💻", "🧞", "💕", "👁️", "🍟"];
function spawnFloater() {
    const el = document.createElement("span");
    el.className = "floater";
    el.textContent = floatEmojis[Math.floor(Math.random() * floatEmojis.length)];
    el.style.left = Math.random() * 100 + "vw";
    el.style.fontSize = 20 + Math.random() * 22 + "px";
    el.style.animationDuration = 9 + Math.random() * 8 + "s";
    $("floaters").appendChild(el);
    setTimeout(() => el.remove(), 18000);
}
setInterval(spawnFloater, 1200);
for (let i = 0; i < 6; i++) setTimeout(spawnFloater, i * 300);

/* start */
render();
