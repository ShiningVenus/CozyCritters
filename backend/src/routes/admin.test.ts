import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import adminRouter from './admin';
import { randomUUID } from 'node:crypto';

function buildServer() {
  const app = express();
  app.use(express.json());
  app.use(adminRouter);
  const server = app.listen(0);
  const { port } = server.address() as any;
  return { server, port };
}

test('approves a ban with valid id', async () => {
  const { server, port } = buildServer();
  const id = randomUUID();
  try {
    const res = await fetch(`http://localhost:${port}/bans/${id}/approve`, { method: 'PATCH' });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, [{ id, status: 'approved' }]);
  } finally {
    server.close();
  }
});

test('rejects invalid ban id', async () => {
  const { server, port } = buildServer();
  try {
    const res = await fetch(`http://localhost:${port}/bans/not-a-uuid/approve`, { method: 'PATCH' });
    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});

test('restores thread', async () => {
  const { server, port } = buildServer();
  const id = randomUUID();
  try {
    const res = await fetch(`http://localhost:${port}/threads/${id}/restore`, { method: 'PATCH' });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, [{ id, deleted: false }]);
  } finally {
    server.close();
  }
});
