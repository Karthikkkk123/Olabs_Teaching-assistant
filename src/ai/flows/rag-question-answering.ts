'use server';
/**
 * @fileOverview Implements a RAG-based question answering flow that scrapes the current webpage
 * content and uses it to ground the Gemini Flash model's answers. It constructs a temporary,
 * in-memory PDF-like structure to minimize latency and avoid persistent storage.
 *
 * - ragQuestionAnswering - A function that handles the question answering process.
 * - RagQuestionAnsweringInput - The input type for the ragQuestionAnswering function.
 * - RagQuestionAnsweringOutput - The return type for the ragQuestionAnswering function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RagQuestionAnsweringInputSchema = z.object({
  question: z.string().describe('The user question.'),
  pageContent: z.string().describe('The content of the current webpage.'),
});
export type RagQuestionAnsweringInput = z.infer<typeof RagQuestionAnsweringInputSchema>;

const RagQuestionAnsweringOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type RagQuestionAnsweringOutput = z.infer<typeof RagQuestionAnsweringOutputSchema>;

export async function ragQuestionAnswering(input: RagQuestionAnsweringInput): Promise<RagQuestionAnsweringOutput> {
  return ragQuestionAnsweringFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ragQuestionAnsweringPrompt',
  input: {schema: RagQuestionAnsweringInputSchema},
  output: {schema: RagQuestionAnsweringOutputSchema},
  prompt: `You are a chatbot answering questions about the current webpage. Use the content of the page to answer the question.

Page Content: {{{pageContent}}}

Question: {{{question}}}

Answer:`,
});

const ragQuestionAnsweringFlow = ai.defineFlow(
  {
    name: 'ragQuestionAnsweringFlow',
    inputSchema: RagQuestionAnsweringInputSchema,
    outputSchema: RagQuestionAnsweringOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
