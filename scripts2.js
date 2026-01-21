document.addEventListener("DOMContentLoaded", () => {
  const bgm = document.getElementById("bgm");
  bgm.volume = 0.5;
  const carousel = document.getElementById("carousel");
  const overlay = document.getElementById("overlay");
  let activeImg = null;

  const startMusic = () => {
    bgm.play().then(() => {
      // Sau khi nhạc đã phát thành công, gỡ bỏ sự kiện để tránh gọi lại nhiều lần
      document.removeEventListener("click", startMusic);
    }).catch (err => {
      console.log("Trình duyệt chặn tự động phát nhạc: ", err);
    })
  }

  document.addEventListener("click", startMusic);

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
        }
      }
      overlay.addEventListener("click", closeActiveImage);
      carousel.addEventListener("click", (e) => {
        if (e.target.classList.contains("active")) closeActiveImage();
      });
    });
});