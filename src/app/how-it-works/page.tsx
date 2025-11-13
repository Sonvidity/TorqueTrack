
import { MainNav } from "@/app/components/main-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, Wrench, Lightbulb, Database, Server, GitCommitHorizontal } from "lucide-react";

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
        description: "The process starts with a baseline. We have an internal database of standard, manufacturer-recommended service intervals for common items (e.g., 'Engine Oil & Filter' at 10,000 km, 'Spark Plugs' at 100,000 km). This provides the foundation for your schedule."
    },
    {
        icon: <GitCommitHorizontal className="h-8 w-8 text-primary" />,
        title: "2. Rule-Based Adjustments",
        description: "Instead of a fragile AI, we use a clear, rule-based engine to adjust your schedule. This engine applies multipliers to the baseline intervals based on the modifications and driving style you select. This process is deterministic and reliable."
    },
    {
        icon: <Rocket className="h-8 w-8 text-primary" />,
        title: "3. Impact of Modifications",
        description: "Performance parts increase stress. Our rules apply specific reductions: Stage 1 reduces intervals by 20%, Stage 2 by 40%, and Stage 3 by 60% for engine components. A turbo or supercharger applies a flat 50% reduction to engine-related intervals. The most significant reduction is always used."
    },
    {
        icon: <Wrench className="h-8 w-8 text-primary" />,
        title: "4. Impact of Driving Style",
        description: "'Spirited Weekend Drives' applies a 15% reduction to wear items like fluids and brakes. 'Regular Track/Race Use' is much more aggressive, applying a 50% reduction to those same items, ensuring your car is safe for high-performance driving."
    },
    {
        icon: <Lightbulb className="h-8 w-8 text-primary" />,
        title: "5. Calculating 'Due Now' (Service History)",
        description: "The final calculation of what's 'Due Now' happens in your browser. This logic takes the adjusted intervals from the rules engine and compares them against the service history you provided. The KMs you entered for your last service and the items serviced have the highest priority."
    },
    {
        icon: <Server className="h-8 w-8 text-primary" />,
        title: "6. Handling Engine Swaps",
        description: "Your inputs in the 'Service History' tab are crucial for engine swaps. When you provide 'Chassis KMs at Swap' and 'Engine KMs at Swap', you set a new 'birth date' for all engine components. Our code uses this as the baseline for calculating engine-related intervals, ensuring the schedule is based on the new engine's life, not the car's."
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
                    From your inputs to your personalized schedule, here’s a step-by-step breakdown of how our rule-based engine crafts its recommendations.
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
