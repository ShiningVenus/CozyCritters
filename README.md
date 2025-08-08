# Cozy Critter v1.0.0 - Animal Themed Mood Tracker

**A complete, production-ready app designed specifically for neurodivergent folks.**

Cozy Critter is a gentle, private mood tracking app that actually understands ND life. No overwhelming interfaces, no judgment, no data harvesting - just you, cute animals, and a safe space to check in with your feelings.

Check in with adorable animal emoji, add your own notes when you want to, and get encouragement that really gets masking, sensory overwhelm, and executive function struggles. Everything stays on your device because your emotional data is deeply personal.

## 🎉 V1.0.0 - What's Ready Now

**This isn't a beta or "coming soon" - Cozy Critter v1 is complete and ready to be your daily mood companion.**

### Why V1 Matters for ND Folks:
- **No more waiting** - All features work right now, no "premium" barriers
- **Stable and reliable** - Won't break or change unexpectedly (we know how hard transitions are)
- **Actually finished** - Unlike many apps that promise accessibility "later," everything works today
- **Your feedback shaped this** - Built with real ND experiences in mind, not neurotypical assumptions

## ✨ What V1 Includes

### 🐾 **Animal Mood Check-ins**
Choose from adorable animal emoji that match your energy. No pressure to explain or justify - sometimes you just feel like a sleepy koala or an anxious rabbit, and that's perfectly valid.

### 📝 **Notes That Don't Judge** 
Add notes when you want to - never required. Great for:
- Venting about masking all day
- Celebrating small wins (did laundry = victory!)
- Processing sensory overwhelm
- Tracking what actually helps your mood

### 💚 **ND-Aware Encouragement**
Get affirmations that actually understand your world:
- "Your stimming is valid and helpful"
- "Masking is exhausting - you did great today"
- "Executive dysfunction isn't laziness"
- "Sensory breaks are self-care, not weakness"
Plus create your own personal encouragement messages.

### 🌸 **Your Personal Garden**
See your mood history in a gentle, visual timeline. No judgment, no "streaks" to maintain - just your authentic emotional journey displayed beautifully.

### 🛡️ **Privacy That's Actually Real**
Everything stays on YOUR device. We literally can't see your data even if we wanted to. One-click delete proves your control is real. No accounts, no tracking, no "anonymous" data collection lies.

### 📱 **Works Everywhere, Anytime**
- Install on your phone like a native app
- Works offline (because internet can be overwhelming)
- Accessible with screen readers and keyboard navigation
- Respects your motion and contrast preferences

### 🎨 **Three Thoughtful Themes**
- **Light mode** - Clean and gentle
- **Dark mode** - Easy on sensitive eyes
- **Autism awareness** - Warm, calming golden tones created specifically for our community

## 🛠️ Tech & Architecture

**Frontend:**  
React (with TypeScript), Vite for fast dev/build, Tailwind CSS for cozy styles, shadcn/ui for accessible UI, and Wouter for simple page navigation. Service worker registration is handled by a dedicated `useServiceWorker` hook to keep the app shell lean.

**State & Storage:**  
All moods/notes are stored locally in your browser. The app is ready for future features like user accounts, but you don't need one now.

**Backend (future ready):**  
Express.js with TypeScript, Drizzle ORM, and PostgreSQL for possible future login or sync, with a reusable `requestLogger` middleware for development visibility. This is currently not required.

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

## 🔐 Privacy Promise + Technical Proof

### **Our Claims:**
- **No tracking, no accounts, no data collection**
- **Everything stays on your device** (browser localStorage)
- **One click delete everything** - prove your privacy is real
- **Works offline** - no internet required after first load
- **No external dependencies** for your personal mood data

### 🔍 **Verify Our Security Claims Yourself**

**Don't trust us - verify us!** Here's how to prove Cozy Critter's security claims with your own eyes:

#### **1. Inspect Network Traffic**
```bash
# Open your browser's Developer Tools (F12)
# Go to the Network tab
# Use the app normally - add moods, create messages
# You'll see: NO requests containing your personal mood data
```

#### **2. Examine Local Storage**
```javascript
// In browser console (F12 → Console), run:
localStorage.getItem('cozy-critter-moods')
localStorage.getItem('cozy-critter-custom-messages')
// This shows your data exists ONLY on your device
```

#### **3. Verify Offline Operation**
```bash
# Turn off your internet connection
# The app still works perfectly
# Your mood data is still accessible
# Proof: No external dependencies for your data
```

#### **4. Review Source Code**
Since we're open source, you can verify every claim:
- **[Mood Storage Logic](client/src/lib/mood-storage.ts)** - See how we use only localStorage
- **[Privacy Settings](client/src/components/privacy-settings.tsx)** - See the one-click delete in action
- **[No API calls for mood data](client/src)** - Search the entire frontend - no mood data goes to servers

#### **5. Test Data Deletion**
```bash
# 1. Add some mood entries in the app
# 2. Go to Privacy & Data settings
# 3. Click "Delete All Data"
# 4. Check localStorage again:
localStorage.getItem('cozy-critter-moods') // Returns null
# Proof: Your data is gone completely
```

### 🛡️ **Technical Security Architecture**

**Client-Side Only Storage:**
```typescript
// From mood-storage.ts - all data operations
localStorage.setItem(MOOD_STORAGE_KEY, JSON.stringify(moods));
localStorage.getItem(MOOD_STORAGE_KEY);
localStorage.removeItem(MOOD_STORAGE_KEY);
// No fetch(), no axios, no external APIs for mood data
```

**No Authentication = No Account Breaches:**
```typescript
// Search our entire codebase - you won't find:
// - User login functions
// - Password handling
// - JWT tokens
// - User session management
// Because we don't have accounts to breach!
```

