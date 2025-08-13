import { type Request, type Response, type NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if ((req as any).role !== "admin") {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  next();
}
