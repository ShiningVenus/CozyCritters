import test from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';

process.env.SUPABASE_URL = 'http://localhost';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test';
process.env.SUPABASE_JWKS_URL = 'https://example.com';
const { authMiddleware } = await import('./auth');
const { supabase } = await import('../utils/supabase');

test('returns 401 when Authorization header missing', async (t) => {
  const req: any = { headers: {} };
  const res: any = {
    status: t.mock.fn().mockReturnThis(),
    json: t.mock.fn(),
  };
  const next = t.mock.fn();

  await authMiddleware(['admin'])(req, res, next);

  assert.equal(res.status.mock.calls[0].arguments[0], 401);
  assert.equal(next.mock.callCount(), 0);
});

test('returns 401 on invalid token', async (t) => {
  const req: any = { headers: { authorization: 'Bearer bad' } };
  const res: any = {
    status: t.mock.fn().mockReturnThis(),
    json: t.mock.fn(),
  };
  const next = t.mock.fn();

  t.mock.method(jwt, 'verify', (_t, _k, _o, cb) => cb(new Error('bad token'), null));

  await authMiddleware(['admin'])(req, res, next);

  assert.equal(res.status.mock.calls[0].arguments[0], 401);
  assert.equal(next.mock.callCount(), 0);
});

test('returns 403 when user role not allowed', async (t) => {
  const req: any = { headers: { authorization: 'Bearer good' } };
  const res: any = {
    status: t.mock.fn().mockReturnThis(),
    json: t.mock.fn(),
  };
  const next = t.mock.fn();

  t.mock.method(jwt, 'verify', (_t, _k, _o, cb) => cb(null, { sub: 'user1' }));
  t.mock.method(supabase, 'from', () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: { id: 'user1', role: 'user' } }),
      }),
    }),
  }));

  await authMiddleware(['admin'])(req, res, next);
  await new Promise(process.nextTick);

  assert.equal(res.status.mock.calls[0].arguments[0], 403);
  assert.equal(next.mock.callCount(), 0);
});

test('calls next for allowed role', async (t) => {
  const req: any = { headers: { authorization: 'Bearer good' } };
  const res: any = {
    status: t.mock.fn().mockReturnThis(),
    json: t.mock.fn(),
  };
  const next = t.mock.fn();

  t.mock.method(jwt, 'verify', (_t, _k, _o, cb) => cb(null, { sub: 'user1' }));
  t.mock.method(supabase, 'from', () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: { id: 'user1', role: 'admin' } }),
      }),
    }),
  }));

  await authMiddleware(['admin'])(req, res, next);
  await new Promise(process.nextTick);

  assert.equal(next.mock.callCount(), 1);
  assert.deepEqual(req.user, { id: 'user1', role: 'admin' });
});
