import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string().min(1),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export type User = InsertUser & { id: string };

export const insertMoodEntrySchema = z.object({
  emoji: z.string().min(1),
  mood: z.string().min(1),
  message: z.string().min(1),
  note: z.string().optional(),
  timestamp: z.number(),
});

export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;

export type MoodEntry = InsertMoodEntry & {
  id: string;
};

export { encouragementMessages } from "./encouragements";
