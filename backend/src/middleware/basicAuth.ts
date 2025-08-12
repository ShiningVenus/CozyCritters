import { Request, Response, NextFunction } from "express";

const users: Record<string, { password: string; role: string }> = {
  mod: { password: "modpass", role: "moderator" },
  admin: { password: "adminpass", role: "admin" },
};

export function basicAuth(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Basic ")) {
      res.set("WWW-Authenticate", "Basic realm=\"Restricted\"");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const base64Credentials = header.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, password] = credentials.split(":");
    const user = users[username];

    if (!user || user.password !== password) {
      res.set("WWW-Authenticate", "Basic realm=\"Restricted\"");
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!allowedRoles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    (req as any).user = { username, role: user.role };
    next();
  };
}
