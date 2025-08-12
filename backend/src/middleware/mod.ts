import { Router } from "express";
import { z } from "zod";
import { supabase } from "../utils/supabase";

const router = Router();

const idSchema = z.object({ id: z.string().uuid() });
const banSchema = z.object({
  target_id: z.string().uuid(),
  reason: z.string().min(1),
});

router.get("/flags", async (_req, res) => {
  const { data, error } = await supabase.from("flags").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch("/posts/:id/soft-delete", async (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  const { data, error } = await supabase
    .from("posts")
    .update({ deleted: true })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/bans", async (req, res) => {
  const result = banSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { target_id, reason } = result.data;
  const { data, error } = await supabase
    .from("bans")
    .insert({ target_id, reason, status: "pending" });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
