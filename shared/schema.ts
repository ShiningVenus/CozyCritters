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

export const moodOptions = [
  { emoji: "🐻", mood: "Happy", color: "bg-secondary-custom" },
  { emoji: "🦊", mood: "Calm", color: "bg-calm-custom bg-opacity-30" },
  { emoji: "🐢", mood: "Tired", color: "bg-purple-100" },
  { emoji: "🦦", mood: "Anxious", color: "bg-orange-100" },
  { emoji: "🐰", mood: "Excited", color: "bg-pink-100" },
  { emoji: "🦋", mood: "Peaceful", color: "bg-green-100" },
  { emoji: "🦔", mood: "Overwhelmed", color: "bg-red-100" },
  { emoji: "🐨", mood: "Content", color: "bg-content-custom" },
] as const;

export { encouragementMessages } from "./encouragements";
