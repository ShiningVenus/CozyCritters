import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import modRoutes from './mod';

test('creates a ban request', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/mod', modRoutes);

  const server = app.listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const port = (server.address() as any).port;

  const body = {
    target_id: '123e4567-e89b-12d3-a456-426614174000',
    reason: 'spam',
  };
  const res = await fetch(`http://127.0.0.1:${port}/mod/bans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  assert.equal(res.status, 200);
  assert.equal(data[0].status, 'pending');
});

test('returns 400 on invalid body', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/mod', modRoutes);
  const server = app.listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const port = (server.address() as any).port;

  const res = await fetch(`http://127.0.0.1:${port}/mod/bans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(res.status, 400);
});
