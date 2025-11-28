/* ===============================
   🌌 1. 星空深度视差背景（纯JS生成）
================================ */
const starCanvas = document.getElementById("starfield");
const starCtx = starCanvas.getContext("2d");

function resizeCanvas() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let stars = [];
const STAR_COUNT = 230;

function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random()*starCanvas.width,
            y: Math.random()*starCanvas.height,
            size: Math.random()*1.5 + 0.5,
            speed: Math.random()*0.2 + 0.05,
            flicker: Math.random()*0.5 + 0.3,
            angle: Math.random()*360,
        });
    }
}

function drawStars() {
    starCtx.clearRect(0,0,starCanvas.width,starCanvas.height);
    for (let s of stars) {
        // 星星微光（非圆形）
        const spike = Math.sin(s.angle)*0.6 + 1;
        const alpha = Math.sin(s.angle*0.05)*0.3 + s.flicker;

        starCtx.fillStyle = `rgba(200,200,255,${alpha})`;
        starCtx.beginPath();
        starCtx.moveTo(s.x, s.y);
        starCtx.lineTo(s.x+spike, s.y-spike);
        starCtx.lineTo(s.x-spike, s.y+spike);
        starCtx.closePath();
        starCtx.fill();

        s.x -= s.speed;
        s.angle += 2;

        if (s.x < 0) s.x = starCanvas.width;
    }
    requestAnimationFrame(drawStars);
}

initStars();
drawStars();


/* ============================================
   🍃 2. 粒子飞散（图片边缘破碎）中等破碎等级
============================================ */
const particleCanvas = document.getElementById("particleCanvas");
const particleCtx = particleCanvas.getContext("2d");
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

let particles = [];

function spawnParticle(x, y) {
    particles.push({
        x, y,
        vx: (Math.random()-0.5)*1.8,
        vy: (Math.random()-0.5)*1.8,
        alpha: 1,
        size: Math.random()*2 + 1,
        hue: Math.random()*50 + 200
    });
}

function drawParticles() {
    particleCtx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
    particles = particles.filter(p => p.alpha > 0);

    for (let p of particles) {
        particleCtx.fillStyle = `hsla(${p.hue}, 70%, 80%, ${p.alpha})`;
        particleCtx.beginPath();
        particleCtx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        particleCtx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.015;
    }

    requestAnimationFrame(drawParticles);
}
drawParticles();


/* ============================================
   🖼 3. 图片撕裂破碎边缘 mask（梦境版）
============================================ */
const fragmentCanvas = document.getElementById("fragmentCanvas");
const fragCtx = fragmentCanvas.getContext("2d");
fragmentCanvas.width = 380;
fragmentCanvas.height = 380;

let currentImage = null;

/* 生成撕裂形状 */
function getIrregularMaskPath() {
    const w = fragmentCanvas.width;
    const h = fragmentCanvas.height;

    fragCtx.beginPath();
    fragCtx.moveTo(0, h*0.2);

    for (let x = 0; x <= w; x += 40) {
        let y = h/2 + Math.sin(x*0.1)*30 + (Math.random()*20-10);
        fragCtx.lineTo(x, y);
    }

    fragCtx.lineTo(w, h*0.8);
    fragCtx.lineTo(0, h);

    fragCtx.closePath();
}

/* 绘制撕裂碎片并触发粒子 */
function renderFragment() {
    if (!currentImage) return;

    fragCtx.clearRect(0,0,fragmentCanvas.width, fragmentCanvas.height);

    fragCtx.save();

    // mask
    getIrregularMaskPath();
    fragCtx.clip();

    // draw img
    fragCtx.drawImage(currentImage, 0, 0, fragmentCanvas.width, fragmentCanvas.height);

    fragCtx.restore();

    // 边缘发粒子
    for (let i = 0; i < 6; i++) {
        let x = Math.random()*fragmentCanvas.width + (window.innerWidth/2 - 190);
        let y = (window.innerHeight/2 - 190) + Math.random()*fragmentCanvas.height;
        spawnParticle(x, y);
    }
}

/* 无限次动画刷新 */
function animateFragments() {
    renderFragment();
    requestAnimationFrame(animateFragments);
}
animateFragments();

/* ============================================
   📂 4. 上传任意数量图片
============================================ */
const uploadInput = document.getElementById("imgUpload");
let memoryImages = [];
let memoryIndex = 0;

;(()=>{
    const defaults = ["images/p1.jpg","images/p2.jpg","images/p3.jpg"];
    for (let url of defaults) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
            memoryImages.push(img);
            if (!currentImage) currentImage = img;
        }
    }
})();

uploadInput.addEventListener("change", async e => {
    const files = Array.from(e.target.files);

    for (const file of files) {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        await new Promise(r => img.onload = r);
        memoryImages.push(img);
    }

    if (!currentImage && memoryImages.length > 0) {
        currentImage = memoryImages[0];
    }
});


/* ============================================
   🎤 5. 麦克风 + Web Speech
============================================ */
let recognition = null;
try {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
} catch (e) {
    console.log("浏览器不支持语音");
}

const micBtn = document.getElementById("mic-button");
const logBox = document.getElementById("dialogue-log");
const diaryBox = document.getElementById("diaryText");

micBtn.onclick = () => {
    if (!recognition) {
        alert("请使用 Chrome 浏览器体验语音对话");
        return;
    }

    recognition.start();
    appendLog("（倾听中…）");
};

recognition.onresult = e => {
    let text = e.results[0][0].transcript;
    appendLog("你：" + text);
    askAI(text);
};


/* ============================================
   💬 6. 单张图片独立对话 + AI 日记生成
============================================ */
let apiKey = "";
document.getElementById("apiKeyInput").onchange = e => {
    apiKey = e.target.value.trim();
};

function appendLog(msg) {
    logBox.innerHTML += `<div>${msg}</div>`;
    logBox.scrollTop = logBox.scrollHeight;
}

/* AI 调用 */
async function askAI(userText) {
    if (!apiKey) {
        appendLog("（请先输入 API Key）");
        return;
    }

    const prompt = `
你是一个温柔、梦境、文学、治愈混合人格的“梦境碎片守望者”。
当前图片是第 ${memoryIndex+1} 张记忆碎片，请根据用户的话做出温柔、哲学、亲密但不暧昧的回答。

用户说：${userText}
`;

    appendLog("AI：思考中…");

    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type":"application/json",
            "Authorization":`Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model:"gpt-4o-mini",
            messages:[{role:"user", content:prompt}]
        })
    });

    const data = await res.json();
    let reply = data.choices?.[0]?.message?.content || "（AI 无回复）";

    appendLog("AI：" + reply);

    // 更新日记（根据对话实时生成）
    diaryBox.value = 
`【梦境碎片 #${memoryIndex+1}】

你说：
${userText}

梦境回应你：
${reply}

这些话语被轻轻放进今晚的黑夜里，
成为你独有的一段温柔记忆。
`;
}

/* ============================================
   💾 7. 保存日记
============================================ */
document.getElementById("saveMemory").onclick = () => {
    const blob = new Blob([diaryBox.value], {type:"text/plain"});
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `memory-${memoryIndex+1}.txt`;
    a.click();
};
