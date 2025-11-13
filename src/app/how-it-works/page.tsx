
import { MainNav } from "@/app/components/main-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Wrench, Lightbulb, Bot, Database, Server } from "lucide-react";

function Header() {
    return (
      <header className="border-b">
        <div className="container mx-auto px-4">
          <MainNav />
        </div>
      </header>
    );
}

const steps = [
    {
        icon: <Database className="h-8 w-8 text-primary" />,
        title: "1. Baseline Manufacturer Data",
        description: "The process starts with a baseline. We have a simplified internal database containing the standard, manufacturer-recommended service intervals for common items like 'Engine Oil & Filter' (10,000 km), 'Brake Fluid' (40,000 km), and 'Spark Plugs' (100,000 km). We also have specific overrides for certain models known to have different requirements (e.g., a Toyota 86 has a 90,000 km interval for spark plugs)."
    },
    {
        icon: <Bot className="h-8 w-8 text-primary" />,
        title: "2. AI Analysis & Interval Adjustment",
        description: "This is where the magic happens. Your vehicle's details, selected modifications, and driving style are sent to a powerful AI model. The AI acts as an expert mechanic, using the baseline data as a starting point and then making intelligent adjustments."
    },
    {
        icon: <Rocket className="h-8 w-8 text-primary" />,
        title: "3. Impact of Modifications",
        description: "The AI understands that performance parts increase stress on the vehicle. If you've selected 'Stage 2', 'Turbo', or 'Supercharger', the AI will significantly shorten the service intervals for related components. For example, it might cut the 'Engine Oil & Filter' interval in half (from 10,000 km to 5,000 km) and reduce the 'Spark Plugs' interval from 100,000 km to 60,000 km, providing a reason like 'Increased engine stress from turbo requires more frequent oil changes to ensure proper lubrication and cooling.'"
    },
    {
        icon: <Wrench className="h-8 w-8 text-primary" />,
        title: "4. Impact of Driving Style",
        description: "Your driving habits are just as important. If you select 'Regular Track/Race Use', the AI knows to be more aggressive with its recommendations. It will shorten intervals for wear-and-tear items like 'Brake Fluid', 'Tire Rotation', and fluids, explaining that 'Aggressive driving and track use increases fluid temperatures and brake wear, requiring more frequent checks and replacements.'"
    },
    {
        icon: <Lightbulb className="h-8 w-8 text-primary" />,
        title: "5. Impact of Service History",
        description: "The AI's output is an *adjusted service interval*, not a final verdict. The final calculation of what's 'Due Now' happens in your browser. Our application code takes the AI's recommended intervals and compares them against the service history you provided. For example, if the AI recommends a 60,000 km spark plug interval, but you indicated in the 'Items Serviced' box that you replaced them at 166,000 km, our code calculates that only ~4,000 km have passed, and therefore, they are not due."
    },
    {
        icon: <Server className="h-8 w-8 text-primary" />,
        title: "6. Handling Engine Swaps",
        description: "Your input in the 'Service History' tab is crucial for engine swaps. When you provide the 'Chassis KMs at Swap' and the 'Engine KMs at Swap', you are setting a new 'birth date' for all engine components. Our code uses this as the baseline for calculating engine-related service intervals. This logic overrides any older service history for engine parts, ensuring the schedule is based on the new engine's life, not the car's."
    }
]


export default function HowItWorksPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
            <div className="text-center mb-12">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-primary">
                    How TorqueTrack Works
                </h1>
                <p className="max-w-[700px] mx-auto text-foreground/80 md:text-xl mt-4">
                    From your inputs to your personalized schedule, here’s a step-by-step breakdown of how our AI mechanic crafts its recommendations.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader className="items-center text-center">
                            {step.icon}
                            <CardTitle>{step.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-center text-muted-foreground">{step.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} TorqueTrack. All rights reserved.
      </footer>
    </div>
  );
}
