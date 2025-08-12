import { Router } from "express";
import { z } from "zod";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
import { env } from "../env";

// Access to these routes is restricted via an API key in the `x-api-key` header.
// Supabase is not used for authentication here.
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

router.post("/htaccess/users", async (req, res) => {
  const result = htUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { username, password } = result.data;
  try {
    const digest = createHash("sha1").update(password).digest("base64");
    await fs.appendFile(env.HTPASSWD_PATH, `${username}:{SHA}${digest}\n`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update htpasswd" });
  }
});

router.get("/htaccess/users", async (_req, res) => {
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
    res.status(500).json({ error: "Failed to read htpasswd" });
  }
});

router.delete("/htaccess/users/:username", async (req, res) => {
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
    res.status(500).json({ error: "Failed to update htpasswd" });
  }
});

export default router;
