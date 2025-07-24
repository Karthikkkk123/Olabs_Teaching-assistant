# **App Name**: Olabs AI Assist

## Core Features:

- Contextual Greeting: Dynamic greeting: Use a tool powered by Gemini Flash to scrape the current webpage URL and generate a contextual greeting prompt to the user. The LLM uses reasoning to craft a relevant greeting based on the page content (e.g., 'How can I help you with projectile motion?' on the projectile motion page).
- RAG Q&A: RAG-based Question Answering: Scrape the current page content, convert it into a temporary, in-memory PDF-like structure, and use it to ground the Gemini Flash model's answers to user questions. This enhances answer relevance and accuracy with minimal latency. Because resources are kept in-memory and not persistently stored in a database, all RAG context is cleared upon page navigation or refresh.
- Widget UI: Collapsible Widget: Implement a small, fixed widget on the bottom right of the page for unobtrusive access to the chatbot.
- Easy Embed: Single Line Installation: Offer a simple HTML snippet for easy integration into any Olabs webpage.
- Ephemeral RAG Data: Temporary PDF-like Resource: The content used to construct the RAG knowledge base must be created only temporarily and must not be saved to persistent storage or to disk, in order to adhere to the project's requirement of zero reliance on any external database service.

## Style Guidelines:

- Primary color: Saturated blue (#4285F4) to align with Olabs' identity and signal trustworthiness.
- Background color: Light gray (#F5F5F5) to ensure readability and a clean interface.
- Accent color: Green (#34A853) to highlight important interactive elements.
- Font: 'Inter', a sans-serif font, for both headings and body text. This ensures readability and a modern look.
- Use simple, clear icons to represent actions and status in the chatbot interface.
- Design a clean and intuitive chat interface within the widget.
- Incorporate subtle animations for loading and message transitions to enhance user experience.