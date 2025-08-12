import { test } from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import adminRouter from './admin';
import { randomUUID, createHash } from 'node:crypto';
import { env } from '../env';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

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

test('adds htaccess user', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'htpasswd-'));
  const file = path.join(dir, '.htpasswd');
  env.HTPASSWD_PATH = file;
  const { server, port } = buildServer();
  try {
    const res = await fetch(`http://localhost:${port}/htaccess/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'alice', password: 'secret' })
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { success: true });
    const contents = await fs.readFile(file, 'utf8');
    const [user, hash] = contents.trim().split(':');
    assert.equal(user, 'alice');
    const expected = '{SHA}' + createHash('sha1').update('secret').digest('base64');
    assert.equal(hash, expected);
  } finally {
    server.close();
  }
});

test('rejects invalid htaccess input', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'htpasswd-'));
  const file = path.join(dir, '.htpasswd');
  env.HTPASSWD_PATH = file;
  const { server, port } = buildServer();
  try {
    const res = await fetch(`http://localhost:${port}/htaccess/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 123 })
    });
    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});

test('appends to htpasswd file', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'htpasswd-'));
  const file = path.join(dir, '.htpasswd');
  env.HTPASSWD_PATH = file;
  const { server, port } = buildServer();
  try {
    await fetch(`http://localhost:${port}/htaccess/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user1', password: 'pass1' })
    });
    await fetch(`http://localhost:${port}/htaccess/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user2', password: 'pass2' })
    });
    const contents = await fs.readFile(file, 'utf8');
    const lines = contents.trim().split('\n');
    assert.equal(lines.length, 2);
  } finally {
    server.close();
  }
});

test('lists htaccess users', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'htpasswd-'));
  const file = path.join(dir, '.htpasswd');
  env.HTPASSWD_PATH = file;
  await fs.writeFile(file, 'alice:{SHA}hash1\n' + 'bob:{SHA}hash2\n');
  const { server, port } = buildServer();
  try {
    const res = await fetch(`http://localhost:${port}/htaccess/users`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, [{ username: 'alice' }, { username: 'bob' }]);
  } finally {
    server.close();
  }
});

test('removes htaccess user', async () => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'htpasswd-'));
  const file = path.join(dir, '.htpasswd');
  env.HTPASSWD_PATH = file;
  await fs.writeFile(file, 'alice:{SHA}hash1\n' + 'bob:{SHA}hash2\n');
  const { server, port } = buildServer();
  try {
    const res = await fetch(`http://localhost:${port}/htaccess/users/alice`, { method: 'DELETE' });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { success: true });
    const contents = await fs.readFile(file, 'utf8');
    const lines = contents.trim().split('\n');
    assert.deepEqual(lines, ['bob:{SHA}hash2']);
  } finally {
    server.close();
  }
});
