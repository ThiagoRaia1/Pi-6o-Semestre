const API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const BASE_URL = "https://api.groq.com/openai/v1";

async function requestGroq(endpoint: string, body: any) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "Você fez muitas requisições em pouco tempo. Tente novamente em instantes."
      );
    }
    const errorData = await response.text();
    throw new Error(`Erro na API: ${errorData}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export const gerarPlanoDeAula = async (prompt: string[]) => {
  try {
    const body = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente para gerar um planejamento de aula de pilates baseado nas dificuldades que lhe forem informadas. Cada linha corresponde a um aluno.",
        },
        { role: "user", content: prompt.join("\n") },
      ],
      temperature: 1,
    };

    return await requestGroq("/chat/completions", body);
  } catch (erro: any) {
    console.error(erro.message);
    return `Erro ao gerar resposta. ${erro.message}`;
  }
};