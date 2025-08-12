import express from 'express';
import { requireAuth } from './auth.js';
import { readData, writeData } from './storage.js';
import { generateId } from './utils.js';
import { addUser, getUsers } from './users.js';

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

let allowFirstUser = false;

getUsers().then((users) => {
  allowFirstUser = users.length === 0;
});

function adminRouter(name: string) {
  const router = express.Router();

  router.get('/', async (_req, res) => {
    const data = await readData(name);
    res.json(data);
  });

  router.post('/', async (req, res) => {
    if (!req.user || req.user.role !== 'superadmin') {
      return res.status(403).send('Forbidden');
    }
    const items = await readData(name);
    const item = { id: generateId(), ...req.body };
    items.push(item);
    await writeData(name, items);
    res.status(201).json(item);
  });

  router.put('/:id', async (req, res) => {
    if (!req.user || req.user.role !== 'superadmin') {
      return res.status(403).send('Forbidden');
    }
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
    if (!req.user || req.user.role !== 'superadmin') {
      return res.status(403).send('Forbidden');
    }
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

app.get('/admin/users', async (req, res) => {
  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).send('Forbidden');
  }
  const users = await getUsers();
  res.json(users.map(({ id, username, role }) => ({ id, username, role })));
});

app.post('/admin/users', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) {
    return res.status(400).send('username and password required');
  }

  if (allowFirstUser) {
    const user = await addUser(username, password, 'superadmin');
    allowFirstUser = false;
    return res.status(201).json({ id: user.id, username: user.username, role: user.role });
  }

  if (!req.user || req.user.role !== 'superadmin') {
    return res.status(403).send('Forbidden');
  }

  const user = await addUser(username, password, role || 'user');
  res.status(201).json({ id: user.id, username: user.username, role: user.role });
});

const port = process.env.PORT || 4000;
app.listen(port, async () => {
  const users = await getUsers();
  if (users.length === 0) {
    allowFirstUser = true;
  }
  console.log(`CMS server listening on ${port}`);
});
