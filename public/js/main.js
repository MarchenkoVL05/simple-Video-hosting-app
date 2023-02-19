window.addEventListener('DOMContentLoaded', () => {
  const lessonTitleEl = document.getElementById('lesson-title');
  const lessonDescriptionEl = document.getElementById('lesson-description');
  const lessonVideoEl = document.getElementById('lesson-video');

  const lessonId = window.location.pathname.slice(1);
  fetch(`/api/lesson/${lessonId}`)
    .then((res) => res.json())
    .then((lesson) => {
      lessonTitleEl.textContent = lesson.title;
      lessonDescriptionEl.textContent = lesson.description;
      lessonVideoEl.src = lesson.videoUrl;
    })
    .catch((err) => console.error('Error loading lesson', err));
});

document.addEventListener('contextmenu', (event) => event.preventDefault());

console.log(window.location.href);
