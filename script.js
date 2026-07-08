import CONFIG from './config.js';
import { FRANCISCO_PROMPT } from './prompt.js';

const chatBox = document.getElementById('chatBox');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let memoryContext = [
    { role: "system", content: FRANCISCO_PROMPT }
];

function appendMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    userInput.value = '';

    memoryContext.push({ role: "user", content: text });

    try {
        // Agora chamamos a nossa rota serverless segura do Netlify
        const response = await fetch("/.netlify/functions/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: CONFIG.MODEL,
                messages: memoryContext
            })
        });

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;

        appendMessage('assistant', assistantMessage);
        memoryContext.push({ role: "assistant", content: assistantMessage });

    } catch (error) {
        console.error("Erro na comunicação:", error);
        appendMessage('assistant', "Desculpe-me, tive um pequeno imprevisto técnico aqui na concessionária. Poderia repetir?");
    }
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});