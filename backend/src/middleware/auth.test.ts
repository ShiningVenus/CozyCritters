import test from 'node:test';
import assert from 'node:assert/strict';

process.env.API_KEY = 'test-key';
const { authMiddleware } = await import('./auth');

function createReq(headers: Record<string, string>) {
  return {
    headers,
    header(name: string) {
      return this.headers[name.toLowerCase()] || this.headers[name];
    },
  } as any;
}

test('returns 401 when API key missing', async (t) => {
  const req = createReq({});
  const res: any = {};
  res.status = t.mock.fn(() => res);
  res.json = t.mock.fn();
  const next = t.mock.fn();

  await authMiddleware([])(req, res, next);

  assert.equal(res.status.mock.calls[0].arguments[0], 401);
  assert.equal(next.mock.callCount(), 0);
});

test('calls next when API key matches', async (t) => {
  const req = createReq({ 'x-api-key': 'test-key' });
  const res: any = {};
  res.status = t.mock.fn(() => res);
  res.json = t.mock.fn();
  const next = t.mock.fn();

  await authMiddleware([])(req, res, next);

  assert.equal(next.mock.callCount(), 1);
});
