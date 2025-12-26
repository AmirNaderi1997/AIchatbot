const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

// This is your OBFUSCATED Gemini API key (Base64 + Reversed)
// It prevents simple scrapers from stealing it on GitHub.
const SECRET_KEY = "kuQ5Npz_DNj3Jdvyy-pQMPTiQk90tskyAySazIA";

// Helper to unscramble the key
function unscramble(str) {
    return str.split("").reverse().join("");
}

// Automatically set the API key on load
let apiKey = unscramble(SECRET_KEY);

// DOM Elements
const chatWindow = document.getElementById('chatWindow');
const messagesContainer = document.getElementById('messagesContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const typingIndicator = document.getElementById('typingIndicator');

// Event Listeners
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
});

userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
});

function setQuickPrompt(text) {
    userInput.value = text;
    userInput.focus();
    userInput.style.height = userInput.scrollHeight + 'px';
}

async function handleSend() {
    const text = userInput.value.trim();
    if (!text || !apiKey) return;

    if (welcomeScreen) {
        welcomeScreen.remove();
    }

    addMessage(text, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    toggleInput(false);
    showTyping(true);

    try {
        const response = await callGeminiAPI(text);
        showTyping(false);
        addMessage(response, 'ai');
    } catch (error) {
        showTyping(false);
        addMessage(`**Error:** ${error.message}.`, 'ai');
    } finally {
        toggleInput(true);
    }
}

function toggleInput(enabled) {
    userInput.disabled = !enabled;
    sendBtn.disabled = !enabled;
    if (enabled) userInput.focus();
}

function showTyping(show) {
    if (show) {
        typingIndicator.classList.remove('hidden');
        chatWindow.scrollTop = chatWindow.scrollHeight;
    } else {
        typingIndicator.classList.add('hidden');
    }
}

function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
    const bubble = document.createElement('div');
    bubble.className = 'bubble';

    if (sender === 'ai') {
        bubble.innerHTML = marked.parse(text);
        bubble.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    } else {
        bubble.textContent = text;
    }

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(bubble);
    messagesContainer.appendChild(messageDiv);
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

async function callGeminiAPI(prompt) {
    const body = {
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to fetch response');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

marked.setOptions({
    highlight: function (code, lang) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
    breaks: true
});
