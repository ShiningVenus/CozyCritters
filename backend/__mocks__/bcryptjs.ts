export function hashSync(password: string, _salt: any): string {
  return `hashed-${password}`;
}

export function compareSync(password: string, hash: string): boolean {
  return hash === `hashed-${password}`;
}

export function hash(password: string, _salt: any, cb: (err: Error | null, hashed?: string) => void): void {
  cb(null, hashSync(password, _salt));
}

export function compare(password: string, hash: string, cb: (err: Error | null, same?: boolean) => void): void {
  cb(null, compareSync(password, hash));
}

export default {
  hashSync,
  compareSync,
  hash,
  compare
};
