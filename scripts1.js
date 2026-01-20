// document.addEventListener("DOMContentLoaded", () => {
//   const carousel = document.getElementById("carousel");

//   fetch("./images.json")
//     .then(response => {
//       if (!response.ok) {
//         throw new Error("Không đọc được images.json");
//       }
//       return response.json();
//     })
//     .then(images => {
//       if (!Array.isArray(images) || images.length === 0) {
//         throw new Error("images.json rỗng hoặc sai format");
//       }

//       const total = images.length;
//       const radius = 140;

//       images.forEach((src, index) => {
//         const img = document.createElement("img");
//         img.src = src;
//         img.alt = "memory";

//         img.onload = () => {
//           console.log("Load OK:", src);
//         };

//         img.onerror = () => {
//           console.error("Ảnh lỗi:", src);
//         };

//         const angle = (360 / total) * index;
//         img.style.transform = `
//           rotateY(${angle}deg)
//           translateZ(${radius}px)
//         `;

//         carousel.appendChild(img);
//       });
//     })
//     .catch(error => {
//       console.error("LỖI:", error.message);
//     });
// });
// const carousel = document.getElementById("carousel");
// const music = document.getElementById("bgm");
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
      imgSize = Math.max(40, Math.min(imgSize, 130));

      // tính bán kính vòng tròn
      const radius = (total * imgSize) / (2 * Math.PI);

      images.forEach((src, index) => {
        const img = document.createElement("img");
        img.src = src;

        img.style.width = img.style.height = imgSize + "px";

        const angle = (360 / total) * index;
        img.style.setProperty("--angle", `${angle}deg`);
        img.style.setProperty("--radius", `${radius}px`);
        img.style.setProperty("--delay", `-${index * 0.3}s`);

        carousel.appendChild(img);
      });
    });
});
