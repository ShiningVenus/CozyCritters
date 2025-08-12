import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service';
process.env.SUPABASE_JWKS_URL = 'http://localhost/jwks';
process.env.CORS_ORIGIN = '*';

const { supabase } = await import('../utils/supabase');
const { default: modRoutes } = await import('./mod');

test('creates a ban request', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/mod', modRoutes);

  const insert = t.mock.fn(async () => ({ data: [{ id: 'ban1' }], error: null }));
  t.mock.method(supabase, 'from', () => ({ insert }));

  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const port = (server.address() as any).port;

  const body = {
    target_id: '123e4567-e89b-12d3-a456-426614174000',
    reason: 'spam',
  };
  try {
    const res = await fetch(`http://127.0.0.1:${port}/mod/bans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    assert.equal(res.status, 200);
    assert.deepEqual(insert.mock.calls[0].arguments[0], {
      ...body,
      status: 'pending',
    });
  } finally {
    server.close();
  }
});

test('returns 400 on invalid body', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/mod', modRoutes);
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const port = (server.address() as any).port;

  try {
    const res = await fetch(`http://127.0.0.1:${port}/mod/bans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    assert.equal(res.status, 400);
  } finally {
    server.close();
  }
});
