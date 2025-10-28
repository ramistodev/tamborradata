import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { log } from '../../helpers';

const openai = createOpenAI({
  headers: {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  },
});

export async function generateSummary(
  sysPrompt: string,
  userPrompt: string
): Promise<string | null> {
  try {
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: sysPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      maxOutputTokens: 500, // Límite de tokens del resumen (suficiente para 4–6 frases)
    });
    return text;
  } catch (error) {
    // Manejar errores generales
    log(`Error generando resumen para: ${error}`, 'error');
    throw new Error(`Error generando resumen para: ${error}`);
  }
}
