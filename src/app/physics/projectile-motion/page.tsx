import ChatWidget from '@/components/chat-widget';

export default function ProjectileMotionPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Projectile Motion</h1>
        <p className="text-muted-foreground mt-2">An interactive lab on projectile motion.</p>
      </header>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold font-headline mb-4 border-b pb-2">Projectile Motion Simulation</h2>
          <p className="mb-4 text-lg leading-relaxed">
            This simulation allows you to experiment with projectile motion. You can adjust the initial velocity, angle, and gravitational force to see how they affect the trajectory of an object.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            This is a fundamental concept in classical mechanics and our simulation makes it easy to visualize and understand the path of a projectile.
          </p>
        </section>

        <section>
          <h2 className="text-2xl md:text-3xl font-semibold font-headline mb-4 border-b pb-2">How to Use the AI Assistant</h2>
          <p className="text-lg leading-relaxed">
            Try asking the AI assistant in the bottom-right corner some questions about projectile motion.
            For example, you could ask:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-lg">
            <li>"What factors affect the range of a projectile?"</li>
            <li>"What is the optimal angle for maximum range?"</li>
            <li>"Explain the trajectory of a projectile."</li>
          </ul>
        </section>
      </div>

      <ChatWidget />
    </main>
  );
}
