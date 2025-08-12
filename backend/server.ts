import express from "express";

import modRoutes from "./src/routes/mod";
import adminRoutes from "./src/routes/admin";
import { basicAuth } from "./src/middleware/basicAuth";

const app = express();
app.use(express.json());
app.use("/mod", basicAuth(["moderator", "admin"]), modRoutes);
app.use("/admin", basicAuth(["admin"]), adminRoutes);
app.listen(4000);
