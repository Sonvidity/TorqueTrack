
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Wrench, Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import type { FormValues } from "@/lib/schema";

type ServiceItem = {
  item: string;
  intervalKms: number;
  intervalMonths: number;
  reason?: string;
};

type ServiceScheduleDisplayProps = {
  schedule: ServiceItem[];
  formValues: FormValues;
};

const ENGINE_ITEMS = [
  'Engine Oil & Filter',
  'Spark Plugs (Iridium/Platinum)',
  'Air Filter',
  'Timing Belt',
  'Transmission Fluid (Automatic)',
  'Transmission Fluid (Manual)',
];

export function ServiceScheduleDisplay({ schedule, formValues }: ServiceScheduleDisplayProps) {
  
  const calculateDueStatus = (item: ServiceItem) => {
    const isEngineItem = ENGINE_ITEMS.includes(item.item);
    const { 
        chassisKms, 
        hasSwappedEngine, 
        engineSwapKms, 
        engineKmsAtSwap,
        lastServiceKms,
        lastServiceItems
    } = formValues;

    const currentEngineKms = (hasSwappedEngine && engineSwapKms && engineKmsAtSwap)
        ? (chassisKms - engineSwapKms) + engineKmsAtSwap
        : chassisKms;
    
    const currentKms = isEngineItem ? currentEngineKms : chassisKms;

    let lastServicePoint = 0;

    // Rule 1: Was the specific item serviced recently?
    if (lastServiceKms && lastServiceItems?.toLowerCase().includes(item.item.toLowerCase())) {
        if (isEngineItem) {
            // Service was recorded at chassis KMs. We need to find the equivalent *engine* KMs at that time.
            if(hasSwappedEngine && engineSwapKms && engineKmsAtSwap && lastServiceKms > engineSwapKms) {
                lastServicePoint = (lastServiceKms - engineSwapKms) + engineKmsAtSwap;
            } else {
                lastServicePoint = lastServiceKms;
            }
        } else {
            lastServicePoint = lastServiceKms;
        }
    } 
    // Rule 2: If not, was there a general service performed? (Use last service kms as the baseline)
    else if (lastServiceKms) {
         if (isEngineItem) {
            if(hasSwappedEngine && engineSwapKms && engineKmsAtSwap && lastServiceKms > engineSwapKms) {
                // Engine was swapped before this service, so we need to calculate the engine's KMs at the time of the service
                lastServicePoint = (lastServiceKms - engineSwapKms) + engineKmsAtSwap;
            } else {
                // Engine wasn't swapped, or was swapped *after* this service.
                // Or there is no swap history. So the KMs are linear.
                lastServicePoint = lastServiceKms;
            }
        } else {
            // For chassis items, it's always the direct service KMs
            lastServicePoint = lastServiceKms;
        }
    }
    // Rule 3: If no service history, but engine was swapped, the swap is the service point for engine items.
    else if (isEngineItem && hasSwappedEngine && engineKmsAtSwap) {
        lastServicePoint = engineKmsAtSwap;
    }
    // Rule 4: Default to 0 (never serviced)
    else {
        lastServicePoint = 0;
    }
    
    const kmsSinceLastService = currentKms - lastServicePoint;

    if (kmsSinceLastService >= item.intervalKms) {
      return { isDue: true, kmsSinceLastService, lastServicePoint, currentKms };
    }

    return { isDue: false, kmsSinceLastService, lastServicePoint, currentKms };
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
    <Accordion type="multiple" className="w-full" defaultValue={processedSchedule.filter(item => item.isDue).map((item) => item.item)}>
      {processedSchedule.map((item) => (
        <AccordionItem value={item.item} key={item.item} className={item.isDue ? "border-primary/20" : ""}>
          <AccordionTrigger className="hover:no-underline text-left">
            <div className="flex items-center gap-4 w-full">
              <Checkbox id={`item-check-${item.item}`} aria-label={`Mark ${item.item} as complete`} />
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
             <p className="text-muted-foreground">{item.reason || 'Standard interval.'}</p>
             <p className="text-xs text-muted-foreground/80 mt-2">
                ~{Math.max(0, item.kmsSinceLastService).toLocaleString()} km since last service.
             </p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
