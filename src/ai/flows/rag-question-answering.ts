'use server';
/**
 * @fileOverview Implements a RAG-based question answering flow that scrapes the current webpage
 * content and uses it to ground the Gemini Flash model's answers. It can also use a custom web scraper.
 *
 * - ragQuestionAnswering - A function that handles the question answering process.
 * - RagQuestionAnsweringInput - The input type for the ragQuestionAnswering function.
 * - RagQuestionAnsweringOutput - The return type for the ragQuestionAnswering function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Your LinkFinder class, converted to TypeScript
class LinkFinder {
    private userAgents: string[];

    constructor() {
        this.userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
        ];
    }

    private getRandomHeaders() {
        const randomUserAgent = this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
        return {
            'User-Agent': randomUserAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        };
    }

    private delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async searchGoogle(topic: string, currentHost?: string): Promise<{ title: string; url: string; }[]> {
        try {
            const query = encodeURIComponent(topic);
            const searchUrl = `https://www.google.com/search?q=${query}&num=10`;
            console.log(`🔍 Searching Google for: ${topic}`);
            await this.delay(Math.random() * 2000 + 1000);
            const response = await axios.get(searchUrl, {
                headers: this.getRandomHeaders(),
                timeout: 10000
            });

            if (response.status === 429) {
                console.log('⚠️ Rate limited by Google');
                return [];
            }

            const $ = cheerio.load(response.data);
            const results: { title: string; url: string; }[] = [];

            $('div.g').each((index, element) => {
                try {
                    const titleElement = $(element).find('h3').first();
                    const linkElement = $(element).find('a').first();

                    if (titleElement.length && linkElement.length) {
                        let title = titleElement.text().trim();
                        let url = linkElement.attr('href');

                        if (url && url.includes('/url?q=')) {
                            url = decodeURIComponent(url.split('/url?q=')[1].split('&')[0]);
                        }

                        if (url && url.startsWith('http') && !url.includes('google.com') && (!currentHost || !url.includes(currentHost)) && title.length > 5) {
                            results.push({ title: title, url: url });
                            if (results.length >= 3) return false;
                        }
                    }
                } catch (err) { /* continue */ }
            });
            return results.slice(0, 3);
        } catch (error: any) {
            console.log(`❌ Google search failed: ${error.message}`);
            return [];
        }
    }

    private async searchDuckDuckGo(topic: string, currentHost?: string): Promise<{ title: string; url: string; }[]> {
        try {
            console.log(`🦆 Searching DuckDuckGo for: ${topic}`);
            const query = encodeURIComponent(topic);
            const searchUrl = `https://html.duckduckgo.com/html/?q=${query}`;
            const response = await axios.get(searchUrl, { headers: this.getRandomHeaders(), timeout: 10000 });
            const $ = cheerio.load(response.data);
            const results: { title: string; url: string; }[] = [];

            $('div.result').each((index, element) => {
                try {
                    const linkElement = $(element).find('a.result__a').first();
                    if (linkElement.length) {
                        const title = linkElement.text().trim();
                        const url = linkElement.attr('href');
                        if (url && url.startsWith('http') && (!currentHost || !url.includes(currentHost))) {
                            results.push({ title, url });
                            if (results.length >= 3) return false;
                        }
                    }
                } catch (err) { /* continue */ }
            });
            return results.slice(0, 3);
        } catch (error: any) {
            console.log(`❌ DuckDuckGo search failed: ${error.message}`);
            return [];
        }
    }

    private async searchBing(topic: string, currentHost?: string): Promise<{ title: string; url: string; }[]> {
        try {
            console.log(`🅱️ Searching Bing for: ${topic}`);
            const query = encodeURIComponent(topic);
            const searchUrl = `https://www.bing.com/search?q=${query}`;
            const response = await axios.get(searchUrl, { headers: this.getRandomHeaders(), timeout: 10000 });
            const $ = cheerio.load(response.data);
            const results: { title: string; url: string; }[] = [];

            $('li.b_algo').each((index, element) => {
                try {
                    const titleElement = $(element).find('h2').first();
                    const linkElement = $(element).find('a').first();
                    if (titleElement.length && linkElement.length) {
                        const title = titleElement.text().trim();
                        const url = linkElement.attr('href');
                        if (url && url.startsWith('http') && (!currentHost || !url.includes(currentHost))) {
                            results.push({ title, url });
                            if (results.length >= 3) return false;
                        }
                    }
                } catch (err) { /* continue */ }
            });
            return results.slice(0, 3);
        } catch (error: any) {
            console.log(`❌ Bing search failed: ${error.message}`);
            return [];
        }
    }

    async getTopLinks(topic: string, currentHost?: string): Promise<{ title: string; url: string; }[]> {
        console.log(`🔎 Finding top 3 links for: ${topic}`);
        let results = await this.searchGoogle(topic, currentHost);
        if (results.length === 0) {
            console.log('🔄 Google failed, trying DuckDuckGo...');
            results = await this.searchDuckDuckGo(topic, currentHost);
        }
        if (results.length === 0) {
            console.log('🔄 DuckDuckGo failed, trying Bing...');
            results = await this.searchBing(topic, currentHost);
        }
        return results;
    }
}


const RagQuestionAnsweringInputSchema = z.object({
  question: z.string().describe('The user question.'),
  pageContent: z.string().describe('The content of the current webpage.'),
  mode: z.enum(['page', 'google']).describe('The source for answering the question.'),
  currentHost: z.string().optional().describe('The hostname of the current website to exclude from search results.'),
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
  prompt: `You are a helpful AI assistant. Your task is to answer the user's question based on the provided "Page Content".

If the "Page Content" provides a sufficient answer to the "Question", use that information.
If the "Page Content" does not contain the answer, use your own general knowledge to respond.
Do not state that you are using general knowledge or that the information was not in the provided text.

Page Content: {{{pageContent}}}

Question: {{{question}}}

Answer:`,
});

const summaryPrompt = ai.definePrompt({
  name: 'googleSearchSummaryPrompt',
  input: {
    schema: z.object({
      question: z.string(),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string(),
    }),
  },
  prompt: `Briefly summarize the following topic in one or two sentences: {{{question}}}`,
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
      const finder = new LinkFinder();
      const links = await finder.getTopLinks(input.question, input.currentHost);
      
      if (links.length === 0) {
        return { answer: "I couldn't find any results for that topic. Please try another search." };
      }

      // Generate summary
      const { output: summaryOutput } = await summaryPrompt({ question: input.question });
      const summary = summaryOutput?.summary || '';
      
      const formattedLinks = links.map((link, index) => `${index + 1}. ${link.title}\n   ${link.url}`).join('\n\n');
      
      const answer = `${summary}\n\nHere are the top 3 links I found for "${input.question}":\n\n${formattedLinks}`;
      
      return { answer };
    }
  }
);
