import { Router } from "express";
import { supabase } from "../utils/supabase";

const router = Router();

router.patch("/bans/:id/approve", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("bans")
    .update({ status: "approved" })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch("/bans/:id/lift", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("bans")
    .update({ status: "lifted" })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch("/threads/:id/restore", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("threads")
    .update({ deleted: false })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
