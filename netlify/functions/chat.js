export async function handler(event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { messages, model } = JSON.parse(event.body);
        
        // Puxa a chave do Groq que configurou no painel do Netlify
        const apiKey = process.env.GROQ_API_KEY; 

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Chave de API do Groq não configurada no Netlify." })
            };
        }

        // Endpoint oficial do Groq Cloud
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model || 'llama3-8b-8192', // Modelo padrão caso falte no config
                messages: messages
            })
        });

        const data = await response.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
}
