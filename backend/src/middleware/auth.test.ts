import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createHmac } from 'node:crypto';
import { authMiddleware } from './auth';
import { env } from '../env';

function createToken(payload: any) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encode = (obj: any) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');
  const headerB64 = encode(header);
  const payloadB64 = encode(payload);
  const signature = createHmac('sha256', env.JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest('base64url');
  return `${headerB64}.${payloadB64}.${signature}`;
}

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
    const token = createToken({ roles: ['user'] });
    const res = await fetch(`http://localhost:${port}/protected`, {
      headers: {
        authorization: `Bearer ${token}`
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
    const token = createToken({ roles: ['user', 'admin'] });
    const res = await fetch(`http://localhost:${port}/protected`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { ok: true });
  } finally {
    server.close();
  }
});
