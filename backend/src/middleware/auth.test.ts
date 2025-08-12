import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import jwt from 'jsonwebtoken';
import { authMiddleware } from './auth';
import { env } from '../env';

function createToken(payload: any, options?: jwt.SignOptions) {
  return jwt.sign(payload, env.JWT_SECRET, {
    algorithm: 'HS256',
    expiresIn: '1h',
    ...options,
  });
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

test('rejects request with invalid token', async () => {
  const { server, port } = buildServer(['admin']);
  try {
    const token = jwt.sign(
      { roles: ['admin'] },
      'wrong-secret',
      { algorithm: 'HS256', expiresIn: '1h' }
    );
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

test('rejects request with expired token', async () => {
  const { server, port } = buildServer(['admin']);
  try {
    const token = createToken({ roles: ['admin'] }, { expiresIn: '-1s' });
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
