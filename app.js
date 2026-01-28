// RapidAPI Configuration
// IMPORTANT: Copy config.js.example to config.js and add your RapidAPI key
// DO NOT commit your actual API key to GitHub
const RAPIDAPI_URL = 'https://flux-api-4-custom-models-100-style.p.rapidapi.com/motivational-speech';

// Try to load API key from config.js if it exists
let apiKey = null;
try {
    if (typeof CONFIG !== 'undefined' && CONFIG.RAPIDAPI_KEY) {
        apiKey = CONFIG.RAPIDAPI_KEY;
    }
} catch (e) {
    // config.js not found or invalid, apiKey remains null
}

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
    if (!text) return;

    if (!apiKey) {
        addMessage('**Error:** API key not configured. Please copy config.js.example to config.js and add your RapidAPI key.', 'ai');
        return;
    }

    if (welcomeScreen) {
        welcomeScreen.remove();
    }

    addMessage(text, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';

    toggleInput(false);
    showTyping(true);

    try {
        const response = await callRapidAPI(text);
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

async function callRapidAPI(prompt) {
    const response = await fetch(RAPIDAPI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-rapidapi-host': 'flux-api-4-custom-models-100-style.p.rapidapi.com',
            'x-rapidapi-key': apiKey
        },
        body: JSON.stringify({ prompt: prompt })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch response');
    }

    const data = await response.json();
    return data;
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

