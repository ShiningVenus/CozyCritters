import test from 'node:test';
import assert from 'node:assert/strict';

process.env.API_KEY = 'test-key';
const { authMiddleware } = await import('./auth');

function mockRes(t: any) {
  const res: any = {};
  res.status = t.mock.fn(() => res);
  res.json = t.mock.fn();
  return res;
}

test('returns 401 when API key missing', async (t) => {
  const req: any = { headers: {} };
  const res = mockRes(t);
  const next = t.mock.fn();

  await authMiddleware([])(req, res, next);

  assert.equal(res.status.mock.calls[0].arguments[0], 401);
  assert.equal(next.mock.callCount(), 0);
});

test('calls next when API key matches', async (t) => {
  const req: any = { headers: { 'x-api-key': 'test-key' } };
  const res = mockRes(t);
  const next = t.mock.fn();

  await authMiddleware([])(req, res, next);

  assert.equal(next.mock.callCount(), 1);
});
