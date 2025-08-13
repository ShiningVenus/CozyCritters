import { type Request, type Response, type NextFunction } from "express";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import { getUser } from "../admin-users";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

interface TokenPayload {
  username: string;
  passwordHash: string;
  role: string;
  iat: number;
  exp: number;
}

export function cmsAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  let token: string | undefined;

  if (header?.startsWith("Bearer ")) {
    token = header.substring(7);
  } else {
    const cookies = cookie.parse(req.headers.cookie ?? "");
    token = cookies.token;
  }

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const user = getUser(payload.username);
    if (!user || user.password !== payload.passwordHash) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    (req as any).cmsUser = { username: payload.username, role: payload.role };
    (req as any).role = payload.role;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
