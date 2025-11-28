/* ================ 0. 加载图片 ================ */
let images = ["images/p1.jpg", "images/p2.jpg", "images/p3.jpg"];
let current = 0;

/* 自动显示三张 */
const mainImg = document.getElementById("memory-img");
const leftFrag = document.getElementById("side-left");
const rightFrag = document.getElementById("side-right");

function updateFragments() {
    mainImg.src = images[current];
    leftFrag.style.backgroundImage = `url(${images[(current - 1 + images.length)%images.length]})`;
    rightFrag.style.backgroundImage = `url(${images[(current + 1)%images.length]})`;
}
updateFragments();

/* 左右切换 */
leftFrag.onclick = () => { current = (current - 1 + images.length)%images.length; updateFragments(); };
rightFrag.onclick = () => { current = (current + 1)%images.length; updateFragments(); };

/* ================ 1. 星空背景 ================ */

const starCanvas = document.getElementById("starCanvas");
const sctx = starCanvas.getContext("2d");

function resize() {
    starCanvas.width = innerWidth;
    starCanvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

let stars = [];
for (let i = 0; i < 150; i++) stars.push({
    x: Math.random()*innerWidth,
    y: Math.random()*innerHeight,
    r: Math.random()*1.8,
    s: Math.random()*0.6 + 0.2
});

function drawStars() {
    sctx.clearRect(0,0,innerWidth,innerHeight);
    for (let s of stars) {
        sctx.fillStyle = `rgba(180,180,255,0.9)`;
        sctx.shadowBlur = 8;
        sctx.shadowColor = "#99f";
        sctx.beginPath();
        sctx.moveTo(s.x, s.y);
        sctx.lineTo(s.x + s.r, s.y + s.r*2);
        sctx.lineTo(s.x - s.r, s.y + s.r*2);
        sctx.closePath();
        sctx.fill();

        s.y += s.s;
        if (s.y > innerHeight) s.y = -20;
    }
    requestAnimationFrame(drawStars);
}
drawStars();

/* ================ 2. 图片不规则碎裂 mask + 粒子边缘 ================ */

const maskCanvas = document.getElementById("maskCanvas");
const mctx = maskCanvas.getContext("2d");

function randomPoints() {
    let pts = [];
    for (let i=0;i<24;i++){
        let angle = (i/24)*Math.PI*2;
        let radius = 150 + Math.random()*20*(Math.random()>0.5?1:-1);
        pts.push({
            x: 150 + radius*Math.cos(angle),
            y: 150 + radius*Math.sin(angle)
        });
    }
    return pts;
}

let pts = randomPoints();

function drawMask(){
    maskCanvas.width = 300;
    maskCanvas.height = 300;
    mctx.clearRect(0,0,300,300);

    mctx.beginPath();
    mctx.moveTo(pts[0].x, pts[0].y);
    for (let p of pts) mctx.lineTo(p.x, p.y);
    mctx.closePath();

    mctx.strokeStyle = "rgba(200,200,255,0.8)";
    mctx.shadowColor = "#ccf";
    mctx.shadowBlur = 15;
    mctx.lineWidth = 3;
    mctx.stroke();
}
drawMask();

/* ================ 3. 连续对话（恋爱式梦境人格） ================ */

let diary = "";
let mic = document.getElementById("mic-icon");
let diaryBox = document.getElementById("diaryText");

let reco = null;
if ('webkitSpeechRecognition' in window){
    reco = new webkitSpeechRecognition();
    reco.lang = "zh-CN";
}

mic.onclick = () => {
    if(!reco){ alert("请使用手机或 Chrome"); return; }

    diaryBox.value = "正在聆听你...\n";
    reco.start();

    reco.onresult = e => {
        let text = e.results[0][0].transcript;
        diary += generateReply(text) + "\n\n";
        diaryBox.value = diary;
    };
};

function generateReply(text){
    let replyTemplates = [
        `“${text}”啊…  
你说话的声音里，有一种温柔的力量。  
就像夜空慢慢裂开，露出一线安静的光。`,

        `听见你说“${text}”的时候，  
我突然觉得，记忆这件事真浪漫。  
因为它把你的情绪妥善地藏在柔软的地方。`,

        `原来你今天心里装着“${text}”。  
谢谢你愿意说给我听。  
你所有的感受，都值得被轻轻接住。`
    ];
    return replyTemplates[Math.floor(Math.random()*replyTemplates.length)];
}

/* ================ 4. Save Memory ================ */

document.getElementById("saveDiary").onclick = () => {
    const blob = new Blob([diary], {type:"text/plain"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "MemoryDiary.txt";
    a.click();
};
