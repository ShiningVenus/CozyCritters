import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertUserSchema } from "@shared/schema";
import { storage } from "./storage";
import {
  listUsers as listCmsUsers,
  createUser as createCmsUser,
  updateUser as updateCmsUser,
  deleteUser as deleteCmsUser,
  ensureAdmin,
} from "./admin-users";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  app.post("/api/users", async (req, res, next) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/admin/users", ensureAdmin, (_req, res) => {
    res.json(listCmsUsers());
  });

  app.post("/api/admin/users", ensureAdmin, (req, res, next) => {
    try {
      const { username, password, role } = req.body as {
        username: string;
        password: string;
        role: any;
      };
      createCmsUser(username, password, role);
      res.status(201).end();
    } catch (err) {
      next(err);
    }
  });

  app.put("/api/admin/users/:username", ensureAdmin, (req, res, next) => {
    try {
      const { password, role } = req.body as {
        password?: string;
        role?: any;
      };
      updateCmsUser(req.params.username, { password, role });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  app.delete("/api/admin/users/:username", ensureAdmin, (req, res, next) => {
    try {
      deleteCmsUser(req.params.username);
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
