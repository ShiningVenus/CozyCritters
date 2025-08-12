import express from "express";
import modRoutes from "./src/routes/mod";
import adminRoutes from "./src/routes/admin";

function simpleAuth(_roles: string[]) {
  return (_req: any, _res: any, next: any) => {
    next();
  };
}

const app = express();
app.use(express.json());
app.use("/mod", simpleAuth(["moderator", "admin"]), modRoutes);
app.use("/admin", simpleAuth(["admin"]), adminRoutes);
app.listen(4000);
