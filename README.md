# 🐾 Cozy Critter Mood Tracker

A gentle, neurodivergent-friendly mood tracking app that helps you check in with your feelings through cute animal friends.

## ✨ What is Cozy Critter?

Cozy Critter is a simple, private mood tracking app designed with neurodivergent folks in mind. Track your feelings with adorable animal emojis, add personal notes, and get encouraging messages that understand your unique experiences.

**Your data stays completely private** - everything is stored only on your device, never shared or uploaded anywhere.

## 🌟 Features

### Mood Tracking Made Simple
- **Animal emoji check-ins**: Pick from friendly creatures that match your mood
- **Optional notes**: Add details when you want to, skip when you don't
- **Your personal garden**: See your mood history in a timeline called "My Garden"
- **Delete entries**: Remove any mood entries you no longer want

### Neurodivergent-Friendly Design
- **Understanding messages**: Encouragement that acknowledges masking, stimming, sensory needs, and executive function
- **Custom messages**: Create your own encouraging messages
- **Accessibility first**: Screen reader support, keyboard navigation, and clear visual design
- **Sensory considerations**: Respects your motion and contrast preferences

### Works Everywhere
- **Progressive Web App**: Install on your phone like a native app
- **Offline support**: Works even without internet connection
- **Dark/light modes**: Switches automatically or manually to match your preference
- **Mobile-first**: Designed for phones but works great on computers too

## 🚀 Getting Started

### Quick Start (For Users)

1. **Open the app** in your web browser
2. **Pick an animal** that matches how you're feeling right now
3. **Add a note** if you want to (totally optional!)
4. **Get encouragement** - the app will share a supportive message
5. **View your garden** - see all your past check-ins in one place

### Installing as an App

When you first visit, you might see a prompt to "Install Cozy Critter". Tap **Install** to add it to your home screen like any other app!

## 🛠️ For Developers

### What's Inside

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with custom cozy colors
- **Storage**: Local browser storage (no server needed!)
- **Accessibility**: Built with screen readers and keyboard navigation in mind
- **PWA**: Full offline support and installable

### Running the Project

1. **Install everything**: `npm install`
2. **Start developing**: `npm run dev`
3. **Open your browser** to the URL shown (usually http://localhost:5173)

### Project Structure

```
client/                 # Frontend React app
├── src/
│   ├── components/    # Reusable UI pieces
│   ├── pages/         # Different app screens
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Helper functions and storage
│   └── contexts/      # App-wide state (like themes)
server/                # Backend (minimal, mostly serves the app)
shared/                # Code shared between frontend and backend
```

### Key Files to Know

- `client/src/lib/mood-storage.ts` - How moods are saved and loaded
- `client/src/components/mood-check-in.tsx` - Main mood selection interface
- `client/src/components/custom-messages.tsx` - Encouragement message management
- `shared/schema.ts` - Data structure definitions

## 🌈 Accessibility Features

This app is built accessibility-first:

- **Screen reader friendly**: All buttons and content properly labeled
- **Keyboard navigation**: Use Tab, Enter, and arrow keys to navigate
- **High contrast support**: Respects your system's contrast preferences  
- **Motion sensitivity**: Honors your reduced motion preferences
- **Clear language**: Simple, jargon-free text throughout
- **Visual cues**: Colors paired with icons and text for clarity

## 💝 Neurodivergent Considerations

We understand that neurodivergent brains work differently, so Cozy Critter includes:

- **No pressure tracking**: Add notes only when you want to
- **Executive function support**: Simple, clear interfaces that don't overwhelm
- **Masking awareness**: Messages that acknowledge the effort of masking
- **Stimming positivity**: Encouraging words about natural self-regulation
- **Sensory understanding**: Recognition of sensory processing differences
- **Flexible interaction**: Multiple ways to interact with features

## 🔐 Privacy & Data

**Your privacy matters.** 

- All your mood data stays on YOUR device
- No accounts required, no sign-ups needed  
- No data is ever sent to servers or shared
- You can delete the app anytime and all data goes with it
- Works completely offline once loaded

## 🐛 Having Issues?

The app is designed to be simple and reliable, but if something seems wrong:

1. **Try refreshing** the browser page
2. **Check if you're offline** - a small indicator will show your connection status
3. **Clear browser data** if things seem stuck (note: this will delete your mood history)

## 💚 Contributing

This project welcomes contributions that maintain its neurodivergent-friendly and accessibility-first approach. Please keep changes simple, well-documented, and considerate of different brain types and abilities.

## 📄 License

This project is open source and available under the MIT License.

---

Made with 💝 for the neurodivergent community and anyone who wants a gentle, private way to track their emotional wellbeing.