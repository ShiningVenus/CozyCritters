import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import modRouter from './mod';
import { randomUUID } from 'node:crypto';

function buildServer() {
  const app = express();
  app.use(express.json());
  app.use(modRouter);
  const server = app.listen(0);
  const { port } = server.address() as any;
  return { server, port };
}

test('lists flags', async () => {
  const { server, port } = buildServer();
  try {
    const res = await fetch(`http://localhost:${port}/flags`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, []);
  } finally {
    server.close();
  }
});

test('soft deletes a post', async () => {
  const { server, port } = buildServer();
  const id = randomUUID();
  try {
    const res = await fetch(`http://localhost:${port}/posts/${id}/soft-delete`, { method: 'PATCH' });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, [{ id, deleted: true }]);
  } finally {
    server.close();
  }
});

test('creates a ban', async () => {
  const { server, port } = buildServer();
  const target_id = randomUUID();
  try {
    const res = await fetch(`http://localhost:${port}/bans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_id, reason: 'spam' }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, [{ id: 'ban1', target_id, reason: 'spam', status: 'pending' }]);
  } finally {
    server.close();
  }
});

test('rejects invalid ban body', async () => {
  const { server, port } = buildServer();
  try {
    const res = await fetch(`http://localhost:${port}/bans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target_id: 'not-a-uuid', reason: '' }),
    });
    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});
