/* ============================================
   ✨ 1. 深空粒子背景（带视差+拖尾）
============================================ */
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

// 多层粒子
let layers = [];
for (let d = 1; d <= 3; d++) {
    let arr = [];
    for (let i = 0; i < 80; i++)
        arr.push({
            x: Math.random()*canvas.width,
            y: Math.random()*canvas.height,
            s: Math.random()*2 + d,
            dx: (Math.random()-0.5) * (0.1*d),
            dy: (Math.random()-0.5) * (0.1*d)
        });
    layers.push(arr);
}

function drawBG() {
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    layers.forEach(layer => {
        ctx.fillStyle = "rgba(180,180,255,0.8)";
        layer.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.s,0,Math.PI*2);
            ctx.fill();
            p.x+=p.dx; p.y+=p.dy;
            if(p.x<0||p.x>canvas.width) p.dx*=-1;
            if(p.y<0||p.y>canvas.height) p.dy*=-1;
        });
    });

    requestAnimationFrame(drawBG);
}
drawBG();


/* ============================================
   🌟 2. 3D 星环（多图自动旋转）
============================================ */
let imgs = [
    "images/p1.jpg",
    "images/p2.jpg",
    "images/p3.jpg"
];

const ring = document.getElementById("star-ring");

function createStarRing() {
    const count = imgs.length;
    const angleStep = 360 / count;

    for (let i = 0; i < count; i++) {
        let img = document.createElement("img");
        img.src = imgs[i];
        img.className = "star-img";

        let angle = angleStep * i;
        img.style.transform =
            `rotateY(${angle}deg) translateZ(240px)`;

        ring.appendChild(img);
    }
}
createStarRing();

// 自动旋转
let rotation = 0;
function rotateRing() {
    rotation += 0.2;
    ring.style.transform =
        `translate(-50%, -50%) rotateY(${rotation}deg)`;
    requestAnimationFrame(rotateRing);
}
rotateRing();


/* ============================================
   🎤 3. 麦克风语音生成日记
============================================ */
let recognition;
const diary = document.getElementById("diary");
const micBtn = document.getElementById("micBtn");

if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "zh-CN";

    recognition.onresult = e => {
        const text = e.results[0][0].transcript;
        diary.innerHTML =
            `🌙 <b>梦境回廊日志</b><br><br>
            你轻轻说：<b>“${text}”</b><br><br>
            那句话像一颗缓慢飘落的星，
            被这个梦境温柔收藏。
            `;
    };
}

micBtn.onclick = () => {
    if (!recognition) return alert("浏览器不支持语音识别🙏");
    recognition.start();
};
v
