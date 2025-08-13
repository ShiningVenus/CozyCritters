import { type Request, type Response, type NextFunction } from "express";
import { getUser, verifyPassword } from "../admin-users";

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

  const user = getUser(username);
  if (!user || !verifyPassword(password ?? "", user.password)) {
    res.set("WWW-Authenticate", 'Basic realm="CozyCritters CMS"');
    res.status(401).end("Invalid credentials");
    return;
  }

  (req as any).cmsUser = { username, role: user.role };
  next();
}
