import { Router } from "express";
import { z } from "zod";
import { supabase } from "../utils/supabase";

const router = Router();

const idSchema = z.object({ id: z.string().uuid() });

router.patch("/bans/:id/approve", async (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  const { data, error } = await supabase
    .from("bans")
    .update({ status: "approved" })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch("/bans/:id/lift", async (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  const { data, error } = await supabase
    .from("bans")
    .update({ status: "lifted" })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch("/threads/:id/restore", async (req, res) => {
  const result = idSchema.safeParse(req.params);
  if (!result.success) {
    return res.status(400).json({ error: result.error.flatten() });
  }
  const { id } = result.data;
  const { data, error } = await supabase
    .from("threads")
    .update({ deleted: false })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
