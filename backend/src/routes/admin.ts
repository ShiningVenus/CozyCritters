import { Router } from "express";
import { z } from "zod";

// Access to these routes is expected to be restricted via `.htaccess`.
// Supabase is not used for authentication here.
const router = Router();

const idSchema = z.object({ id: z.string().uuid() });

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

export default router;
