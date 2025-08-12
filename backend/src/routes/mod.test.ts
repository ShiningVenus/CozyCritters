import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import modRoutes from './mod';
import { bans, posts } from '../store';

async function setupApp(t: test.TestContext) {
  const app = express();
  app.use(express.json());
  app.use('/mod', modRoutes);
  const server = app.listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const port = (server.address() as any).port;
  return { app, port };
}

test('creates a ban request', async (t) => {
  const { port } = await setupApp(t);
  const body = {
    target_id: '00000000-0000-0000-0000-000000000004',
    reason: 'spam',
  };
  const res = await fetch(`http://127.0.0.1:${port}/mod/bans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  const id = data[0].id;
  t.after(() => {
    const i = bans.findIndex((b) => b.id === id);
    if (i !== -1) bans.splice(i, 1);
  });

  assert.equal(res.status, 200);
  assert.equal(bans.find((b) => b.id === id)?.status, 'pending');
  assert.equal(bans.find((b) => b.id === id)?.target_id, body.target_id);
});

test('returns 400 on invalid body', async (t) => {
  const { port } = await setupApp(t);
  const res = await fetch(`http://127.0.0.1:${port}/mod/bans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  assert.equal(res.status, 400);
});

test('soft deletes a post', async (t) => {
  const { port } = await setupApp(t);
  const id = '00000000-0000-0000-0000-000000000005';
  posts.push({ id, deleted: false });
  t.after(() => {
    const i = posts.findIndex((p) => p.id === id);
    if (i !== -1) posts.splice(i, 1);
  });

  const res = await fetch(`http://127.0.0.1:${port}/mod/posts/${id}/soft-delete`, {
    method: 'PATCH',
  });
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body[0].deleted, true);
  assert.equal(posts.find((p) => p.id === id)?.deleted, true);
});
