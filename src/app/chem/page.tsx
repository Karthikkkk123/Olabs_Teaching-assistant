import ChatWidget from '@/components/chat-widget';
import Link from 'next/link';

export default function PhysicsPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Chemistry Simulations</h1>
        <p className="text-muted-foreground mt-2">Explore the fascinating world of chemistry with our interactive labs.</p>
      </header>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold font-headline mb-4 border-b pb-2">Available Simulations</h2>
          <p className="mb-4 text-lg leading-relaxed">
          Welcome to the chemistry section of Olabs. Here you can find a variety of interactive simulations to help you understand key chemical principles and reactions.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
          One of the core areas covered is chemical reactions. We have detailed simulations on{' '}
            <Link href="/chem/a1" className="text-primary font-semibold hover:underline">
              chemistry
            </Link>
           We provide detailed simulations on topics like acid-base reactions, neutralization, and reaction rates where you can manipulate concentrations, temperature, and catalysts.
          </p>
          <p className="text-lg leading-relaxed">
            We also offer simulations for atomic structure, chemical bonding, periodic classification, and organic chemistry. Explore the labs to discover more!
          </p>
        </section>
      </div>

      <ChatWidget />
    </main>
  );
}
