/* ============================================================
   星空粒子背景（自动生成）
============================================================ */
const starCanvas = document.getElementById("starfield");
const starCtx = starCanvas.getContext("2d");

function resizeStarField() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
}
resizeStarField();
window.addEventListener("resize", resizeStarField);

let stars = [];
for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * starCanvas.width,
        y: Math.random() * starCanvas.height,
        size: Math.random() * 2 + 0.3,
        glow: Math.random() * 0.8 + 0.2
    });
}

function drawStars() {
    starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach(s => {
        starCtx.beginPath();
        starCtx.fillStyle = `rgba(255,255,255,${s.glow})`;
        starCtx.shadowBlur = 8;
        starCtx.shadowColor = "#fff";
        starCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        starCtx.fill();
    });
    requestAnimationFrame(drawStars);
}
drawStars();

/* ============================================================
   图片系统：自动加载 + 上传 + 不规则闪光边缘
============================================================ */
const imageCanvas = document.getElementById("imageCanvas");
const ctx = imageCanvas.getContext("2d");
const uploadImage = document.getElementById("uploadImage");

let images = [
    "images/p1.jpg",
    "images/p2.jpg",
    "images/p3.jpg"
];
let currentIndex = 0;

/* 载入某张图 */
function loadImage(src) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
        drawBrokenDream(img);
    };
    img.src = src;
}
loadImage(images[0]);

/* 鼠标移动 → 左右切换 */
document.body.addEventListener("mousemove", (e) => {
    if (e.clientX < window.innerWidth * 0.3) {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        loadImage(images[currentIndex]);
    }
    if (e.clientX > window.innerWidth * 0.7) {
        currentIndex = (currentIndex + 1) % images.length;
        loadImage(images[currentIndex]);
    }
});

/* 上传图片 */
uploadImage.addEventListener("change", (e) => {
    if (e.target.files.length === 0) return;
    const reader = new FileReader();
    reader.onload = function (evt) {
        images.push(evt.target.result);
        currentIndex = images.length - 1;
        loadImage(images[currentIndex]);
    };
    reader.readAsDataURL(e.target.files[0]);
});

/* 绘制撕裂梦境效果 */
function drawBrokenDream(img) {
    ctx.clearRect(0, 0, imageCanvas.width, imageCanvas.height);

    let w = imageCanvas.width;
    let h = imageCanvas.height;

    // 不规则 mask（撕裂效果）
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(40, 20);
    ctx.lineTo(w - 60, 35);
    ctx.lineTo(w - 20, h / 2 - 40);
    ctx.lineTo(w - 50, h - 30);
    ctx.lineTo(50, h - 20);
    ctx.lineTo(20, h / 2 + 20);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();

    drawShiningEdges();
}

/* 星光碎裂边缘 */
function drawShiningEdges(intensity = 1) {
    let w = imageCanvas.width;
    let h = imageCanvas.height;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (let i = 0; i < 80 * intensity; i++) {
        let x = Math.random() * w;
        let y = Math.random() * h;
        let r = Math.random() * 1.8;

        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.7})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.restore();
}

/* ============================================================
   音量驱动粒子扩散
============================================================ */
let audioContext = null;
let analyser = null;
let dataArray = null;

function initVolumeAnalysis(stream) {
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    dataArray = new Uint8Array(analyser.frequencyBinCount);
}

function updateVolumeFlash() {
    if (!analyser) return;
    analyser.getByteFrequencyData(dataArray);
    let volume = dataArray.reduce((a, b) => a + b) / dataArray.length;
    drawShiningEdges(volume / 50);
    requestAnimationFrame(updateVolumeFlash);
}
updateVolumeFlash();

/* ============================================================
   麦克风录音 + OpenAI 对话（梦境文学人格）
============================================================ */
const micButton = document.getElementById("mic-button");
const dialogOutput = document.getElementById("dialog-output");

let mediaRecorder = null;
let chunks = [];
let isRecording = false;
let conversation = [];  // 用于生成最终日志

/* 梦境人格 Prompt */
const persona =
`你是一个“温柔梦境哲学碎片AI”，说话风格融合 A+B+C+D：
A. 治愈、轻柔、像夜晚抱着人心的风
B. 文学感、比喻多、像在梦中走路
C. 哲学、沉静、偶尔幽默但不跳脱
D. 恋爱系的温柔，但不暧昧，只是特别关心对方

你的每一句回复都像星光落在湖面，轻柔、短、但治愈。
`;

async function askOpenAI(text) {
    let key = localStorage.getItem("openai_key");
    if (!key) {
        dialogOutput.textContent = "❗ 请先在右下角输入你的 OpenAI API Key";
        return "（无 Key）";
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${key}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: persona },
                { role: "user", content: text }
            ]
        })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "……";
}

/* 录音控制 */
micButton.addEventListener("click", async () => {
    micButton.classList.add("sound-pulse");

    if (!isRecording) {
        // 开始录音
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        initVolumeAnalysis(stream);

        mediaRecorder = new MediaRecorder(stream);
        chunks = [];
        mediaRecorder.ondataavailable = e => chunks.push(e.data);
        mediaRecorder.onstop = onRecordingStop;
        mediaRecorder.start();

        dialogOutput.textContent = "（我在听，你慢慢说……）";
        isRecording = true;
    } else {
        // 停止录音
        mediaRecorder.stop();
        isRecording = false;
        dialogOutput.textContent = "（正在听懂你的话……）";
    }

    setTimeout(() => micButton.classList.remove("sound-pulse"), 300);
});

/* 录音结束 → 语音转换文字 → AI回复 */
async function onRecordingStop() {
    const blob = new Blob(chunks, { type: "audio/webm" });

    let key = localStorage.getItem("openai_key");
    if (!key) {
        dialogOutput.textContent = "❗ 请先在右下角输入你的 OpenAI API Key";
        return;
    }

    // Whisper 文本识别
    const form = new FormData();
    form.append("file", blob, "audio.webm");
    form.append("model", "gpt-4o-mini-tts");

    const textRes = await fetch("https://api.openai.com/v1/audio/transcriptions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}` },
        body: form
    });
    const textData = await textRes.json();
    const userText = textData.text || "（听不太清楚…）";

    dialogOutput.textContent = "你：" + userText;
    conversation.push("你：" + userText);

    // AI 回答
    const reply = await askOpenAI(userText);
    conversation.push("梦境的TA：" + reply);
    dialogOutput.textContent = reply;
}

/* ============================================================
   Save Memory：生成日志
============================================================ */
const saveButton = document.ge
