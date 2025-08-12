import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { authMiddleware } from './auth';
import { env } from '../env';

function buildServer(allowedRoles: string[]) {
  const app = express();
  app.use(authMiddleware(allowedRoles));
  app.get('/protected', (_req, res) => {
    res.json({ ok: true });
  });
  const server = app.listen(0);
  const { port } = server.address() as any;
  return { server, port };
}

test('rejects request with unauthorized roles', async () => {
  const { server, port } = buildServer(['admin']);
  try {
    const res = await fetch(`http://localhost:${port}/protected`, {
      headers: {
        'x-api-key': env.API_KEY,
        'x-roles': 'user'
      }
    });
    assert.equal(res.status, 401);
  } finally {
    server.close();
  }
});

test('allows request with matching role', async () => {
  const { server, port } = buildServer(['admin']);
  try {
    const res = await fetch(`http://localhost:${port}/protected`, {
      headers: {
        'x-api-key': env.API_KEY,
        'x-roles': 'user,admin'
      }
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { ok: true });
  } finally {
    server.close();
  }
});
