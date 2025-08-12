import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envFile = join(__dirname, 'env.ts');

function runEnv(env: NodeJS.ProcessEnv) {
  const code = `import { env } from ${JSON.stringify(envFile)}; console.log(JSON.stringify(env));`;
  return spawnSync(process.execPath, ['--import', 'tsx', '-e', code], {
    env,
    encoding: 'utf8'
  });
}

test('uses defaults in development', () => {
  const devEnv = { ...process.env, NODE_ENV: 'development' };
  delete devEnv.JWT_SECRET;
  delete devEnv.HTPASSWD_PATH;
  const result = runEnv(devEnv);
  assert.equal(result.status, 0);
  const parsed = JSON.parse(result.stdout.trim());
  assert.equal(parsed.JWT_SECRET, 'dev-secret');
  assert.equal(parsed.HTPASSWD_PATH, '.htpasswd');
  assert.equal(parsed.RATE_LIMIT_WINDOW_MINUTES, 15);
  assert.equal(parsed.RATE_LIMIT_MAX, 100);
});

test('throws when required env vars missing in production', () => {
  const prodEnv = { ...process.env, NODE_ENV: 'production' };
  delete prodEnv.JWT_SECRET;
  delete prodEnv.HTPASSWD_PATH;
  const result = runEnv(prodEnv);
  assert.notEqual(result.status, 0);
});

