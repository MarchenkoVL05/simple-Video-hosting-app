import express from 'express';
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import mongoose from 'mongoose';

import Lesson from './models/lesson.js';

mongoose.set('strictQuery', false);

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

mongoose
  .connect(
    'mongodb+srv://vladimir:KMeu1oBRcXHnVGnU@cluster0.4jqdqhf.mongodb.net/simpleCourses?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB', err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

const checkQueryPassword = (req, res, next) => {
  const password = 'aksioma';
  if (req.path === '/' && req.query.password !== password) {
    res.sendFile(path.join(__dirname, 'views', 'noAllow.html'));
    return;
  }
  next();
};

app.get('/', checkQueryPassword, (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.post('/create-lesson', upload.single('video'), async (req, res) => {
  const lesson = new Lesson({
    title: req.body.title,
    description: req.body.description,
    videoUrl: '/uploads/' + req.file.filename,
  });
  await lesson.save();
  res.redirect('/' + lesson._id);
});

app.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).send('Lesson not found');
    res.sendFile(path.join(__dirname, 'views', 'lesson.html'));
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  }
});

app.get('/api/lesson/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).send('Урок не найден');
    res.send(lesson);
  } catch (error) {
    console.log(error);
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  }
});

app.use(function (req, res, next) {
  res.status(404).send('Не могу найти такую страницу!');
});

// 192.168.0.102
const port = process.env.PORT || 3000;
app.listen(port, '192.168.0.102', () => {
  console.log(`Server listening at http://192.168.0.102:${port}`);
});
