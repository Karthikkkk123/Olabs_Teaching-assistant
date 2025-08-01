// Use server directive needed so that Genkit flows can be invoked from React.
'use server';

/**
 * @fileOverview A contextual greeting AI agent for Olabs website.
 *
 * - contextualGreeting - A function that generates a contextual greeting.
 * - ContextualGreetingInput - The input type for the contextualGreeting function.
 * - ContextualGreetingOutput - The return type for the contextualGreeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualGreetingInputSchema = z.object({
  webpageUrl: z
    .string()
    .describe('The URL of the current webpage.'),
  webpageContent: z
    .string()
    .describe('The content of the current webpage.'),
});
export type ContextualGreetingInput = z.infer<typeof ContextualGreetingInputSchema>;

const ContextualGreetingOutputSchema = z.object({
  greeting: z.string().describe('A contextual greeting message.'),
});
export type ContextualGreetingOutput = z.infer<typeof ContextualGreetingOutputSchema>;

export async function contextualGreeting(input: ContextualGreetingInput): Promise<ContextualGreetingOutput> {
  return contextualGreetingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualGreetingPrompt',
  input: {schema: ContextualGreetingInputSchema},
  output: {schema: ContextualGreetingOutputSchema},
  prompt: `You are a chatbot designed to provide a contextual greeting to users visiting the Olabs website.

  Based on the content of the current webpage, generate a short, unique, and interesting greeting message.

  If the user is on the homepage, ask \"How can I help you today?\".
  If the user is on a physics page but not a specific topic page, ask \"How can I help you with physics?\".
  If the user is on a specific topic page (e.g., projectile motion), ask \"How can I help you with [topic name]?\" (e.g., \"Hey how can I help you with projectile motion?\"

  Webpage URL: {{{webpageUrl}}}
  Webpage Content: {{{webpageContent}}}

  Greeting:`, // Removed triple curly braces from Greeting, per documentation
});

const contextualGreetingFlow = ai.defineFlow(
  {
    name: 'contextualGreetingFlow',
    inputSchema: ContextualGreetingInputSchema,
    outputSchema: ContextualGreetingOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      return output!;
    } catch (error) {
      console.error('Error generating contextual greeting:', error);
      // Return a fallback greeting if the AI service fails.
      return { greeting: "Hello! How can I help you today?" };
    }
  }
);
