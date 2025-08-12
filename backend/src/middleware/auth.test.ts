import test from 'node:test';
import assert from 'node:assert/strict';

process.env.API_KEY = 'secret';
const { simpleAuth } = await import('./auth');

function createRes(t: any) {
  const res: any = {};
  res.status = t.mock.fn(() => res);
  res.json = t.mock.fn();
  return res;
}

test('returns 401 when API key missing', async (t) => {
  const req: any = { headers: {} };
  const res = createRes(t);
  const next = t.mock.fn();

  await simpleAuth(['admin'])(req, res as any, next);

  assert.equal(res.status.mock.calls[0].arguments[0], 401);
  assert.equal(next.mock.callCount(), 0);
});

test('returns 401 when API key invalid', async (t) => {
  const req: any = { headers: { 'x-api-key': 'bad' } };
  const res = createRes(t);
  const next = t.mock.fn();

  await simpleAuth(['admin'])(req, res as any, next);

  assert.equal(res.status.mock.calls[0].arguments[0], 401);
  assert.equal(next.mock.callCount(), 0);
});

test('returns 403 when role not allowed', async (t) => {
  const req: any = { headers: { 'x-api-key': 'secret' } };
  const res = createRes(t);
  const next = t.mock.fn();

  await simpleAuth(['user'])(req, res as any, next);

  assert.equal(res.status.mock.calls[0].arguments[0], 403);
  assert.equal(next.mock.callCount(), 0);
});

test('calls next for allowed role and attaches user', async (t) => {
  const req: any = { headers: { 'x-api-key': 'secret' } };
  const res = createRes(t);
  const next = t.mock.fn();

  await simpleAuth(['admin'])(req, res as any, next);

  assert.equal(next.mock.callCount(), 1);
  assert.deepEqual(req.user, { id: 'secret', role: 'admin' });
});
