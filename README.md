# 🐾 Cozy Critter v1.0.0
### Animal Themed Mood Tracker for Neurodivergent Minds

[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)](https://github.com/CatgirlRika/CozyCritters)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Privacy First](https://img.shields.io/badge/privacy-first-gold.svg)](#-privacy-promise--technical-proof)
[![Accessibility](https://img.shields.io/badge/accessibility-AAA-purple.svg)](#-what-v1-includes)

> A complete, production-ready app designed specifically for neurodivergent folks.

Cozy Critter is a gentle, private mood tracking app that actually understands ND life.

What makes it different:
- 🚫 No overwhelming interfaces
- 🚫 No judgment
- 🚫 No data harvesting
- ✨ Just you, cute animals, and a safe space for your feelings

Check in with adorable animal emoji, add your own notes when you want to, and get encouragement that really gets masking, sensory overwhelm, and executive function struggles.

Everything stays on your device because your emotional data is deeply personal.

---

## 📋 Quick Navigation
- [✨ What's Included](#-what-v1-includes)
- [🚀 Getting Started](#-how-to-run-locally)
- [🛡️ Privacy & Security](#-privacy-promise--technical-proof)
- [🏢 For Organizations](#-for-autism--neurodivergent-support-organizations)
- [🛠️ Technical Details](#-tech--architecture)
- [📚 Full Docs](docs/README.md)

---

## 🎉 V1.0.0 - What's Ready Now

This isn't a beta or "coming soon" — Cozy Critter v1 is complete and ready to be your daily mood companion.

### 🌟 Why V1 Matters for ND Folks

| Feature | Why It Matters |
|---------|----------------|
| No more waiting | All features work right now, no "premium" barriers |
| Stable and reliable | Won't break or change unexpectedly (we know how hard transitions are) |
| Actually finished | Unlike many apps that promise accessibility "later," everything works today |
| Your feedback shaped this | Built with real ND experiences in mind, not neurotypical assumptions |

## ✨ What V1 Includes

### 🐾 Animal Mood Check-ins
Choose from adorable animal emoji that match your energy.

No pressure to explain or justify — sometimes you just feel like:
- 🐨 A sleepy koala
- 🐰 An anxious rabbit
- 🦋 A gentle butterfly

All perfectly valid.

---

### 📝 Notes That Don't Judge
Add notes when you want to — never required.

Perfect for:
- 😮‍💨 Venting about masking all day
- 🎉 Celebrating small wins (did laundry = victory!)
- 🌊 Processing sensory overwhelm
- 📈 Tracking what actually helps your mood

---

### 💚 ND-Aware Encouragement
Get affirmations that actually understand your world:

> "Your stimming is valid and helpful"  
> "Masking is exhausting — you did great today"  
> "Executive dysfunction isn't laziness"  
> "Sensory breaks are self-care, not weakness"

Plus: Create your own personal encouragement messages.

---

### 🌸 Your Personal Garden
See your mood history in a gentle, visual timeline.

What you WON'T find:
- ❌ Judgment
- ❌ "Streaks" to maintain
- ❌ Pressure to be consistent

What you WILL find:
- ✅ Your authentic emotional journey
- ✅ Beautiful, gentle display
- ✅ Complete acceptance

---

### 🛡️ Privacy That's Actually Real
Everything stays on YOUR device.

We literally can't see your data even if we wanted to.

Proof:
- ✅ One-click delete (your control is real)
- ✅ No accounts required
- ✅ No tracking
- ✅ No "anonymous" data collection lies

---

### 📱 Works Everywhere, Anytime
- 📲 Install on your phone like a native app (PWA)
- 🌐 Works offline (because internet can be overwhelming)
- ♿ Accessible with screen readers and keyboard navigation
- 👁️ Respects your motion and contrast preferences

---

### 🎨 Three Thoughtful Themes
| Theme | Description |
|-------|-------------|
| ☀️ Light mode | Clean and gentle |
| 🌙 Dark mode | Easy on sensitive eyes |
| 🧩 Autism awareness | Warm, calming golden tones created specifically for our community |

## 🛠️ Tech & Architecture

### 🎨 Frontend Stack
- React with TypeScript for type safety
- Vite for fast dev/build cycles
- Tailwind CSS for cozy, consistent styles
- shadcn/ui (built on Radix primitives) for accessible UI components
- Wouter for simple page navigation
- Service Worker via dedicated `useServiceWorker` hook

### 💾 State & Storage
- Local Storage Only — All moods/notes stay in your browser
- No Server Required — Works completely offline
- Future Ready — Prepared for optional user accounts (if you want them later)

### 🖥️ Backend (Optional/Future)
- Express.js with TypeScript
- Drizzle ORM + PostgreSQL ready
- Reusable `requestLogger` middleware for development visibility
- Currently Not Required — App works without a backend

### ♿ Accessibility & Design
- Radix UI foundation for ARIA and keyboard support
- Animal-friendly colors with a warm, calming palette
- Mobile-first responsive layouts
- Screen reader optimized
- Motion sensitivity respected

## 🚀 How to Run Locally

### Quick Start (3 steps)

1. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

2. Start the dev server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Open in your browser
   ```
   http://localhost:5173
   ```

That's it! 🎉 No database setup, no API keys, no complicated configuration.

### Tests
```bash
npm test
```

## 🔐 Privacy Promise + Technical Proof

### 🎯 Our Claims

| Promise | What This Means |
|---------|------------------|
| No tracking, no accounts, no data collection | We literally cannot see your data |
| Everything stays on your device | Uses browser localStorage only |
| One click delete everything | Prove your privacy is real |
| Works offline | No internet required after first load |
| No external dependencies | Your mood data never leaves your device |

---

### 🔍 Verify Our Security Claims Yourself

Don't trust us — verify us!

Here's how to prove Cozy Critter's security claims with your own eyes:

### 🕵️ 5 Ways to Verify Our Claims

#### 1️⃣ Inspect Network Traffic
```bash
# Open Developer Tools (F12)
# Go to Network tab → Use the app normally
# Result: NO requests containing your mood data
```

#### 2️⃣ Examine Local Storage
```javascript
// Browser console (F12 → Console):
localStorage.getItem('cozy-critter-moods')
localStorage.getItem('cozy-critter-custom-messages')
// Shows data exists ONLY on your device
```

#### 3️⃣ Verify Offline Operation
```bash
# Turn off internet → App still works perfectly
# Your mood data is still accessible
# Proof: No external dependencies
```

#### 4️⃣ Review Source Code
We're open source — verify every claim:
- 📂 Mood Storage Logic: client/src/lib/mood-storage.ts — localStorage only
- 🗑️ Privacy Settings: client/src/components/privacy-settings.tsx — one-click delete
- 🔍 Search entire frontend: client/src — no mood data goes to servers

#### 5️⃣ Test Data Deletion
```bash
1. Add mood entries in the app
2. Go to Privacy & Data settings
3. Click "Delete All Data"
4. Check: localStorage.getItem('cozy-critter-moods') → null
```

### 🛡️ Technical Security Architecture

#### 💾 Client-Side Only Storage
```typescript
// From mood-storage.ts - all data operations
localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(moods));
localStorage.getItem(MOOD_STORAGE_KEY);
localStorage.removeItem(MOOD_STORAGE_KEY);
// No fetch(), no axios, no external APIs for mood data
```

#### 🚫 No Authentication = No Account Breaches
Search our entire codebase — you won't find:
- ❌ User login functions
- ❌ Password handling
- ❌ JWT tokens
- ❌ User session management

Why? Because we don't have accounts to breach!

#### 🌐 Offline-First PWA
```javascript
// Service Worker caches everything locally
caches.open(CACHE_NAME).then(cache => {
  return cache.addAll(STATIC_RESOURCES);
});
```

### 📊 Security Audit Results

#### ✅ Provably Secure
| Data Type | Security Level | Verification |
|-----------|----------------|--------------|
| Mood data | 100% local, never transmitted | Check Network tab |
| Custom messages | localStorage only | Browser console |
| App preferences | localStorage only | Browser console |
| User tracking | None — no analytics code | Source code review |
| External requests | None for personal data | Network tab |

#### ⚠️ Standard Web Risks (All Web Apps Have These)
- Dependency vulnerabilities — Standard npm issues (doesn't affect your data privacy)
- Browser security — Relies on your browser's security model

---

### 🔬 For Security Researchers

Penetration Testing Checklist:
- [ ] Network traffic analysis during app usage
- [ ] LocalStorage inspection and data flow mapping
- [ ] Offline functionality verification
- [ ] Source code review for external data transmission
- [ ] Privacy policy vs. actual behavior comparison

🐛 Found a security issue?  
Open a GitHub issue — we take security seriously and will address verified concerns immediately.

---

📋 Read our full Privacy Policy: [privacy-policy.md](privacy-policy.md)

Spoiler: we can't access your data even if we wanted to!

## 📄 Open Source & Free Forever

### 🆓 MIT Licensed Benefits

| Freedom | What This Means for You |
|---------|--------------------------|
| Free to use | Individuals, nonprofits, organizations — everyone |
| Free to modify | Customize for your community's needs |
| Free to share | Spread the accessibility love |
| Transparent | All code visible, nothing hidden |
| Community-driven | Your feedback and contributions welcome |

---

Because mental health tools shouldn't be locked behind paywalls or corporate control.

## 💝 Why This App "Gets It"

Built by understanding, not assumptions.

---

### 🧠 Executive Function Friendly

| Challenge | How We Help |
|-----------|-------------|
| Overwhelming choices | Simple, clear options only |
| Complex workflows | Quick check-ins or detailed notes — your choice |
| Confusing navigation | Visual navigation that makes sense |
| Guilt-inducing streaks | No pressure to be consistent |

---

### 👥 Masking Awareness

We acknowledge that:
- 😴 Masking is exhausting (you did great today)
- 🏠 You need a safe space for authentic feelings
- 🚫 "Just think happy thoughts" isn't helpful
- 💪 Some days are about survival, not thriving

---

### 🌈 Sensory Considerations

Designed to be gentle:
- ✨ Clean, uncluttered interface
- 🎭 Respects motion sensitivity preferences
- 🎨 Multiple themes for different sensory needs
- 🚫 No sudden animations or jarring transitions

---

### ♾️ Stimming & Self-Regulation Support

Our philosophy:
- ✅ Stimming is helpful, not "disruptive"
- 🤗 Whatever helps you regulate is valid
- 🚫 No judgment about "weird" coping strategies
- 🌟 Celebrates your unique ways of managing the world

## 🚀 V1 is Complete — What's Next?

### 🎯 V1.0.0 has everything you need right now.

Possible future enhancements:

| Feature | Description | Status |
|---------|-------------|--------|
| 📤 Data export | Download your garden as a file you own | Maybe |
| 🐾 More animals | Expand beyond current adorable selection | Maybe |
| 📊 Pattern insights | Gentle observations (never judgment) | Maybe |
| 👥 Community features | If and when our community wants them | Maybe |

### 💡 But honestly?

V1 is already complete and useful.

You don't need to wait for "more features" to start taking better care of your emotional wellbeing.

Start today. Your mental health matters now.

## 🏢 For Autism & Neurodivergent Support Organizations

Are you a nonprofit, support group, or organization serving the autistic/ND community?

Cozy Critter v1.0.0 is completely free and open source — perfect for your community programs.

---

### 🎯 Why Your Community Will Love This

| Benefit | Impact |
|---------|--------|
| Privacy-first design | No data concerns for vulnerable individuals |
| No accounts required | Removes barriers and privacy worries |
| Actually accessible | Built with real ND input, not compliance checkboxes |
| Works offline | Great for individuals with limited internet access |
| Trauma-informed | No forced positivity or invalidating messaging |

---

### 💡 How Organizations Can Use Cozy Critter

#### 👥 Client Support
- 💬 Therapy support — Clients track moods privately between sessions
- 🏫 Workshop tool — Demonstrate self-advocacy and emotional awareness
- 🌱 Community programs — Share as resource without data collection concerns

#### 👨‍💼 Staff & Education
- 🧝 Staff wellbeing — Your ND staff and volunteers can benefit too!
- 🏭 Educational settings — Help students develop emotional vocabulary safely

---

### 🆓 MIT Licensed = Maximum Freedom

✅ No licensing fees (ever, for anyone)  
✅ No user limits (share with your entire community)  
✅ No premium features (everything works for everyone)  
✅ Host it yourself (full control over deployment and data)  
✅ Modify freely (customize for your organization's needs)  
✅ Transparent code (verify our privacy promises yourself)

---

### 🤝 Want to Collaborate?

We'd love to hear how your organization uses Cozy Critter!

Contact us about:
- 🚀 Custom deployment assistance
- 📚 Training materials for staff
- 💬 Feedback on features for your programs
- ♿ Collaboration on accessibility improvements

---

Your community's wellbeing matters. Let's make emotional self-care accessible together.

## 💚 Questions or Want to Contribute?

Open an issue or reach out!

Friendly contributions and suggestions are always welcome.

---

## 📞 For Organizations & Partnerships

Interested in using Cozy Critter for your autism/ND programs?

We're here to support organizations making a real difference in the ND community.

### 🔗 Partnership Opportunities
- 🤝 Community partnerships
- 🚀 Custom deployment assistance
- 📚 Staff training materials
- ♿ Accessibility feedback and improvements
- 📜 Grant writing support for digital wellness programs

---

Open source, privacy-first tools should serve everyone — especially marginalized communities.

---

## 🌟 Final Words

Cozy Critter v1.0.0 — Made with 💚 by people who understand that your brain works beautifully, just differently.

> Finally, a mood tracking app that doesn't try to "fix" you.

---

📜 Licensed under MIT — See [LICENSE](LICENSE) file for full details.