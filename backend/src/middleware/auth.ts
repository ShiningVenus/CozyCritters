import { Request, Response, NextFunction } from "express";
import { env } from "../env";

export function authMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header("x-api-key");
    if (apiKey !== env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const rolesHeader = req.header("x-roles") ?? "";
    const roles = rolesHeader
      .split(",")
      .map((r) => r.trim())
      .filter(Boolean);
    if (allowedRoles.length && !roles.some((r) => allowedRoles.includes(r))) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };
}
