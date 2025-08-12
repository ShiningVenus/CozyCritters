import { Router } from "express";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { bans, posts, flags } from "../store";

const router = Router();

const idSchema = z.object({ id: z.string().uuid() });
const banSchema = z.object({
  target_id: z.string().uuid(),
  reason: z.string().min(1),
});

router.get("/flags", (_req, res) => {
  res.json(flags);
});

router.patch("/posts/:id/soft-delete", (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  const post = posts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ error: "Post not found" });
  post.deleted = true;
  res.json([post]);
});

router.post("/bans", (req, res) => {
  const result = banSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { target_id, reason } = result.data;
  const ban = { id: randomUUID(), target_id, reason, status: "pending" };
  bans.push(ban);
  res.json([ban]);
});

export default router;
