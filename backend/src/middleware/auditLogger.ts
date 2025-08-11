import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabase";

export async function auditLogger(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user;
  await supabase.from("mod_audit_log").insert({
    actor_id: user.id,
    action: `${req.method} ${req.originalUrl}`,
    metadata: req.body,
  });
  next();
}
