const chatEl = document.getElementById('chat');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

const GEMINI_API_KEY = "AIzaSyDW0f9-urspz0qR_-nG01qAIdQAgkrV0v4";
const GEMINI_MODEL = "gemini-2.0-flash:generateContent";

let conversationHistory = [{ role:"model", parts:[{text:"Hello! I'm Jarvis, your AI assistant."}]}];

appendMessage("Jarvis","Hello! I'm Jarvis, your AI assistant.");

// Send message
sendBtn.addEventListener('click', ()=>{ handleMessage(userInput.value); userInput.value=''; });
userInput.addEventListener('keypress', (e)=>{ if(e.key==='Enter'){ handleMessage(userInput.value); userInput.value=''; } });

async function handleMessage(msg){
    if(!msg.trim()) return;
    appendMessage("You", msg);
    conversationHistory.push({role:"user", parts:[{text:msg}]});
    appendMessage("Jarvis","Thinking...");
    const reply = await geminiChat(conversationHistory);
    chatEl.lastChild.remove(); // remove 'Thinking...'
    appendMessage("Jarvis", reply);
    conversationHistory.push({role:"model", parts:[{text:reply}]});
}

// Display message
function appendMessage(sender,text){
    const div = document.createElement('div');
    div.textContent = `${sender}: ${text}`;
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
}

// Gemini API call
async function geminiChat(history){
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`;
    const body = { contents: history, generationConfig: { temperature:0.7, maxOutputTokens:450 } };
    try{
        const resp = await fetch(url,{
            method:"POST",
            headers: { "Content-Type":"application/json", "X-goog-api-key": GEMINI_API_KEY },
            body: JSON.stringify(body)
        });
        const data = await resp.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return text || "No response from Gemini.";
    } catch(e){
        console.error(e);
        return "Error connecting to Gemini API.";
    }
}
