import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from the environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSentiment = async (text: string): Promise<{ sentiment: string; score: number; suggestion: string }> => {
  if (!process.env.API_KEY) return { sentiment: 'N/A', score: 0, suggestion: 'API Key Missing' };

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Analise o seguinte texto de uma rede social cristã. Classifique o sentimento (Positivo, Negativo, Neutro), dê uma nota de 0 a 10 (0 muito negativo, 10 muito positivo) e sugira uma ação de moderação se necessário.
    
    Texto: "${text}"`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: { type: Type.STRING },
            score: { type: Type.NUMBER },
            suggestion: { type: Type.STRING }
          }
        }
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini Error:", error);
    return { sentiment: 'Error', score: 0, suggestion: 'Manual review required' };
  }
};

export const generateCommunityInsights = async (metrics: any): Promise<string> => {
  if (!process.env.API_KEY) return "API Key ausente. Configure a chave para receber insights de IA.";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Você é um consultor especialista em comunidades online e fé.
    Com base nas seguintes métricas da rede social "FéConecta", forneça um resumo executivo de 3 parágrafos.
    1. Análise de crescimento.
    2. Saúde do engajamento.
    3. Recomendações para a liderança.

    Dados: ${JSON.stringify(metrics)}`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao conectar com a IA.";
  }
};