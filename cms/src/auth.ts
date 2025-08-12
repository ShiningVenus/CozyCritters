import type { Request, Response, NextFunction } from 'express';

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

  const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="cms"');
  return res.status(401).send('Invalid credentials');
}
