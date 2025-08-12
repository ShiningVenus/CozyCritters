import express from "express";
import { env } from "./src/env";
import { authMiddleware } from "./src/middleware/auth";
import modRoutes from "./src/routes/mod";
import adminRoutes from "./src/routes/admin";
import { requestLogger } from "./src/middleware/logger";
import rateLimit from "express-rate-limit";

const app = express();
app.use(express.json());
app.use(requestLogger);

const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
});

app.get("/ping", (_req, res) => res.json({ ok: true }));

const modRoles = ["moderator", "admin"];
const adminRoles = ["admin"];

app.use("/mod", limiter, authMiddleware(modRoles), modRoutes);
app.use("/admin", limiter, authMiddleware(adminRoles), adminRoutes)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const status = err.status ?? 500;
  const message = err.expose ? err.message : "Internal Server Error";
  res.status(status).json({ error: message });
});

app.listen(env.PORT);
