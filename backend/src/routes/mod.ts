import { Router } from "express";
import { z } from "zod";

const router = Router();

const idSchema = z.object({ id: z.string().uuid() });
const banSchema = z.object({
  target_id: z.string().uuid(),
  reason: z.string().min(1),
});

router.get("/flags", (_req, res) => {
  res.json([]);
});

router.patch("/posts/:id/soft-delete", (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  res.json([{ id, deleted: true }]);
});

router.post("/bans", (req, res) => {
  const result = banSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { target_id, reason } = result.data;
  res.json([{ id: "ban1", target_id, reason, status: "pending" }]);
});

export default router;
