# WhatsUp Video Calling App

WhatsUp is a modern, responsive video calling web app built with Next.js, TypeScript, and Agora RTC. It features a beautiful grid layout for participants, mute/video controls, and works great on desktop and mobile. Easily deployable to GitHub Pages!

## Features

- ⚡ Real-time video calls powered by Agora RTC
- 🎨 Responsive grid layout for 1-12+ participants
- 🎥 Toggle video and mute/unmute microphone
- 🏷️ Participant name labels
- 📱 Mobile-friendly design
- 🏠 Add to homescreen instructions
- 🚀 Static export for GitHub Pages

## Getting Started

1. **Clone the repo**
   ```bash
   git clone https://github.com/Sindreglo/sinneglo.github.io.git
   cd sinneglo.github.io
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set your Agora App ID**
   - Copy `.env.example` to `.env`
   - Add your `NEXT_PUBLIC_AGORA_APP_ID` from [Agora Console](https://console.agora.io/)

4. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Customization

- **Primary color & theme:** Edit `styles/variables.scss` for easy color changes.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router, TypeScript)
- [Agora RTC](https://www.agora.io/en/) (agora-rtc-react)
- [Sass/SCSS](https://sass-lang.com/)
- [React Icons](https://react-icons.github.io/)

## License

MIT

---

Made by [Sindreglo](https://github.com/Sindreglo)