**Offline-First PWA:**
```javascript
// Service Worker proves offline capability
// From sw.js - caches everything locally
caches.open(CACHE_NAME).then(cache => {
  return cache.addAll(STATIC_RESOURCES);
});
```

### 📊 **Security Audit Results**

**What's Provably Secure:**
✅ **Mood data** - 100% local, never transmitted  
✅ **Custom messages** - localStorage only  
✅ **App preferences** - localStorage only  
✅ **No user tracking** - No analytics code anywhere  
✅ **No external data requests** - Verify in Network tab  

**Standard Web Risks (like all web apps):**
⚠️ **Dependency vulnerabilities** - Standard npm security issues (not affecting your data privacy)  
⚠️ **Browser security** - Relies on your browser's security model  

### 🔬 **For Security Researchers**

**Penetration Testing Checklist:**
- [ ] Network traffic analysis during normal app usage
- [ ] LocalStorage inspection and data flow mapping
- [ ] Offline functionality verification
- [ ] Source code review for external data transmission
- [ ] Privacy policy vs. actual behavior comparison

**Found a security issue?** Open a GitHub issue - we take security seriously and will address verified concerns immediately.

📋 **[Read our full Privacy Policy](privacy-policy.md)** - See exactly how we protect your data (spoiler: we can't access it even if we wanted to!)

## 📄 **Open Source & Free Forever**

**Cozy Critter is MIT Licensed** - which means:
- ✅ **Free to use** - individuals, nonprofits, organizations, everyone
- ✅ **Free to modify** - customize it for your community's needs
- ✅ **Free to share** - spread the accessibility love
- ✅ **Transparent** - all code is visible, nothing hidden
- ✅ **Community-driven** - your feedback and contributions welcome

*Because mental health tools shouldn't be locked behind paywalls or corporate control.*

## 💝 Why This App "Gets It"

**Built by understanding, not assumptions:**

### 🧠 **Executive Function Friendly**
- No overwhelming choices or complex workflows
- Quick check-ins when you have energy, detailed notes when you don't
- Visual navigation that makes sense
- No guilt-inducing "streaks" or pressure to be consistent

### 👥 **Masking Awareness**
- Encouragement that acknowledges how exhausting masking is
- Safe space to be authentic about your real feelings
- No forced positivity or "just think happy thoughts"
- Recognition that some days are about survival, not thriving

### 🌈 **Sensory Considerations**
- Clean, uncluttered design that won't overwhelm
- Respects your motion sensitivity preferences
- Multiple theme options for different sensory needs
- No sudden animations or jarring transitions

### ♾️ **Stimming & Self-Regulation Support**
- Validates stimming as helpful, not "disruptive"
- Encourages whatever helps you regulate
- No judgment about "weird" coping strategies
- Celebrates your unique ways of managing the world

## 🚀 V1 is Complete - What's Next?

**V1.0.0 has everything you need right now.** Future versions might include:

- **Data export** - Download your garden as a file you own
- **More animals** - Expand beyond the current adorable selection
- **Pattern insights** - Gentle observations (never judgment) about your moods
- **Community features** - If and when our community wants them

**But honestly?** V1 is already a complete, useful app. You don't need to wait for "more features" to start taking better care of your emotional wellbeing.

## 🏢 For Autism & Neurodivergent Support Organizations

**Are you a nonprofit, support group, or organization serving the autistic/ND community?**

Cozy Critter v1.0.0 is **completely free and open source** - perfect for your community programs.

### 🎯 **Why Your Community Will Love This**
- **Privacy-first design** - No data concerns for vulnerable individuals
- **No accounts required** - Removes barriers and privacy worries
- **Actually accessible** - Built with real ND input, not compliance checkboxes
- **Works offline** - Great for individuals with limited internet access
- **Trauma-informed** - No forced positivity or invalidating messaging

### 💡 **How Organizations Can Use Cozy Critter**
- **Therapy support** - Clients can track moods between sessions privately
- **Workshop tool** - Demonstrate self-advocacy and emotional awareness
- **Community programs** - Share as a resource without data collection concerns
- **Staff wellbeing** - Even your ND staff and volunteers can benefit!
- **Educational settings** - Help students develop emotional vocabulary safely

### 🆓 **MIT Licensed = Maximum Freedom**
- **No licensing fees** - Ever, for anyone
- **No user limits** - Share with your entire community
- **No premium features** - Everything works for everyone
- **Host it yourself** - Full control over deployment and data
- **Modify freely** - Customize for your organization's specific needs
- **Transparent code** - Verify our privacy promises yourself

### 🤝 **Want to Collaborate?**
We'd love to hear how your organization uses Cozy Critter or how we can make it even better for your community. Reach out for:
- Custom deployment assistance
- Training materials for staff
- Feedback on features that would help your programs
- Collaboration on accessibility improvements

*Your community's wellbeing matters. Let's make emotional self-care accessible together.*

## 💚 Questions or want to contribute?

Open an issue or reach out. Friendly contributions and suggestions are always welcome!

---

---

**Cozy Critter v1.0.0** - Made with 💚 by people who understand that your brain works beautifully, just differently.

*Finally, a mood tracking app that doesn't try to "fix" you.*

---

### 📞 **For Organizations & Partnerships**
Interested in using Cozy Critter for your autism/ND programs? Want to collaborate or need deployment help? We're here to support organizations making a real difference in the ND community.

**Contact us about:**
- Community partnerships
- Custom deployment assistance  
- Staff training materials
- Accessibility feedback and improvements
- Grant writing support for digital wellness programs

*Open source, privacy-first tools should serve everyone - especially marginalized communities.*

**📜 Licensed under MIT** - See [LICENSE](LICENSE) file for full details.