
import { MainNav } from "@/app/components/main-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        description: "The process starts with a reliable baseline. The system contains an internal database of standard, manufacturer-recommended service intervals for common wear items (e.g., 'Engine Oil & Filter' at 10,000 km, 'Spark Plugs' at 100,000 km). This provides a solid and predictable foundation for every schedule, with specific overrides for certain popular models."
    },
    {
        icon: <GitCommitHorizontal className="h-8 w-8 text-primary" />,
        title: "2. Clear Rule-Based Adjustments",
        description: "Instead of relying on an unpredictable AI, the application uses a clear, deterministic rule engine. This engine applies precise multipliers to the baseline intervals based on the modifications and driving style you select. This process is transparent, reliable, and guarantees a consistent result every time."
    },
    {
        icon: <Rocket className="h-8 w-8 text-primary" />,
        title: "3. Impact of Modifications",
        description: "Performance parts increase stress on your engine. Our rules apply specific, predictable reductions: Stage 1 reduces engine component intervals by 20%, Stage 2 by 40%, and Stage 3 by 60%. Adding a turbo or supercharger applies a flat 50% reduction. The most aggressive reduction is always chosen to ensure safety."
    },
    {
        icon: <Wrench className="h-8 w-8 text-primary" />,
        title: "4. Impact of Driving Style",
        description: "'Spirited Weekend Drives' applies a 15% interval reduction to key wear items like fluids and brakes. 'Regular Track/Race Use' is much more aggressive, applying a 50% reduction to those same items. This ensures your vehicle is prepared for high-stress conditions."
    },
    {
        icon: <Lightbulb className="h-8 w-8 text-primary" />,
        title: "5. Calculating What's 'Due Now'",
        description: "The final calculation of what's 'Due Now' happens right in your browser, based on your service history. The logic first checks if you listed a specific item in the 'Items Serviced' box for your last service—this is the highest priority. If not, it uses the KMs of your last service or the KMs of your engine swap as the starting point for its calculation."
    },
    {
        icon: <Server className="h-8 w-8 text-primary" />,
        title: "6. Handling Engine Swaps Intelligently",
        description: "The system intelligently separates engine components from chassis components. When you enter 'Chassis KMs at Swap' and 'Engine KMs at Swap', you create a new 'birth date' for your engine. The code uses this to accurately track the true KMs on engine-related parts, ensuring the schedule is based on the new engine's life, not the car's."
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
                    From your inputs to your personalized schedule, here’s a step-by-step breakdown of how our rule-based engine crafts its recommendations. No AI, just clear, predictable logic.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {steps.map((step, index) => (
                    <Card key={index} className="flex flex-col">
                        <CardHeader className="items-center text-center">
                            <div className="rounded-full bg-primary/10 p-3">
                                {step.icon}
                            </div>
                            <CardTitle className="mt-4">{step.title}</CardTitle>
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
