# Cozy Critter - Animal Themed Mood Tracker

Cozy Critter is a neurodivergent friendly mood tracking app that makes emotional self-care gentle, private, and fun.

Check in with adorable animal emoji, add your own notes, and get encouragement that really gets ND life. All your data stays on your device. No accounts, no cloud, no stress.

## ✨ Features

**Animal emoji mood check in**  
Choose the animal that matches how you feel today.

**Optional notes**  
Write a quick note with any mood. Useful for journaling, venting, or celebrating!

**Custom encouragement**  
Get (or even create) affirmations tailored to neurodivergent needs: masking, stimming, executive function, sensory breaks, and more.

**Mood history ("My Garden")**  
Review your past moods and notes in a cozy visual timeline.

**Complete privacy & data control**  
Data is saved only in your browser (localStorage). It never leaves your device. Delete everything with one button to prove your privacy is real.

**Installable & offline**  
Works offline and can be added to your phone's home screen as an app.

**Accessibility built in**  
Keyboard navigation, screen reader support, color contrast, and respects motion preferences.

## 🛠️ Tech & Architecture

**Frontend:**  
React (with TypeScript), Vite for fast dev/build, Tailwind CSS for cozy styles, shadcn/ui for accessible UI, and Wouter for simple page navigation.

**State & Storage:**  
All moods/notes are stored locally in your browser. The app is ready for future features like user accounts, but you don't need one now.

**Backend (future ready):**  
Express.js with TypeScript, Drizzle ORM, and PostgreSQL for possible future login or sync. This is currently not required.

**Accessibility & Design:**  
Uses Radix UI for solid ARIA and keyboard support, warm animal friendly color palette, and responsive/mobile first layouts.

## 🚀 How to Run Locally

**Install dependencies:**
```bash
npm install
# or
yarn
```

**Start the dev server:**
```bash
npm run dev
# or  
yarn dev
```

**Open in your browser:**  
Usually at http://localhost:5173

## 🔐 Privacy Promise

- **No tracking, no accounts, no data collection**
- **Everything stays on your device** (browser localStorage)
- **One click delete everything** - prove your privacy is real
- **Works offline** - no internet required after first load
- **No external dependencies** for your personal mood data

📋 **[Read our full Privacy Policy](privacy-policy.md)** - See exactly how we protect your data (spoiler: we can't access it even if we wanted to!)

## 💝 Neurodivergent Friendly Features

- **Understanding encouragement** for masking, stimming, sensory needs, executive function
- **No pressure** - add notes only when you want to
- **Simple, clear interfaces** that don't overwhelm
- **Flexible interaction** - multiple ways to use features
- **Gentle design** that respects different brain types

## 💡 Next Steps / Ideas

- Export your garden as a file
- More animal themes and custom encouragements
- Mood statistics and patterns
- Enhanced PWA features

## 💚 Questions or want to contribute?

Open an issue or reach out. Friendly contributions and suggestions are always welcome!

---

Made with 💝 for gentle mood tracking and neurodivergent self-care.