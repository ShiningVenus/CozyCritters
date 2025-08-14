import { cpSync } from 'fs';
import { resolve } from 'path';

const src = resolve('content');
const dest = resolve('client', 'dist', 'content');

cpSync(src, dest, { recursive: true });
