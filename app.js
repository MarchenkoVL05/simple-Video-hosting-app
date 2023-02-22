import express from "express";
const app = express();
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import mongoose from "mongoose";

import Lesson from "./models/lesson.js";

mongoose.set("strictQuery", false);

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

mongoose
  .connect(
    "mongodb+srv://vladimir:KMeu1oBRcXHnVGnU@cluster0.4jqdqhf.mongodb.net/simpleCourses?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB", err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Доступ к страницам
const checkQueryPassword = (req, res, next) => {
  const password = "aksioma";
  if ((req.path === "/" || req.path === "/all") && req.query.password !== password) {
    res.sendFile(path.join(__dirname, "views", "noAllow.html"));
    return;
  }
  next();
};

// Все уроки
app.get("/all", checkQueryPassword, async (req, res) => {
  try {
    const lessons = await Lesson.find();
    if (!lessons) return res.status(404).send("Уроки не найдены");
    res.sendFile(path.join(__dirname, "views", "all.html"));
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(__dirname, "views", "404.html"));
  }
});

app.get("/api/all", async (req, res) => {
  try {
    const lessons = await Lesson.find();
    if (!lessons) return res.status(404).send("Уроки не найдены");
    res.json(lessons);
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(__dirname, "views", "404.html"));
  }
});

app.get("/", checkQueryPassword, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.post("/create-lesson", upload.single("video"), async (req, res) => {
  const lesson = new Lesson({
    title: req.body.title,
    description: req.body.description,
    videoUrl: "/uploads/" + req.file.filename,
  });
  await lesson.save();
  res.redirect("/" + lesson._id);
});

// Удаление урока
app.delete("/api/all/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndRemove(req.params.id);
    if (!lesson) return res.status(404).send("Урок не найден");

    const filePath = path.join(__dirname, "public", lesson.videoUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.error(`Ошибка удаления файла: ${err}`);
    });

    res.send(lesson);
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(__dirname, "views", "404.html"));
  }
});

// Один урок
app.get("/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).send("Lesson not found");
    res.sendFile(path.join(__dirname, "views", "lesson.html"));
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(__dirname, "views", "404.html"));
  }
});

app.get("/api/lesson/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).send("Урок не найден");
    res.send(lesson);
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(__dirname, "views", "404.html"));
  }
});

app.use(function (req, res, next) {
  res.status(404).send("Не могу найти такую страницу!");
});

// 192.168.0.43
const port = process.env.PORT || 3000;
app.listen(port, "192.168.0.43", () => {
  console.log(`Server listening at http://192.168.0.43:${port}`);
});
