import { Request, Response, NextFunction } from "express";

// In-memory map of API keys to roles
const keyRoleMap: Record<string, string> = {
  [process.env.API_KEY || ""]: "admin",
};

export function simpleAuth(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers["x-api-key"];

    if (typeof key !== "string" || key !== process.env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const role = keyRoleMap[key];
    if (!role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    (req as any).user = { id: key, role };
    next();
  };
}
