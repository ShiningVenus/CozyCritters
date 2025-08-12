import express from 'express';
import rateLimit from 'express-rate-limit';
import { requireAuth } from './auth.js';
import { readData, writeData } from './storage.js';
import { generateId } from './utils.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// --- Minimal Upload Setup ---
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });
// --- End Upload Setup ---

const app = express();

// Enable trust proxy when behind a reverse proxy (e.g., production)
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// Basic rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);
app.use(express.json());

// --- Upload endpoint ---
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({
    filename: req.file.filename,
    url: `/uploads/${req.file.filename}`
  });
});

// --- Optionally serve uploaded files (uncomment line below if you want this) ---
// app.use('/uploads', express.static(uploadDir));

app.get('/moods', async (_req, res) => {
  const data = await readData('moods');
  res.json(data);
});

app.get('/games', async (_req, res) => {
  const data = await readData('games');
  res.json(data);
});

app.get('/pages', async (_req, res) => {
  const data = await readData('pages');
  res.json(data);
});

// Admin routes
app.use('/admin', requireAuth);

function adminRouter(name: string) {
  const router = express.Router();

  router.get('/', async (_req, res) => {
    const data = await readData(name);
    res.json(data);
  });

  router.post('/', async (req, res) => {
    const items = await readData(name);
    const item = { id: generateId(), ...req.body };
    items.push(item);
    await writeData(name, items);
    res.status(201).json(item);
  });

  router.put('/:id', async (req, res) => {
    const items = await readData<any>(name);
    const index = items.findIndex((i) => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).send('Not found');
    }
    items[index] = { ...items[index], ...req.body, id: req.params.id };
    await writeData(name, items);
    res.json(items[index]);
  });

  router.delete('/:id', async (req, res) => {
    const items = await readData<any>(name);
    const index = items.findIndex((i) => i.id === req.params.id);
    if (index === -1) {
      return res.status(404).send('Not found');
    }
    const [deleted] = items.splice(index, 1);
    await writeData(name, items);
    res.json(deleted);
  });

  return router;
}

app.use('/admin/moods', adminRouter('moods'));
app.use('/admin/games', adminRouter('games'));
app.use('/admin/pages', adminRouter('pages'));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`CMS server listening on ${port}`);
});
