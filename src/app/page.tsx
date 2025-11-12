import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TorqueTrackForm } from '@/app/components/torque-track-form';
import { Logo } from '@/app/components/icons/logo';

function Header() {
  return (
    <header className="py-8 md:py-12">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
        <Logo className="h-16 w-16 text-primary" />
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
          TorqueTrack
        </h1>
        <p className="max-w-[700px] text-foreground/80 md:text-xl">
          Your dynamic service schedule, tuned for your car and your driving style.
        </p>
      </div>
    </header>
  );
}

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero-image');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 pb-16">
          {heroImage && (
            <div className="mb-12 overflow-hidden rounded-lg shadow-lg">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1200}
                height={400}
                className="w-full object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            </div>
          )}
          <TorqueTrackForm />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TorqueTrack. All rights reserved.
      </footer>
    </div>
  );
}
