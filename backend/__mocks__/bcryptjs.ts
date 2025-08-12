export function hashSync(password: string, _salt: any): string {
  return `hashed-${password}`;
}

export function compareSync(password: string, hash: string): boolean {
  return hash === `hashed-${password}`;
}

export function hash(
  password: string,
  _salt: any,
  cb?: (err: Error | null, hashed?: string) => void
): Promise<string> | void {
  const result = hashSync(password, _salt);
  if (cb) {
    cb(null, result);
    return;
  }
  return Promise.resolve(result);
}

export function compare(
  password: string,
  hash: string,
  cb?: (err: Error | null, same?: boolean) => void
): Promise<boolean> | void {
  const same = compareSync(password, hash);
  if (cb) {
    cb(null, same);
    return;
  }
  return Promise.resolve(same);
}

export default {
  hashSync,
  compareSync,
  hash,
  compare
};
