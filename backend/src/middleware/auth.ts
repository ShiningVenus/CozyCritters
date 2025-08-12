import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../env";

function verifyToken(token: string) {
  const payload = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
  }) as JwtPayload;
  if (!payload.exp) throw new Error("Missing exp");
  return payload;
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
