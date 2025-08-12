import type { Request, Response, NextFunction } from 'express';

const ADMIN_USER = process.env.CMS_USER || 'admin';
const ADMIN_PASS = process.env.CMS_PASS || 'change-me';

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
