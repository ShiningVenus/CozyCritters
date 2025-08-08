import { z } from "zod";

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
  { emoji: "🐻", mood: "Happy", color: "bg-yellow-100" },
  { emoji: "🦊", mood: "Calm", color: "bg-blue-100" },
  { emoji: "🐢", mood: "Tired", color: "bg-purple-100" },
  { emoji: "🦦", mood: "Anxious", color: "bg-orange-100" },
  { emoji: "🐰", mood: "Excited", color: "bg-pink-100" },
  { emoji: "🦋", mood: "Peaceful", color: "bg-green-100" },
] as const;

export const encouragementMessages = [
  "You did your best today, and that's something to be proud of! 🌟",
  "Every small step counts - you're doing amazing! 💪",
  "Take a deep breath - you're exactly where you need to be! 🌸",
  "Your feelings are valid and you're not alone! 🤗",
  "Rest is important - be kind to yourself! 💤",
  "You're growing stronger every day! 🌱",
  "Remember to celebrate the small victories! 🎉",
  "You're braver than you believe and stronger than you seem! 🦁",
  "Progress, not perfection - you're on the right path! 🌈",
  "Your kindness to yourself matters just as much as kindness to others! 💖",
] as const;
