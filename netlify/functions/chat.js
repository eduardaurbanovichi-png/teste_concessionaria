export async function handler(event, context) {
    // Permite apenas requisições do tipo POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { messages, model } = JSON.parse(event.body);
        
        // O Netlify busca a chave escondida nas variáveis de ambiente do servidor
        const apiKey = process.env.OPENROUTER_API_KEY; 

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Chave de API não configurada no Netlify." })
            };
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: model || 'google/gemini-2.5-flash',
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