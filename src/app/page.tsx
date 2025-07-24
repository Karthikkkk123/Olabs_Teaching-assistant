import ChatWidget from '@/components/chat-widget';

export default function Home() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Olabs Virtual Labs</h1>
        <p className="text-muted-foreground mt-2">An initiative to make quality education accessible.</p>
      </header>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold font-headline mb-4 border-b pb-2">Physics Simulations</h2>
          <p className="mb-4 text-lg leading-relaxed">
            Welcome to the physics section of Olabs. Here you can find a variety of interactive simulations
            to help you understand complex physics concepts. Our goal is to provide a hands-on learning
            experience that is both engaging and effective.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            One of the key topics covered is mechanics. We have detailed simulations on
            <strong className="text-primary font-semibold"> projectile motion</strong>, where you can experiment with different initial velocities, angles,
            and gravitational forces to see how they affect the trajectory of an object. This is a
            fundamental concept in classical mechanics and our simulation makes it easy to visualize.
          </p>
          <p className="text-lg leading-relaxed">
            Beyond projectile motion, we also offer simulations for electricity and magnetism, optics,
            and thermodynamics. Explore the labs to discover more!
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold font-headline mb-4 border-b pb-2">How to Use the AI Assistant</h2>
          <p className="text-lg leading-relaxed">
            Try asking our new AI assistant in the bottom-right corner some questions about the content on this page.
            For example, you could ask:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-lg">
            <li>"What is projectile motion?"</li>
            <li>"Summarize the physics topics available."</li>
            <li>"Explain the goal of Olabs."</li>
          </ul>
        </section>
      </div>

      <ChatWidget />
    </main>
  );
}
