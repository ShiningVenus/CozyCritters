interface NDAffirmationProps {
  type?: 'sensory' | 'executive' | 'social' | 'general';
}

const affirmations = {
  sensory: [
    "Your sensory needs are valid and important 🎧",
    "It's okay to step away when things feel too much 🌊",
    "Your body knows what it needs - trust it 🤗",
    "Stimming helps your nervous system - embrace it! 🌀"
  ],
  executive: [
    "Executive function challenges are real - you're not lazy 🧠",
    "One task at a time is perfectly okay ✅",
    "Breaking things down into smaller steps is smart! 📝",
    "Your brain just processes differently - that's not wrong 💭"
  ],
  social: [
    "Masking is exhausting - you deserve to rest 😌",
    "Social energy is limited and precious ⚡",
    "You don't owe anyone small talk or eye contact 👁️",
    "Your communication style is valid, even if it's different 💬"
  ],
  general: [
    "You are not broken - you are beautifully different 🌈",
    "Your special interests bring joy and that's wonderful! ✨",
    "Bad brain days are temporary - be gentle with yourself 🕯️",
    "You belong in this world exactly as you are 🌍"
  ]
};

export function NDAffirmation({ type = 'general' }: NDAffirmationProps) {
  const randomAffirmation = affirmations[type][Math.floor(Math.random() * affirmations[type].length)];
  
  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700/50 rounded-lg p-4 mt-4">
      <div className="text-center">
        <p className="text-purple-800 dark:text-purple-200 font-medium text-sm">
          💜 ND Reminder: {randomAffirmation}
        </p>
      </div>
    </div>
  );
}