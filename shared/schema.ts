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
  { emoji: "🦔", mood: "Overwhelmed", color: "bg-red-100" },
  { emoji: "🐨", mood: "Content", color: "bg-green-100" },
] as const;

export const encouragementMessages = [
  "You did your best today, and that's something to be proud of! 🌟",
  "Every small step counts - you're doing amazing! 💪",
  "Take a deep breath - you're exactly where you need to be! 🌸",
  "Your feelings are valid and you're not alone! 🤗",
  "Rest is important - be kind to yourself! 💤",
  "You're growing stronger every day! 🌱",
  "Remember to celebrate the small victories! 🎉",
  "Your brain works beautifully in its own unique way! 🧠✨",
  "It's okay to need breaks - your energy is precious! 🌿",
  "Masking is exhausting - you're safe to be yourself here! 🎭➡️😌",
  "Your sensory needs matter - honor what feels right! 🌈",
  "Stimming is self-care - move in ways that feel good! 🤲",
  "Executive function struggles are valid - you're not lazy! ⚡",
  "Your special interests bring joy - embrace what you love! 💫",
  "Social battery low? That's totally normal and okay! 🔋",
  "Routine changes are hard - give yourself extra kindness! 🗓️",
  "Your way of processing emotions is valid and important! 🧩",
  "Bad brain days happen - tomorrow is a fresh start! 🌅",
  "You're not 'too much' or 'not enough' - you're just right! 💝",
  "Different doesn't mean broken - neurodiversity is beautiful! 🌺",
] as const;
