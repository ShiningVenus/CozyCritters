import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
const { supabase } = await import('../utils/supabase');
import modRoutes from './mod';

test('creates a ban request', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/mod', modRoutes);

  const insert = t.mock.fn(async () => ({ data: [{ id: 'ban1' }], error: null }));
  t.mock.method(supabase, 'from', () => ({ insert }));

  const server = app.listen(0);
  t.teardown(() => server.close());
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

  assert.equal(res.status, 200);
  assert.deepEqual(insert.mock.calls[0].arguments[0], {
    ...body,
    status: 'pending',
  });
});

test('returns 400 on invalid body', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/mod', modRoutes);
  const server = app.listen(0);
  t.teardown(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const port = (server.address() as any).port;

  const res = await fetch(`http://127.0.0.1:${port}/mod/bans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  assert.equal(res.status, 400);
});
