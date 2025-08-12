import express from "express";
import { env } from "./src/env";
import { authMiddleware } from "./src/middleware/auth";
import modRoutes from "./src/routes/mod";
import adminRoutes from "./src/routes/admin";

const app = express();
app.use(express.json());

const modRoles = ["moderator", "admin"];
const adminRoles = ["admin"];

app.use("/mod", authMiddleware(modRoles), modRoutes);
app.use("/admin", authMiddleware(adminRoles), adminRoutes);

app.listen(env.PORT);
