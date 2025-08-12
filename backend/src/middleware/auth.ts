import { Request, Response, NextFunction } from "express";
import { createHmac } from "node:crypto";
import { env } from "../env";

function verifyToken(token: string) {
  const parts = token.split(".");
  if (parts.length !== 3) throw new Error("Invalid token");
  const [headerB64, payloadB64, signature] = parts;
  const expected = createHmac("sha256", env.JWT_SECRET)
    .update(`${headerB64}.${payloadB64}`)
    .digest("base64url");
  if (signature !== expected) throw new Error("Invalid signature");
  const payloadJson = Buffer.from(payloadB64, "base64url").toString();
  return JSON.parse(payloadJson);
}

export function authMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.header("authorization") ?? "";
    if (!auth.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    try {
      const token = auth.slice(7);
      const payload = verifyToken(token);
      const roles: string[] = Array.isArray(payload.roles)
        ? payload.roles
        : payload.role
        ? [payload.role]
        : [];
      if (allowedRoles.length && !roles.some((r) => allowedRoles.includes(r))) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      next();
    } catch {
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
}
