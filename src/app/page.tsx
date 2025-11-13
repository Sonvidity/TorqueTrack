import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { TorqueTrackForm } from '@/app/components/torque-track-form';
import { Logo } from '@/app/components/icons/logo';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
  const galleryImages = PlaceHolderImages.filter((img) => img.id.startsWith('gallery-'));

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
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
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TorqueTrack. All rights reserved.
      </footer>
    </div>
  );
}
