import type { Request, Response, NextFunction } from 'express';
import { timingSafeEqual } from 'crypto';

const DEFAULT_USER = 'admin';
const DEFAULT_PASS = 'change-me';
const ADMIN_USER = process.env.CMS_USER || DEFAULT_USER;
const ADMIN_PASS = process.env.CMS_PASS || DEFAULT_PASS;

if (process.env.NODE_ENV === 'production') {
  if (ADMIN_USER === DEFAULT_USER || ADMIN_PASS === DEFAULT_PASS) {
    throw new Error('CMS_USER and CMS_PASS must be set to secure values in production');
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="cms"');
    return res.status(401).send('Authentication required');
  }

  let credentials: string;
  try {
    credentials = Buffer.from(auth.split(' ')[1], 'base64').toString();
  } catch {
    res.set('WWW-Authenticate', 'Basic realm="cms"');
    return res.status(400).send('Invalid authorization header');
  }

  const separator = credentials.indexOf(':');
  if (separator === -1) {
    res.set('WWW-Authenticate', 'Basic realm="cms"');
    return res.status(400).send('Invalid authorization header');
  }

  const user = credentials.slice(0, separator);
  const pass = credentials.slice(separator + 1);

  const userBuf = Buffer.from(user);
  const passBuf = Buffer.from(pass);
  const adminUserBuf = Buffer.from(ADMIN_USER);
  const adminPassBuf = Buffer.from(ADMIN_PASS);

  const userMatch =
    userBuf.length === adminUserBuf.length &&
    timingSafeEqual(userBuf, adminUserBuf);
  const passMatch =
    passBuf.length === adminPassBuf.length &&
    timingSafeEqual(passBuf, adminPassBuf);

  if (userMatch && passMatch) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="cms"');
  return res.status(401).send('Invalid credentials');
}
