window.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  fetch("/api/all")
    .then((res) => res.json())
    .then((lessons) => {
      lessons.forEach((lesson) => {
        const lessonTitleEl = document.createElement("div");
        lessonTitleEl.classList.add("grid__item");
        lessonTitleEl.textContent = lesson.title;
        grid.appendChild(lessonTitleEl);

        const lessonDescriptionEl = document.createElement("div");
        lessonDescriptionEl.classList.add("grid__item");
        lessonDescriptionEl.textContent = lesson.description;
        grid.appendChild(lessonDescriptionEl);

        const lessonLinkEl = document.createElement("div");
        lessonLinkEl.classList.add("grid__item");
        const lessonLink = document.createElement("a");
        lessonLink.href = `${window.location.protocol + "//" + window.location.host + "/" + lesson._id}`;
        lessonLink.textContent = `${window.location.protocol + "//" + window.location.host + "/" + lesson._id}`;
        lessonLinkEl.appendChild(lessonLink);
        grid.appendChild(lessonLinkEl);

        const removeLessonEl = document.createElement("div");
        removeLessonEl.classList.add("grid__item");
        const removeButton = document.createElement("button");
        removeButton.classList.add("grid__btn");
        removeButton.type = "button";
        removeButton.textContent = "Удалить";
        removeButton.onclick = () => {
          fetch(`/api/all/${lesson._id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => {
              if (res.ok) {
                alert("Урок успешно удалён");
                window.location.reload();
              } else {
                throw new Error("Не удалось удалить урок");
              }
            })
            .catch((err) => console.error(err));
        };
        removeLessonEl.appendChild(removeButton);

        grid.appendChild(removeLessonEl);
      });
    })
    .catch((err) => console.error("Ошибка при загрузке уроков", err));
});

document.addEventListener("contextmenu", (event) => event.preventDefault());
