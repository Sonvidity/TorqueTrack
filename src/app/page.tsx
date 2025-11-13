import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TorqueTrackForm } from '@/app/components/torque-track-form';
import { Logo } from '@/app/components/icons/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MainNav } from '@/app/components/main-nav';
import { Lightbulb, Wrench, Rocket } from 'lucide-react';

function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <MainNav />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto flex flex-col items-center gap-4 px-4 text-center">
        <Logo className="h-16 w-16 text-primary" />
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
          TorqueTrack
        </h1>
        <p className="max-w-[700px] text-foreground/80 md:text-xl">
          Your dynamic service schedule, tuned for your car and your driving style.
        </p>
      </div>
    </div>
  );
}

function ExplanationSection() {
  const explanations = [
    {
      icon: <Rocket className="h-8 w-8 text-primary" />,
      title: "Modifications",
      description: "Performance parts like turbos or engine swaps increase stress on components. We shorten service intervals for critical items like oil, spark plugs, and transmission fluid to ensure longevity.",
    },
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      title: "Driving Style & Usage",
      description: "Whether you're a daily commuter or a track day enthusiast, your driving habits matter. Aggressive driving or heavy loads require more frequent checks on brakes, tires, and fluids.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: "Service History",
      description: "Our AI considers your last service date and the work performed. This allows it to accurately predict what's due now and what's coming up next, creating a truly personalized schedule.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="font-headline text-3xl font-bold">How It Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our AI mechanic analyzes your vehicle's unique profile to create a service schedule that goes beyond the factory recommendations.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {explanations.map((item, index) => (
          <Card key={index}>
            <CardHeader className="items-center">
              {item.icon}
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  const galleryImages = PlaceHolderImages.filter((img) => img.id.startsWith('gallery-'));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="container mx-auto px-4 pb-16">
          <div className="mb-12">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card>
                        <CardContent className="relative flex aspect-video items-center justify-center p-0 overflow-hidden rounded-lg">
                          <Image
                            src={image.imageUrl}
                            alt={image.description}
                            fill
                            className="object-cover"
                            data-ai-hint={image.imageHint}
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden sm:flex" />
              <CarouselNext className="hidden sm:flex" />
            </Carousel>
          </div>
          <TorqueTrackForm />
          <ExplanationSection />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TorqueTrack. All rights reserved.
      </footer>
    </div>
  );
}
