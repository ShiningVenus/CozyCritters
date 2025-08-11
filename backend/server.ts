import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { authMiddleware } from "./src/middleware/auth";
import { auditLogger } from "./src/middleware/auditLogger";
import modRoutes from "./src/routes/mod";
import adminRoutes from "./src/routes/admin";

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// Protected routes
app.use("/mod", authMiddleware(["moderator", "admin"]), auditLogger, modRoutes);
app.use("/admin", authMiddleware(["admin"]), auditLogger, adminRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
