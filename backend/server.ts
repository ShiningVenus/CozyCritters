import express from "express";
import { env } from "./src/env";
import { authMiddleware } from "./src/middleware/auth";
import modRoutes from "./src/routes/mod";
import adminRoutes from "./src/routes/admin";

const app = express();
app.use(express.json());
app.use("/mod", authMiddleware(["moderator", "admin"]), modRoutes);
app.use("/admin", authMiddleware(["admin"]), adminRoutes);
app.listen(env.PORT);
