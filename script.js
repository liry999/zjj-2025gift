// =============== 🚪 大门开启动画 ===============
const gateLeft = document.querySelector(".gate-left");
const gateRight = document.querySelector(".gate-right");
const gateContainer = document.getElementById("gate-container");
const content = document.getElementById("content");
const clickHint = document.getElementById("click-hint");

let gateOpened = false;

gateContainer.addEventListener("click", () => {
    if (gateOpened) return;
    gateOpened = true;

    // 左右两门打开
    gateLeft.classList.add("gate-open-left");
    gateRight.classList.add("gate-open-right");

    clickHint.style.opacity = 0;

    // 内容区显示
    setTimeout(() => {
        content.classList.remove("hidden");
        gateContainer.style.display = "none";
    }, 1800);
});

/* ================================
   2. 图片上传 → 在画布呼吸动画
================================ */
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

/* ================================
   3. 背景音乐上传与控制
================================ */
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

/* ================================
   4. 语音识别 + 日记生成
================================ */
const voiceText = document.getElementById("voiceText");
const diaryOutput = document.getElementById("diaryOutput");

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

    voiceText.innerHTML = "🎤 正在听你说…";
    recognition.start();

    recognition.onresult = (event) => {
        let text = event.results[0][0].transcript;
        voiceText.innerHTML = "你说：" + text;
    };
};

/* ================================
   5. 生成治愈系日记
================================ */
document.getElementById("makeDiary").onclick = () => {
    const text = voiceText.innerText.replace("你说：", "").trim();

    if (!text) {
        diaryOutput.innerHTML = "请先说点什么~";
        return;
    }

    diaryOutput.innerHTML = `
        <p style="line-height:1.8;">
        🌙 <b>温柔治愈日记：</b><br><br>
        今天的你说：“${text}”。<br><br>
        在这面从静默中开启的玛利亚之墙后，  
        藏着一个温柔的世界，也藏着你悄悄的心事。<br><br>
        愿这些轻轻的话语，被夜风听见；  
        愿你的每一份情绪，都被善良温柔地接住。<br><br>
        世界辽阔，而你值得一切柔光与善意。  
        </p>
    `;
};
