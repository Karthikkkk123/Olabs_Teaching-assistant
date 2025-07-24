import ChatWidget from '@/components/chat-widget';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Olabs Virtual Labs</h1>
        <p className="text-muted-foreground mt-2">An initiative to make quality education accessible.</p>
      </header>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold font-headline mb-4 border-b pb-2">Welcome to Olabs</h2>
          <p className="mb-4 text-lg leading-relaxed">
            Welcome to Olabs. Here you can find a variety of interactive simulations
            to help you understand complex concepts. Our goal is to provide a hands-on learning
            experience that is both engaging and effective.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            We have detailed simulations on many topics. Check out our{' '}
            <Link href="/physics" className="text-primary font-semibold hover:underline">
              Physics Simulations
            </Link>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold font-headline mb-4 border-b pb-2">How to Use the AI Assistant</h2>
          <p className="text-lg leading-relaxed">
            Try asking our new AI assistant in the bottom-right corner some questions about the content on this page.
          </p>
        </section>
      </div>

      <ChatWidget />
    </main>
  );
}
