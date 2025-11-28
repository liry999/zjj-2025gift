body {
    margin: 0;
    overflow: hidden;
    background: #000;
    font-family: "Zhi Mang Xing", "La Belle Aurore", cursive;
    user-select: none;
}

/* 🌌 多层星空 */
.stars {
    position: fixed;
    width: 200vw;
    height: 200vh;
    background-repeat: repeat;
    background-size: contain;
    z-index: -5;
    opacity: 0.6;
}
#stars-layer1 { background-image: url('https://i.imgur.com/Ott6z8H.png'); }
#stars-layer2 { background-image: url('https://i.imgur.com/6zHfV7f.png'); }
#stars-layer3 { background-image: url('https://i.imgur.com/U4f8Pq8.png'); }


/* 🎤 顶部控制条 */
#top-controls {
    position: fixed;
    top: 15px; left: 15px;
    display: flex;
    gap: 12px;
    z-index: 20;
}

#apiKeyInput {
    padding: 6px 12px;
    border: none;
    background: rgba(255,255,255,0.08);
    color: #fff;
    width: 260px;
    border-radius: 8px;
    outline: none;
}

/* 麦克风按钮（无填充线条风格） */
#mic-btn {
    width: 48px; height: 48px;
    position: relative;
    border: none;
    background: transparent;
    cursor: pointer;
}

.mic-circle {
    position: absolute;
    width: 48px; height: 48px;
    border: 2px solid #aaa;
    border-radius: 50%;
    transition: 0.2s;
}
.mic-icon {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -55%);
    width: 14px; height: 22px;
    border: 2px solid #aaa;
    border-radius: 8px;
    border-bottom: none;
}
.mic-icon::after {
    content: "";
    position: absolute;
    bottom: -6px; left: -6px;
    width: 22px; height: 6px;
    border-top: 2px solid #aaa;
}

/* 🌙 中心图像（撕裂边缘） */
#memory-container {
    position: fixed;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: 350px; height: 350px;
}

#memory-img {
    width: 100%; height: 100%;
    object-fit: cover;
    clip-path: polygon(
        12% 8%, 88% 5%, 95% 30%,
        100% 60%, 85% 95%, 20% 100%, 
        5% 70%, 0% 35%
    );
    border-radius: 4px;
    box-shadow: 0 0 28px rgba(255,255,255,0.35);
}

/* 星光扩散粒子层 */
#particleCanvas {
    position: absolute;
    top: 0; left: 0;
    width: 350px; height: 350px;
    pointer-events: none;
}

/* 左右导航 */
#left-nav, #right-nav {
    position: fixed;
    top: 50%;
    width: 140px; height: 140px;
    border-radius: 50%;
    opacity: 0.4;
    filter: blur(2px);
    background-size: cover;
    background-position: center;
    transition: 0.3s;
}
#left-nav {
    left: 6%;
}
#right-nav {
    right: 6%;
}

/* 文学对话框 */
#dialogue-box {
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    max-width: 700px;
    color: #eee;
    font-size: 22px;
    text-align: center;
    white-space: pre-line;
    line-height: 1.7;
    text-shadow: 0 0 6px rgba(255,255,255,0.5);
}

/* Save Memory 按钮（幽灵按钮） */
#saveBtn {
    position: fixed;
    bottom: 20px;
    right: 45px;
    padding: 8px 20px;
    font-size: 20px;
    border: none;
    color: #fff;
    cursor: pointer;
    opacity: 0.7;
    transition: .25s;
    font-family: "La Belle Aurore", cursive;
}
#saveBtn:hover {
    opacity: 1;
    transform: scale(1.08);
}
