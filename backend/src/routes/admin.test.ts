import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import adminRoutes from './admin';
import { bans, threads } from '../store';

async function setupApp(t: test.TestContext) {
  const app = express();
  app.use(express.json());
  app.use('/admin', adminRoutes);
  const server = app.listen(0);
  t.after(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const port = (server.address() as any).port;
  return { app, port };
}

test('approves a ban', async (t) => {
  const { port } = await setupApp(t);
  const id = '00000000-0000-0000-0000-000000000001';
  bans.push({ id, status: 'pending' });
  t.after(() => {
    const i = bans.findIndex((b) => b.id === id);
    if (i !== -1) bans.splice(i, 1);
  });

  const res = await fetch(`http://127.0.0.1:${port}/admin/bans/${id}/approve`, {
    method: 'PATCH',
  });
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body[0].status, 'approved');
  assert.equal(bans.find((b) => b.id === id)?.status, 'approved');
});

test('lifts a ban', async (t) => {
  const { port } = await setupApp(t);
  const id = '00000000-0000-0000-0000-000000000002';
  bans.push({ id, status: 'approved' });
  t.after(() => {
    const i = bans.findIndex((b) => b.id === id);
    if (i !== -1) bans.splice(i, 1);
  });

  const res = await fetch(`http://127.0.0.1:${port}/admin/bans/${id}/lift`, {
    method: 'PATCH',
  });
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body[0].status, 'lifted');
  assert.equal(bans.find((b) => b.id === id)?.status, 'lifted');
});

test('restores a thread', async (t) => {
  const { port } = await setupApp(t);
  const id = '00000000-0000-0000-0000-000000000003';
  threads.push({ id, deleted: true });
  t.after(() => {
    const i = threads.findIndex((th) => th.id === id);
    if (i !== -1) threads.splice(i, 1);
  });

  const res = await fetch(`http://127.0.0.1:${port}/admin/threads/${id}/restore`, {
    method: 'PATCH',
  });
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(body[0].deleted, false);
  assert.equal(threads.find((th) => th.id === id)?.deleted, false);
});
