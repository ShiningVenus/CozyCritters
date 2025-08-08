import type { Request, Response, NextFunction } from "express";
import { log } from "../vite";

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const path = req.originalUrl;
  let capturedResponse: any = undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson: any) {
    capturedResponse = bodyJson;
    return originalResJson(bodyJson);
  } as typeof res.json;

  const originalResSend = res.send.bind(res);
  res.send = function (body: any) {
    capturedResponse = body;
    return originalResSend(body);
  } as typeof res.send;

  const originalResEnd = res.end.bind(res);
  res.end = function (chunk?: any, ...args: any[]) {
    if (chunk !== undefined) {
      capturedResponse = chunk;
    }
    return originalResEnd(chunk, ...args);
  } as typeof res.end;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedResponse !== undefined) {
        if (typeof capturedResponse === "object" && !Buffer.isBuffer(capturedResponse)) {
          logLine += ` :: ${JSON.stringify(capturedResponse)}`;
        } else {
          logLine += ` :: ${capturedResponse.toString()}`;
        }
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
}
