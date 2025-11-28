/* ============================================================
   🌌 1. 背景梦境粒子
============================================================ */
const bg = document.getElementById("bgCanvas");
const bgCtx = bg.getContext("2d");

function resize() {
    bg.width = window.innerWidth;
    bg.height = window.innerHeight;
}
resize();
window.onresize = resize;

let bgParticles = [];
for (let i = 0; i < 150; i++) {
    bgParticles.push({
        x: Math.random() * bg.width,
        y: Math.random() * bg.height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.4 + 0.3
    });
}

function drawBackground() {
    bgCtx.clearRect(0,0,bg.width,bg.height);
    for (let p of bgParticles) {
        bgCtx.beginPath();
        bgCtx.fillStyle = `rgba(170,170,255,${p.alpha})`;
        bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
        bgCtx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > bg.width) p.vx *= -1;
        if (p.y < 0 || p.y > bg.height) p.vy *= -1;
    }
    requestAnimationFrame(drawBackground);
}
drawBackground();


/* ============================================================
   ✂ 2. 生成不规则撕裂形状 path
============================================================ */
function randomTearPath() {
    const points = [];
    const steps = 12;
    for (let i = 0; i <= steps; i++) {
        let px = i / steps;
        let py = Math.random() * 0.15 + (i % 2 ? 0.85 : 0.65);
        points.push(`${px.toFixed(3)} ${py.toFixed(3)}`);
    }
    return `M0 0 L1 0 L1 1 L0 1 Z M${points.join(" L ")} Z`;
}

document.getElementById("tearPath").setAttribute("d", randomTearPath());


/* ============================================================
   💫 3. 粒子沿撕裂边缘飞散
============================================================ */
const glow = document.getElementById("glowCanvas");
const gCtx = glow.getContext("2d");

glow.width = 300;
glow.height = 300;

let glowParticles = [];
for (let i = 0; i < 40; i++) {
    glowParticles.push({
        x: Math.random() * glow.width,
        y: Math.random() * glow.height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        alpha: Math.random() * 0.7 + 0.3
    });
}

function drawGlow() {
    gCtx.clearRect(0,0,glow.width,glow.height);
    for (let p of glowParticles) {
        gCtx.beginPath();
        gCtx.fillStyle = `rgba(200,200,255,${p.alpha})`;
        gCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
        gCtx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > glow.width) p.vx *= -1;
        if (p.y < 0 || p.y > glow.height) p.vy *= -1;
    }
    requestAnimationFrame(drawGlow);
}
drawGlow();


/* ============================================================
   🌀 4. 图片切换（左/右碎片）
============================================================ */
const images = ["images/p1.jpg", "images/p2.jpg", "images/p3.jpg"];
let current = 0;

const centerImg = document.getElementById("memory-img");
const leftFrag = document.getElementById("side-left");
const rightFrag = document.getElementById("side-right");

function updateFragments() {
    centerImg.src = images[current];
    leftFrag.style.backgroundImage =
        `url(${images[(current - 1 + images.length) % images.length]})`;
    rightFrag.style.backgroundImage =
        `url(${images[(current + 1) % images.length]})`;
}
updateFragments();

leftFrag.onclick = () => {
    current = (current - 1 + images.length) % images.length;
    document.getElementById("tearPath").setAttribute("d", randomTearPath());
    updateFragments();
};

rightFrag.onclick = () => {
    current = (current + 1) % images.length;
    document.getElementById("tearPath").setAttribute("d", randomTearPath());
    updateFragments();
};


/* ============================================================
   🎤 5. 语音识别（点击开始→再点击结束）
============================================================ */
let recognition = null;
let listening = false;
let conversation = []; // 用于生成日志

const diaryText = document.getElementById("diaryText");
const micBtn = document.getElementById("mic-button");

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
}

micBtn.onclick = () => {
    if (!recognition) {
        alert("你的浏览器不支持语音识别（建议使用 Chrome）");
        return;
    }

    if (!listening) {
        listening = true;
        micBtn.style.background = "rgba(255,120,120,0.4)";
        diaryText.value = "🎤 正在听你说...\n";
        recognition.start();

        recognition.onresult = (e) => {
            const text = e.results[0][0].transcript;
            diaryText.value += `你说：${text}\n`;

            // 存入对话
            conversation.push({ you: text });

            // AI 自动回复
            const reply = aiReply(text);
            diaryText.value += `回声：${reply}\n\n`;

            conversation.push({ ai: reply });
        };

    } else {
        listening = false;
        micBtn.style.background = "rgba(255,255,255,0.25)";
        recognition.stop();
    }
};


/* ============================================================
   💬 6. AI 温柔文学风回答（本地生成，无需服务器）
============================================================ */
function aiReply(text) {
    const replies = [
        `你刚说的每一个字，都像是落进夜色里的微光。我听见了，也在陪着你。`,
        `你大概没有察觉，你说这句话时情绪轻轻颤了一下，很真实，也很动人。`,
        `你的心事不重，只是你一个人拿得太久了。你愿意的话，我可以一直听。`,
        `你这样说的时候，我突然觉得你是离星光最近的人之一。`,
        `我能感到你现在的心跳变得柔软了些，那很好，你正在慢慢放松。`,
        `谢谢你愿意告诉我这些，我把它们放在梦境里最柔软的角落里。`
    ];
    return replies[Math.floor(Math.random() * replies.length)];
}


/* ============================================================
   📝 7. 自动生成治愈梦境日志
============================================================ */
function generateDiary() {
    let lines = [];

    lines.push("🌙 梦境治愈日志\n");
    lines.push("——————————————\n");

    conversation.forEach(msg => {
        if (msg.you) lines.push(`你：${msg.you}\n`);
        if (msg.ai) lines.push(`回声：${msg.ai}\n`);
    });

    lines.push(`
在所有这些轻声的对话里，
我看到你像在黑夜中慢慢摸到一束柔软的光。
你的情绪不是负担，而是让你成为你自己的风。
而今晚的风里，有光，也有你。

愿你带着这份轻柔继续向前，
愿黎明来的时候，你已经不再害怕。
`);

    diaryText.value = lines.join("");
}

document.getElementById("copyDiary").onclick = () => {
    generateDiary();
    diaryText.select();
    document.execCommand("copy");
    alert("日记已复制🌙");
};

document.getElementById("saveDiary").onclick = () => {
    generateDiary();
    const blob = new Blob([diaryText.value], {type: "text/plain"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `梦境治愈日志-${Date.now()}.txt`;
    a.click();
};
