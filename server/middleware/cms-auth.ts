import { type Request, type Response, type NextFunction } from "express";
import crypto from "crypto";
import cookie from "cookie";
import { getUser } from "../admin-users";

const JWT_SECRET = process.env.JWT_SECRET || "change-me";

function base64url(input: Buffer): string {
  return input
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function verifyToken(token: string): {
  username: string;
  passwordHash: string;
  role: string;
} {
  const [data, sig] = token.split(".");
  if (!data || !sig) {
    throw new Error("Invalid token");
  }
  const expected = base64url(
    crypto.createHmac("sha256", JWT_SECRET).update(data).digest()
  );
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    throw new Error("Invalid token");
  }
  const json = Buffer.from(
    data.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString();
  return JSON.parse(json);
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
    const payload = verifyToken(token);

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
