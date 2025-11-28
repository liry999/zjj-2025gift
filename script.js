// =====================
// 1. 大门开启动画
// =====================
const gateLeft = document.querySelector(".gate-left");
const gateRight = document.querySelector(".gate-right");
const gateContainer = document.getElementById("gate-container");
const content = document.getElementById("content");
const clickHint = document.getElementById("click-hint");

let gateOpened = false;

gateContainer.onclick = () => {
    if (gateOpened) return;
    gateOpened = true;

    gateLeft.classList.add("gate-open-left");
    gateRight.classList.add("gate-open-right");
    clickHint.style.opacity = 0;

    setTimeout(() => {
        gateContainer.style.display = "none";
        content.classList.remove("hidden");
    }, 1800);
};


// =====================
// 2. 上传图片 → 呼吸动画
// =====================
const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");
const imgUpload = document.getElementById("imgUpload");

let artImage = null;
let t = 0;

imgUpload.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        artImage = new Image();
        artImage.src = reader.result;
    };
    reader.readAsDataURL(file);
};

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (artImage) {
        const scale = 1 + Math.sin(t) * 0.02;
        const w = 400 * scale;
        const h = 400 * scale;

        ctx.drawImage(
            artImage,
            canvas.width/2 - w/2,
            canvas.height/2 - h/2,
            w, h
        );
        t += 0.03;
    }
}

animate();


// =====================
// 3. 背景音乐上传
// =====================
let music = null;

document.getElementById("musicUpload").onchange = e => {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    music = new Audio(url);
};

document.getElementById("musicPlay").onclick = () => {
    if (music) music.play();
};

document.getElementById("musicPause").onclick = () => {
    if (music) music.pause();
};


// =====================
// 4. 语音识别
// =====================
let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.continuous = false;
}

document.getElementById("startVoice").onclick = () => {
    if (!recognition) {
        alert("当前浏览器不支持语音识别（推荐 Chrome）");
        return;
    }
    const voiceText = document.getElementById("voiceText");
    voiceText.innerHTML = "🎤 正在听你说…";

    recognition.start();
    recognition.onresult = (event) => {
        let text = event.results[0][0].transcript;
        voiceText.innerHTML = "你说：" + text;
    };
};


// =====================
// 5. 日记生成
// =====================
document.getElementById("makeDiary").onclick = () => {
    const voiceText = document.getElementById("voiceText").innerText.replace("你说：", "");
    const diaryOutput = document.getElementById("diaryOutput");

    if (!voiceText.trim()) {
        diaryOutput.innerHTML = "请先说点什么~";
        return;
    }

    diaryOutput.innerHTML = `
    🌙 <b>温柔治愈日记：</b><br><br>
    今天你说：“${voiceText}”。<br><br>
    在这扇大门之后，是一个只为你亮起的温柔空间。<br><br>
    愿今晚的风替我抱抱你，  
    愿你的情绪被世界温柔以待。
    `;
};
