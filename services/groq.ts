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

export const gerarPlanoDeAula = async (descricoes: string[]) => {
  try {
    const listaDeAlunos = descricoes
      .map((d, i) => `Aluno ${i + 1}: ${d}`)
      .join("\n");

    console.log(listaDeAlunos);

    const body = {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
                    Você é um assistente especializado em criação de planejamentos de aulas de Pilates.

                    Sua função:
                    - Ler a lista de alunos enviada pelo usuário
                    - Cada linha representa um aluno diferente
                    - Gerar um plano INDIVIDUALIZADO para CADA aluno, na mesma ordem fornecida.

                    Para cada aluno, gerar:

                    1) Resumo do aluno  
                    2) Objetivo da aula  
                    3) Sequência de exercícios (nome, propósito, intensidade, repetições/tempo)  
                    4) Modificações opcionais  
                    5) Cuidados especiais  
                    6) Equipamentos sugeridos  

                    O resultado deve ser direto, organizado e fácil para um instrutor aplicar.
        `,
        },
        {
          role: "user",
          content: `Lista de alunos:\n${listaDeAlunos}`,
        },
      ],
      temperature: 0.7,
    };

    return await requestGroq("/chat/completions", body);
  } catch (erro: any) {
    console.error(erro.message);
    return `Erro ao gerar resposta. ${erro.message}`;
  }
};
