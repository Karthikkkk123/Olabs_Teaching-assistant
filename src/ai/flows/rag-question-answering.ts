'use server';
/**
 * @fileOverview Implements a RAG-based question answering flow that scrapes the current webpage
 * content and uses it to ground the Gemini Flash model's answers. It can also use Google Search.
 *
 * - ragQuestionAnswering - A function that handles the question answering process.
 * - RagQuestionAnsweringInput - The input type for the ragQuestionAnswering function.
 * - RagQuestionAnsweringOutput - The return type for the ragQuestionAnswering function.
 */

import {ai} from '@/ai/genkit';
import {googleAI} from '@genkit-ai/googleai';
import {z} from 'zod';

const RagQuestionAnsweringInputSchema = z.object({
  question: z.string().describe('The user question.'),
  pageContent: z.string().describe('The content of the current webpage.'),
  mode: z.enum(['page', 'google']).describe('The source for answering the question.'),
});
export type RagQuestionAnsweringInput = z.infer<typeof RagQuestionAnsweringInputSchema>;

const RagQuestionAnsweringOutputSchema = z.object({
  answer: z.string().describe('The answer to the user question.'),
});
export type RagQuestionAnsweringOutput = z.infer<typeof RagQuestionAnsweringOutputSchema>;

export async function ragQuestionAnswering(input: RagQuestionAnsweringInput): Promise<RagQuestionAnsweringOutput> {
  return ragQuestionAnsweringFlow(input);
}

const pagePrompt = ai.definePrompt({
  name: 'ragQuestionAnsweringPrompt',
  input: {
    schema: z.object({
      question: z.string(),
      pageContent: z.string(),
    }),
  },
  output: {schema: RagQuestionAnsweringOutputSchema},
  prompt: `You are a chatbot answering questions about the current webpage. Use the content of the page to answer the question.

Page Content: {{{pageContent}}}

Question: {{{question}}}

Answer:`,
});

const googleSearchPrompt = ai.definePrompt({
  name: 'googleSearchRagPrompt',
  input: {
    schema: z.object({
      question: z.string(),
    }),
  },
  output: {
    schema: RagQuestionAnsweringOutputSchema,
  },
  tools: [googleAI.googleSearchTool],
  prompt: `You are a helpful AI assistant. Use the Google Search tool to find an answer to the user's question and provide a detailed response.

After the answer, you MUST provide the top 3 most relevant resource links from the search results. Format them as a list.

Question: {{{question}}}`,
});

const ragQuestionAnsweringFlow = ai.defineFlow(
  {
    name: 'ragQuestionAnsweringFlow',
    inputSchema: RagQuestionAnsweringInputSchema,
    outputSchema: RagQuestionAnsweringOutputSchema,
  },
  async input => {
    if (input.mode === 'page') {
      const {output} = await pagePrompt({
        question: input.question,
        pageContent: input.pageContent,
      });
      return output!;
    } else {
      const {output} = await googleSearchPrompt({question: input.question});
      if (!output) {
        return {answer: 'I could not find an answer using Google Search. Please try again.'};
      }
      return output;
    }
  }
);
