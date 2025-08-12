import type { Request, Response, NextFunction } from 'express';
import { getUsers, findUser, hashPassword, type User } from './users.js';

declare global {
  namespace Express {
    interface Request {
      user?: Omit<User, 'password'>;
    }
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const users = await getUsers();
  if (users.length === 0) {
    return next();
  }

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.set('WWW-Authenticate', 'Basic realm="cms"');
    return res.status(401).send('Authentication required');
  }

  const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64')
    .toString()
    .split(':');
  const found = await findUser(user);
  if (found && found.password === hashPassword(pass)) {
    req.user = { id: found.id, username: found.username, role: found.role };
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="cms"');
  return res.status(401).send('Invalid credentials');
}
