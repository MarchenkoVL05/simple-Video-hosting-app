window.addEventListener("DOMContentLoaded", () => {
  const lessonTitleEl = document.getElementById("lesson-title");
  const lessonDescriptionEl = document.getElementById("lesson-description");
  const lessonVideoEl = document.getElementById("lesson-video");

  const lessonId = window.location.pathname.slice(1);
  fetch(`/api/lesson/${lessonId}`)
    .then((res) => res.json())
    .then((lesson) => {
      lessonTitleEl.textContent = lesson.title;
      lessonDescriptionEl.textContent = lesson.description;
      lessonVideoEl.src = lesson.videoUrl;
    })
    .catch((err) => console.error("Error loading lesson", err));

  // Скорость видео
  let speeds = [0.5, 1, 1.5, 2];
  let currentSpeedIndex = 1;

  const speedButton = document.querySelector(".speed-button");

  speedButton.addEventListener("click", (e) => {
    currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;

    var newSpeed = speeds[currentSpeedIndex];

    lessonVideoEl.playbackRate = newSpeed;
    e.target.textContent = "Скорость: " + newSpeed + "x";
  });
});

document.addEventListener("contextmenu", (event) => event.preventDefault());
