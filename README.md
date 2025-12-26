# GlowAI - Premium AI Chatbot ✨

GlowAI is a beautiful, stylish, and responsive AI chatbot built with Vanilla JS, CSS, and HTML. It uses the **Google Gemini 1.5 Flash API** for powerful and fast AI responses. It is designed to be easily hosted on **GitHub Pages**.

## 🚀 Features
- **Premium Aesthetics**: Glassmorphism, dynamic background glow, and smooth animations.
- **Markdown Support**: Beautifully rendered markdown responses.
- **Syntax Highlighting**: Code blocks are automatically highlighted (Highight.js).
- **Responsive Design**: Works perfectly on desktop and mobile.
- **Zero Configuration Hosting**: Ready to be deployed as a static site.
- **Secure Key Storage**: API keys are stored locally in your browser (LocalStorage).

## 🛠️ Setup & Deployment

### 1. Get your API Key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and create a free key.

### 2. Local Setup
1. Copy `config.js.example` to `config.js`:
   ```bash
   cp config.js.example config.js
   ```
2. Open `config.js` and paste your API key inside.
3. Open `index.html` in your browser.

### 3. Hosting on GitHub Pages
1. Push your files to GitHub. **The `config.js` file is ignored by git**, so your key remains safe.
2. When you visit your hosted site (e.g., `username.github.io/repo`), the app will ask you for an API key via a stylish popup.
3. Enter your key once; it will be saved in your browser's LocalStorage and you're good to go!

## 🎨 Technologies Used
- **Google Gemini API**: For AI capabilities.
- **Marked.js**: For markdown parsing.
- **Highlight.js**: For code syntax highlighting.
- **Font Awesome**: For premium icons.
- **Google Fonts (Outfit & Inter)**: For modern typography.

## 📝 License
MIT License. Feel free to use and customize!
# AIchatbot
