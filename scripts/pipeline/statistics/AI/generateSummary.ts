import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { log } from '../../../logic/helpers';

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
      maxOutputTokens: 1000, // Límite de tokens del resumen
    });
    return text;
  } catch (error) {
    // Manejar errores generales
    log(`Error generando resumen para: ${JSON.stringify(error, null, 2)}`, 'error');
    throw new Error(`Error generando resumen para: ${JSON.stringify(error, null, 2)}`);
  }
}
