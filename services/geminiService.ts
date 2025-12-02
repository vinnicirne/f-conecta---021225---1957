import { GoogleGenAI } from "@google/genai";

export const generateAIInsights = async (contextData: string): Promise<string> => {
  // Check for API key (assumed to be in process.env.API_KEY per guidelines)
  if (!process.env.API_KEY) {
    return "Simulação: A IA prevê um crescimento de 15% no engajamento baseado nos grupos de oração recém-criados. Recomenda-se destacar testemunhos na próxima semana. (Configure API_KEY no arquivo .env ou na Vercel para insights reais).";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Você é um analista sênior de dados para uma rede social cristã chamada "FéConecta". 
      O objetivo da rede é fomentar fé, comunidade e positividade.
      Analise os seguintes dados brutos do painel e forneça um resumo executivo de 3 pontos com:
      1. Uma tendência observada.
      2. Uma possível risco (ex: churn, toxicidade).
      3. Uma recomendação de ação para os administradores.

      Dados Atuais:
      ${contextData}`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Erro ao conectar com a inteligência artificial. Tente novamente mais tarde.";
  }
};