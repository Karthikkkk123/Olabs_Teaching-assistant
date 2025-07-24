import ChatWidget from '@/components/chat-widget';
import Link from 'next/link';

export default function PhysicsPage() {
  return (
    <main className="container mx-auto p-4 md:p-8">
      <header className="mb-8 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary">Physics Simulations</h1>
        <p className="text-muted-foreground mt-2">Explore the world of physics with our interactive labs.</p>
      </header>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <section className="mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold font-headline mb-4 border-b pb-2">Available Simulations</h2>
          <p className="mb-4 text-lg leading-relaxed">
            Welcome to the physics section of Olabs. Here you can find a variety of interactive simulations
            to help you understand complex physics concepts.
          </p>
          <p className="mb-4 text-lg leading-relaxed">
            One of the key topics covered is mechanics. We have detailed simulations on{' '}
            <Link href="/physics/projectile-motion" className="text-primary font-semibold hover:underline">
              projectile motion
            </Link>
            , where you can experiment with different initial velocities, angles,
            and gravitational forces.
          </p>
          <p className="text-lg leading-relaxed">
            We also offer simulations for electricity and magnetism, optics,
            and thermodynamics. Explore the labs to discover more!
          </p>
        </section>
      </div>

      <ChatWidget />
    </main>
  );
}
