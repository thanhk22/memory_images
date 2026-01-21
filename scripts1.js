document.addEventListener("DOMContentLoaded", () => {
  const carousel = document.getElementById("carousel");

  fetch("./images.json")
    .then(res => res.json())
    .then(images => {
      const total = images.length + 12;

      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      const minScreen = Math.min(screenW, screenH);

      // 🖼️ kích thước ảnh phụ thuộc số lượng
      let imgSize = minScreen / Math.sqrt(total);

      // giới hạn để ảnh không quá to / quá nhỏ
      imgSize = Math.max(40, Math.min(imgSize, 60));

      // tính bán kính vòng tròn
      const radius = (total * imgSize) / (2 * Math.PI);

      const overlay = document.getElementById("overlay");
      let activeImg = null;

      images.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;

        img.style.width = img.style.height = imgSize + "px";

        const angle = (360 / total) * index;
        img.style.setProperty("--angle", `${angle}deg`);
        img.style.setProperty("--radius", `${radius}px`);
        img.style.setProperty("--delay", `-${index * 0.3}s`);

        img.addEventListener("click", (e) => {
          e.stopPropagation();

          // nếu click lại chính ảnh đang active → đóng
          if (img === activeImg) return;

          // đóng ảnh cũ (nếu có)
          if (activeImg) activeImg.classList.remove("active");

          // mở ảnh mới
          img.classList.add("active");
          overlay.classList.add("show");
          carousel.classList.add("paused");
          activeImg = img;
        });
        carousel.appendChild(img);
      });
      
      overlay.addEventListener("click", () => {
        if (activeImg) {
          activeImg.classList.remove("active");
          setTimeout(() => {
            overlay.classList.remove("show");
            carousel.classList.remove("paused");
            activeImg = null;
          }, 100);
        }
      });
    });
});
