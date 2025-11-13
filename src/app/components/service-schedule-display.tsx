
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Wrench, AlertCircle, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import type { FormValues } from "@/lib/schema";

type ServiceItem = {
  item: string;
  intervalKms: number;
  intervalMonths: number;
  reason: string;
};

type ServiceScheduleDisplayProps = {
  schedule: ServiceItem[];
  formValues: FormValues;
};

const ENGINE_ITEMS = [
  'Engine Oil & Filter',
  'Spark Plugs (Iridium/Platinum)',
  'Air Filter',
  'Coolant',
  'Timing Belt'
];

export function ServiceScheduleDisplay({ schedule, formValues }: ServiceScheduleDisplayProps) {
  
  const calculateDueStatus = (item: ServiceItem) => {
    const isEngineItem = ENGINE_ITEMS.includes(item.item);

    let currentKms = formValues.chassisKms;
    if (isEngineItem) {
        currentKms = formValues.hasSwappedEngine && formValues.engineSwapKms && formValues.engineKmsAtSwap
            ? (formValues.chassisKms - formValues.engineSwapKms) + formValues.engineKmsAtSwap
            : formValues.chassisKms;
    }

    let lastServicePoint = 0;
    
    // Rule 1: Was the specific item serviced recently?
    if (formValues.lastServiceKms && formValues.lastServiceItems?.toLowerCase().includes(item.item.toLowerCase())) {
        lastServicePoint = formValues.lastServiceKms;

        // If it's an engine item on a swapped engine, we need to calculate the *engine's* KMs at the time of that service
        if (isEngineItem && formValues.hasSwappedEngine && formValues.engineSwapKms && formValues.engineKmsAtSwap) {
           const chassisKmsSinceSwapAtServiceTime = formValues.lastServiceKms - formValues.engineSwapKms;
           if(chassisKmsSinceSwapAtServiceTime > 0) {
              lastServicePoint = formValues.engineKmsAtSwap + chassisKmsSinceSwapAtServiceTime;
           } else {
              // This case is tricky - service was before swap. Assume it doesn't apply to the new engine.
              // Fall through to Rule 2
              lastServicePoint = formValues.engineKmsAtSwap;
           }
        }
    } 
    // Rule 2: If not, is it an engine item with a swap history?
    else if (isEngineItem && formValues.hasSwappedEngine && formValues.engineKmsAtSwap) {
        lastServicePoint = formValues.engineKmsAtSwap;
    }
    // Rule 3: Default to 0 (never serviced)
    else {
        lastServicePoint = 0;
    }
    
    const kmsSinceLastService = currentKms - lastServicePoint;

    if (kmsSinceLastService >= item.intervalKms) {
      return { isDue: true, kmsSinceLastService };
    }

    return { isDue: false, kmsSinceLastService };
  };

  const processedSchedule = schedule.map(item => {
    const { isDue, kmsSinceLastService } = calculateDueStatus(item);
    return { ...item, isDue, kmsSinceLastService };
  }).sort((a, b) => {
    if (a.isDue && !b.isDue) return -1;
    if (!a.isDue && b.isDue) return 1;
    return a.item.localeCompare(b.item);
  });

  return (
    <Accordion type="multiple" className="w-full" defaultValue={processedSchedule.filter(item => item.isDue).map((_, index) => `item-${index}`)}>
      {processedSchedule.map((item, index) => (
        <AccordionItem value={`item-${index}`} key={index} className={item.isDue ? "border-primary/20" : ""}>
          <AccordionTrigger className="hover:no-underline text-left">
            <div className="flex items-center gap-4 w-full">
              <Checkbox id={`item-check-${index}`} aria-label={`Mark ${item.item} as complete`} />
              {item.isDue ? (
                <Bell className="h-5 w-5 text-primary shrink-0 animate-pulse" />
              ) : (
                <Wrench className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{item.item}</p>
                <p className="text-sm text-muted-foreground">
                  Every {item.intervalKms.toLocaleString()} km or {item.intervalMonths} months
                </p>
              </div>
               {item.isDue && (
                <Badge variant="destructive" className="animate-pulse">
                  Due Now
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pl-12 pb-4">
             <p className="text-muted-foreground">{item.reason}</p>
             <p className="text-xs text-muted-foreground/80 mt-2">
                Last serviced ~{item.kmsSinceLastService.toLocaleString()} km ago.
             </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
