import { Router } from "express";
import { z } from "zod";
import fs from "node:fs/promises";
import bcrypt from "bcryptjs";
import { env } from "../env";
import { createHttpError } from "../utils/httpError";

// Access to these routes is restricted via JWT bearer tokens with the
// appropriate roles supplied by the authentication layer.
const router = Router();

const idSchema = z.object({ id: z.string().uuid() });
const htUserSchema = z.object({ username: z.string(), password: z.string() });
const usernameSchema = z.object({ username: z.string() });

router.patch("/bans/:id/approve", (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  res.json([{ id, status: "approved" }]);
});

router.patch("/bans/:id/lift", (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  res.json([{ id, status: "lifted" }]);
});

router.patch("/threads/:id/restore", (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  res.json([{ id, deleted: false }]);
});

router.post("/htaccess/users", async (req, res, next) => {
  const result = htUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { username, password } = result.data;
  try {
    const hash = bcrypt.hashSync(password, 10);
    await fs.appendFile(env.HTPASSWD_PATH, `${username}:${hash}\n`);
    res.json({ success: true });
  } catch (error) {
    next(createHttpError(500, "Failed to update htpasswd"));
  }
});

router.get("/htaccess/users", async (_req, res, next) => {
  try {
    const contents = await fs.readFile(env.HTPASSWD_PATH, "utf8").catch(
      (err: any) => (err.code === "ENOENT" ? "" : Promise.reject(err))
    );
    const users = contents
      .split("\n")
      .filter(Boolean)
      .map((line) => ({ username: line.split(":")[0] }));
    res.json(users);
  } catch {
    next(createHttpError(500, "Failed to read htpasswd"));
  }
});

router.delete("/htaccess/users/:username", async (req, res, next) => {
  const result = usernameSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { username } = result.data;
  try {
    const contents = await fs.readFile(env.HTPASSWD_PATH, "utf8").catch(
      (err: any) => (err.code === "ENOENT" ? "" : Promise.reject(err))
    );
    const lines = contents
      .split("\n")
      .filter(Boolean)
      .filter((line) => line.split(":")[0] !== username);
    const data = lines.length > 0 ? lines.join("\n") + "\n" : "";
    await fs.writeFile(env.HTPASSWD_PATH, data);
    res.json({ success: true });
  } catch {
    next(createHttpError(500, "Failed to update htpasswd"));
  }
});

export default router;
