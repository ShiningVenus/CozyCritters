import express from 'express';
import { requireAuth } from './auth.js';
import { readData, writeData } from './storage.js';
import { generateId } from './utils.js';

const app = express();
app.use(express.json());

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
