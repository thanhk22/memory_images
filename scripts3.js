document.addEventListener("DOMContentLoaded", () => {
    const bgm = document.getElementById("bgm");
    bgm.volume = 0.5;

    const carousel = document.getElementById("carousel");
    const overlay = document.getElementById("overlay");

    const btn = document.getElementById("toggleBtn");
    const memoryVideo = document.getElementById("memoryVideo");
    const space = document.querySelector(".space");
    const videoLayer = document.getElementById("videoLayer");
    memoryVideo.style.pointerEvents = "none";

    let activeImg = null;
    let isVideo = true;
    let videoUnlocked = false;

    const videoModeBtn = document.getElementById("videoModeBtn");
    let videoMode = "loop";
    memoryVideo.loop = true;

    // trạng thái ban đầu: video
    videoLayer.style.display = "flex";
    space.classList.add("hidden");

    bgm.pause();

    memoryVideo.muted = true;   // cần cho autoplay
    memoryVideo.play().catch(() => {});

    // gỡ mute sau click đầu tiên
    const unlockVideoAudio = async () => {
        if (videoUnlocked) return;
        if (!videoUnlocked) {
            memoryVideo.muted = false;
            memoryVideo.volume = 1;
            videoUnlocked = true;
            
            // Pause rồi play lại để tiếng phát lên
            const currentTime = memoryVideo.currentTime;
            memoryVideo.pause();
            memoryVideo.currentTime = currentTime;
            memoryVideo.play().catch(() => {});
        }
    };

    const unlockOnce = async () => {
        if (videoUnlocked) return;

        videoUnlocked = true;

        memoryVideo.pause();
        memoryVideo.muted = false;
        memoryVideo.volume = 1;

        try {
            await memoryVideo.play();
        } catch (e) {
            console.log("unlock failed", e);
        }
    };

    document.addEventListener("click", unlockOnce, { once: true });

    // Toggle video / carousel
    btn.addEventListener("click", async () => {
        isVideo = !isVideo;

        if (isVideo) {
            unlockVideoAudio();

            if (activeImg) {
                activeImg.classList.remove("active");
                carousel.classList.remove("paused");
                overlay.classList.remove("show");
                activeImg = null;
            }

            space.classList.add("hidden");
            videoLayer.style.display = "flex";
            space.style.display="none";

            bgm.pause();

            if (memoryVideo.paused) {
                memoryVideo.currentTime = 0;
                memoryVideo.play().catch(()=>{});
            }

            btn.textContent = "🌌";
        } else {
            space.style.display = "flex";
            memoryVideo.pause();
            videoLayer.style.display = "none";
            space.classList.remove("hidden");
            carousel.classList.remove("paused");
            
            bgm.play();
            btn.textContent = "🎥";
        }
    });

    // Kết thúc video -> quay lại vòng quay ảnh
    memoryVideo.addEventListener("ended", () => {
        if (videoMode === "once"){
            memoryVideo.pause();
            memoryVideo.currentTime = 0;
        }
    });

    // thiết lập chế độ phát video
    videoModeBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        if (videoMode === "loop") {
            videoMode = "once";
            memoryVideo.loop = false;
            videoModeBtn.classList.add("once");
        } else {
            videoMode = "loop";
            memoryVideo.loop = true;
            videoModeBtn.classList.remove("once");
        }
    });

    // Nhạc nền khi hiển thị vòng quay ảnh
    const startMusic = () => {
        if (isVideo) return;

        bgm.play().then(() => {
            // Sau khi nhạc đã phát thành công, gỡ bỏ sự kiện để tránh gọi lại nhiều lần
            space.removeEventListener("click", startMusic);
        }).catch (err => {
            console.log("Trình duyệt chặn tự động phát nhạc: ", err);
        })
    }

    space.addEventListener("click", startMusic);

    // vòng quay ảnh CAROUSEL
    fetch("./images.json")
        .then(res => res.json())
        .then(images => {
            // Để tạo khoảng cách, cộng thêm một số vị trí trống
            const total = images.length ; 

            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const minScreen = Math.min(screenW, screenH);

            let imgSize = minScreen / Math.sqrt(total);
            imgSize = Math.max(50, Math.min(imgSize, 70));

            const radius = (total * imgSize) / (2 * Math.PI) * 1.1;

            images.forEach((src, index) => {
                const img = document.createElement("img");
                img.src = src;
                img.style.width = img.style.height = imgSize + "px";

                const angle = (360 / total) * index;
                img.style.setProperty("--angle", `${angle}deg`);
                img.style.setProperty("--radius", `${radius}px`);
                img.style.setProperty("--delay", `-${index * (100 / total)}s`); // Chia tỷ lệ chính xác hơn

                img.addEventListener("click", (e) => {
                    e.stopPropagation();
                    if (activeImg === img) return;

                    if (activeImg) {
                        activeImg.style.width = imgSize + "px";
                        activeImg.style.height = imgSize + "px";
                        activeImg.classList.remove("active");
                    }

                    img.style.width = "";
                    img.style.height = "";

                    img.classList.add("active");
                    overlay.classList.add("show");
                    carousel.classList.add("paused");
                    activeImg = img;
                });

                carousel.appendChild(img);
            });
            
            // Hàm đóng ảnh
            const closeActiveImage = () => {

                if (activeImg){
                    activeImg.style.width = imgSize + "px";
                    activeImg.style.height = imgSize + "px";

                    activeImg.classList.remove("active");
                    overlay.classList.remove("show");

                    setTimeout(() => {
                        carousel.classList.remove("paused");
                        activeImg = null;
                    }, 600);
                } else return;
            }
            overlay.addEventListener("click", closeActiveImage);
            carousel.addEventListener("click", (e) => {
                if (e.target.classList.contains("active")) closeActiveImage();
            });
        });
});