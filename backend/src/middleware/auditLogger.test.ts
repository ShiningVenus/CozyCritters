import test from 'node:test';
import assert from 'node:assert/strict';

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service';
process.env.SUPABASE_JWKS_URL = 'http://localhost/jwks';
process.env.CORS_ORIGIN = '*';

const { auditLogger } = await import('./auditLogger');
const { supabase } = await import('../utils/supabase');

test('redacts sensitive fields before logging', async (t) => {
  const req: any = {
    method: 'POST',
    originalUrl: '/test',
    body: { password: 'secret', token: 'abc', ok: 'yes' },
    user: { id: '1' },
  };
  const res: any = {};
  const next = t.mock.fn();

  const insert = t.mock.fn(async () => ({}));
  t.mock.method(supabase, 'from', () => ({ insert }));

  await auditLogger(req, res, next);

  assert.equal(insert.mock.callCount(), 1);
  const arg = insert.mock.calls[0].arguments[0];
  assert.deepEqual(arg, {
    actor_id: '1',
    action: 'POST /test',
    metadata: { password: '[REDACTED]', token: '[REDACTED]', ok: 'yes' },
  });
  assert.equal(next.mock.callCount(), 1);
});

test('truncates large metadata', async (t) => {
  const req: any = {
    method: 'POST',
    originalUrl: '/test',
    body: { big: 'a'.repeat(1001) },
    user: { id: '1' },
  };
  const res: any = {};
  const next = t.mock.fn();

  const insert = t.mock.fn(async () => ({}));
  t.mock.method(supabase, 'from', () => ({ insert }));

  await auditLogger(req, res, next);

  const arg = insert.mock.calls[0].arguments[0];
  assert.deepEqual(arg.metadata, { truncated: true });
  assert.equal(next.mock.callCount(), 1);
});
