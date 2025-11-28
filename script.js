/* ============================
   🌌 1. 粒子梦境背景
============================ */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.onresize = resizeCanvas;

let stars = [];
for (let i = 0; i < 150; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.2,
        dy: (Math.random() - 0.5) * 0.2
    });
}

function animate() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    stars.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        s.x += s.dx;
        s.y += s.dy;

        if (s.x < 0 || s.x > canvas.width) s.dx *= -1;
        if (s.y < 0 || s.y > canvas.height) s.dy *= -1;
    });

    requestAnimationFrame(animate);
}
animate();


/* ============================
   🌙 2. 图片轮播（多张图）
============================ */
let imgs = [
    "images/p1.jpg",
    "images/p2.jpg",
    "images/p3.jpg"
];

let index = 0;
const mainImg = document.getElementById("main-img");

function showImage() {
    mainImg.src = imgs[index];
}
showImage();

// 左右切换
document.getElementById("left-hint").onclick = () => {
    index = (index - 1 + imgs.length) % imgs.length;
    showImage();
};
document.getElementById("right-hint").onclick = () => {
    index = (index + 1) % imgs.length;
    showImage();
};


/* ============================
   📤 3. 上传图片加入梦境轮播
============================ */
document.getElementById("uploadImg").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    imgs.push(url);
    index = imgs.length - 1;
    showImage();
});


/* ============================
   🎤 4. 麦克风语音 + 日志生成
============================ */
let recognition;
let listening = false;
const micBtn = document.getElementById("micBtn");
const diaryOut = document.getElementById("diary-output");

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;

    recognition.onresult = event => {
        const text = event.results[0][0].transcript;

        diaryOut.innerHTML =
            "🌙 <b>梦境日志：</b><br><br>" +
            generateDiary(text);
    };
}

micBtn.onclick = () => {
    if (!recognition) return alert("你的浏览器不支持语音识别");

    if (!listening) {
        listening = true;
        micBtn.innerText = "🎤 录音中…";
        recognition.start();
    } else {
        listening = false;
        micBtn.innerText = "🎤";
        recognition.stop();
    }
};

/* 生成温柔治愈风日志 */
function generateDiary(text) {
    return `
    你刚才说：“${text}”。<br><br>
    在这个静悄悄的夜晚，你的心声像一片慢慢飘落的光，
    被梦境温柔地接住。<br><br>
    也许世界嘈杂、也许白昼漫长，
    但此刻，你的情绪被认真收藏，
    像一枚在记忆廊道里闪光的碎片。
    `;
}
