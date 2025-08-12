import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
const { supabase } = await import('../utils/supabase');
import adminRoutes from './admin';

test('approves a ban', async (t) => {
  const app = express();
  app.use(express.json());
  app.use('/admin', adminRoutes);

  const id = '123e4567-e89b-12d3-a456-426614174000';

  const eq = t.mock.fn(async () => ({ data: [{ id, status: 'approved' }], error: null }));
  const update = t.mock.fn(() => ({ eq }));
  t.mock.method(supabase, 'from', () => ({ update }));

  const server = app.listen(0);
  t.teardown(() => server.close());
  await new Promise((resolve) => server.once('listening', resolve));
  const port = (server.address() as any).port;

  const res = await fetch(`http://127.0.0.1:${port}/admin/bans/${id}/approve`, {
    method: 'PATCH',
  });
  const body = await res.json();

  assert.equal(res.status, 200);
  assert.equal(eq.mock.calls[0].arguments[0], 'id');
  assert.equal(eq.mock.calls[0].arguments[1], id);
  assert.equal(update.mock.calls[0].arguments[0].status, 'approved');
  assert.equal(body[0].status, 'approved');
});
