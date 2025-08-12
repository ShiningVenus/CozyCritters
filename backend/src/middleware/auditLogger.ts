import { Request, Response, NextFunction } from "express";
import { supabase } from "../utils/supabase";

const SENSITIVE_PATTERNS = [
  /password/i,
  /token/i,
  /secret/i,
  /key/i,
  /auth/i,
  /credential/i,
  /session/i,
];

function maskSensitiveData(data: any): any {
  if (data === null || typeof data !== "object") return data;
  if (Array.isArray(data)) return data.map(maskSensitiveData);

  const masked: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_PATTERNS.some((pattern) => pattern.test(key))) {
      masked[key] = "[REDACTED]";
    } else {
      masked[key] = maskSensitiveData(value);
    }
  }
  return masked;
}

const MAX_LOG_LENGTH = 1000;

export async function auditLogger(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const user = (req as any).user;
  const sanitizedBody = maskSensitiveData(req.body || {});
  let metadata: any = sanitizedBody;

  const metadataStr = JSON.stringify(sanitizedBody);
  if (metadataStr.length > MAX_LOG_LENGTH) {
    metadata = { truncated: true };
  }

  try {
    await supabase.from("mod_audit_log").insert({
      actor_id: user.id,
      action: `${req.method} ${req.originalUrl}`,
      metadata,
    });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }

  next();
}

