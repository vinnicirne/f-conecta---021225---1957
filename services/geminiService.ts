import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAIInsights = async (contextData: string): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Simulação: A IA prevê um crescimento de 15% no engajamento baseado nos grupos de oração recém-criados. Recomenda-se destacar testemunhos na próxima semana. (Configure a API Key para insights reais).";
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Você é um analista sênior de dados para uma rede social cristã chamada "FéConecta". 
      O objetivo da rede é fomentar fé, comunidade e positividade.
      Analise os seguintes dados brutos do painel e forneça um resumo executivo de 3 pontos com:
      1. Uma tendência observada.
      2. Um possível risco (ex: churn, toxicidade).
      3. Uma recomendação de ação para os administradores.

      Dados Atuais:
      ${contextData}`,
      config: {
        maxOutputTokens: 300,
        temperature: 0.7,
      }
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Erro ao conectar com a inteligência artificial. Tente novamente mais tarde.";
  }
};
