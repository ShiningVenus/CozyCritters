import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { authMiddleware } from "./src/middleware/auth";
import { auditLogger } from "./src/middleware/auditLogger";
import modRoutes from "./src/routes/mod";
import adminRoutes from "./src/routes/admin";
import { env } from "./src/env";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({ credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Protected routes
app.use("/mod", authMiddleware(["moderator", "admin"]), auditLogger, modRoutes);
app.use("/admin", authMiddleware(["admin"]), auditLogger, adminRoutes);

app.listen(env.PORT, () => {
  console.log(`Backend running on port ${env.PORT}`);
});
