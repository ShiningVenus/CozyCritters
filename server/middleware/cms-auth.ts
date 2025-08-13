import { type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import crypto from "crypto";

// Load users from environment variable or cms-users.json
function loadUsers(): Record<string, string> {
  if (process.env.CMS_USERS) {
    try {
      return JSON.parse(process.env.CMS_USERS);
    } catch {
      // fall through to file
    }
  }
  const filePath = path.resolve("cms-users.json");
  if (fs.existsSync(filePath)) {
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return {};
}

const users = loadUsers();

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(derived, "hex"));
}

export function cmsAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="CozyCritters CMS"');
    res.status(401).end("Authentication required");
    return;
  }

  const [username, password] = Buffer.from(header.replace("Basic ", ""), "base64")
    .toString()
    .split(":");

  const stored = users[username];
  if (!stored || !verifyPassword(password ?? "", stored)) {
    res.set("WWW-Authenticate", 'Basic realm="CozyCritters CMS"');
    res.status(401).end("Invalid credentials");
    return;
  }

  next();
}
