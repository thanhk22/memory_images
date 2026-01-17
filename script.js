const carousel = document.getElementById("carousel");
const music = document.getElementById("bgm");

// fetch("images.json")
//   .then(res => res.json())
//   .then(images => {
//     const total = images.length;
//     const radius = 140;

//     images.forEach((src, i) => {
//       const img = document.createElement("img");
//       img.src = src;

//       const angle = (360 / total) * i;
//       img.style.transform = `
//         rotateY(${angle}deg)
//         translateZ(${radius}px)
//       `;

//       img.onclick = () => {
//         document.querySelectorAll("img").forEach(el => el.classList.remove("active"));
//         img.classList.add("active");
//         carousel.style.animationPlayState = "paused";
//       };

//       carousel.appendChild(img);
//     });
//   });

fetch("images.json")
  .then(res => res.json())
  .then(images => {
    const carousel = document.getElementById("carousel");
    const total = images.length;
    const radius = 140;

    images.forEach((src, i) => {
      const img = document.createElement("img");
      img.src = src;

      img.onerror = () => {
        console.error("Ảnh lỗi:", src);
      };

      const angle = (360 / total) * i;
      img.style.transform = `
        rotateY(${angle}deg)
        translateZ(${radius}px)
      `;

      carousel.appendChild(img);
    });
  })
  .catch(err => console.error("Không load được images.json", err));


// bật nhạc khi user chạm lần đầu
document.body.addEventListener("click", () => {
  music.play();
}, { once: true });
