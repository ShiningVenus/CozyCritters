import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { requestLogger } from './request-logger';

test('logs API requests and calls next', (t) => {
  const req = { method: 'GET', path: '/api/ping' } as any;
  const res = new EventEmitter() as any;
  res.statusCode = 200;
  res.json = (body: any) => body;
  const next = t.mock.fn();

  const logs: string[] = [];
  t.mock.method(console, 'log', (...args: unknown[]) => {
    logs.push(args.join(' '));
  });

  requestLogger(req, res, next);
  res.json({ ok: true });
  res.emit('finish');

  assert.equal(next.mock.callCount(), 1);
  assert.equal(logs.length, 1);
  assert.match(logs[0], /\[express\] GET \/api\/ping 200 in \d+ms/);
});
