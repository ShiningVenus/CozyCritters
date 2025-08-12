import { Router } from "express";
import { z } from "zod";
import { bans, threads } from "../store";

const router = Router();

const idSchema = z.object({ id: z.string().uuid() });

router.patch("/bans/:id/approve", (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  const ban = bans.find((b) => b.id === id);
  if (!ban) return res.status(404).json({ error: "Ban not found" });
  ban.status = "approved";
  res.json([ban]);
});

router.patch("/bans/:id/lift", (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  const ban = bans.find((b) => b.id === id);
  if (!ban) return res.status(404).json({ error: "Ban not found" });
  ban.status = "lifted";
  res.json([ban]);
});

router.patch("/threads/:id/restore", (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  const thread = threads.find((t) => t.id === id);
  if (!thread) return res.status(404).json({ error: "Thread not found" });
  thread.deleted = false;
  res.json([thread]);
});

export default router;
