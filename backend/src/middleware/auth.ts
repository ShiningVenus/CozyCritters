import { Request, Response, NextFunction } from "express";
import { env } from "../env";

export function authMiddleware(_allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header("x-api-key");
    if (apiKey !== env.API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };
}
