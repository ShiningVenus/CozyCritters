import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { supabase } from "../utils/supabase";

const client = jwksClient({
  jwksUri: process.env.SUPABASE_JWKS_URL!,
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (err, key) {
    const signingKey = key?.getPublicKey();
    callback(err, signingKey);
  });
}

export function authMiddleware(allowedRoles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];

    jwt.verify(token, getKey, { algorithms: ["RS256"] }, async (err, decoded: any) => {
      if (err) return res.status(401).json({ error: "Invalid token" });

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", decoded.sub)
        .single();

      if (!profile || !allowedRoles.includes(profile.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }

      (req as any).user = profile;
      next();
    });
  };
}
