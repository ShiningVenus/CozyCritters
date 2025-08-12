import { promises as fs } from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'cms', 'data');

export async function readData<T = any>(name: string): Promise<T[]> {
  const file = path.join(dataDir, `${name}.json`);
  try {
    const text = await fs.readFile(file, 'utf8');
    return JSON.parse(text);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

export async function writeData<T = any>(name: string, data: T[]): Promise<void> {
  const file = path.join(dataDir, `${name}.json`);
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}
