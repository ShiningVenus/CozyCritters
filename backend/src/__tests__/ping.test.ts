import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const serverFile = join(__dirname, '..', '..', 'server.ts');

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(url: string, retries = 20) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch {
      await wait(100);
    }
  }
  throw new Error('Server not ready');
}

test('GET /ping returns ok true', async () => {
  const port = 5050;
  const child = spawn(process.execPath, ['--import', 'tsx', serverFile], {
    env: { ...process.env, PORT: String(port) },
    stdio: 'ignore',
  });

  try {
    const res = await fetchWithRetry(`http://localhost:${port}/ping`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.deepEqual(body, { ok: true });
  } finally {
    child.kill();
    await new Promise((resolve) => child.on('exit', resolve));
  }
});
