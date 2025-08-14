import { cpSync, existsSync } from 'fs';
import { resolve } from 'path';

const src = resolve('client', 'public', 'content');
const dest = resolve('client', 'dist', 'content');

if (existsSync(src)) {
  cpSync(src, dest, { recursive: true });
} else {
  console.warn(`Source content directory not found at ${src}. Skipping copy.`);
}
