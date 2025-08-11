import { Router } from "express";
import { supabase } from "../utils/supabase";

const router = Router();

router.get("/flags", async (_req, res) => {
  const { data, error } = await supabase.from("flags").select("*");
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.patch("/posts/:id/soft-delete", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("posts")
    .update({ deleted: true })
    .eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post("/bans", async (req, res) => {
  const { target_id, reason } = req.body;
  const { data, error } = await supabase
    .from("bans")
    .insert({ target_id, reason, status: "pending" });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default router;
