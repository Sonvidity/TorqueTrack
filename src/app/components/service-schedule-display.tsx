
'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button";
import { Wrench, Bell, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import type { FormValues, Vehicle } from "@/lib/schema";
import { updateVehicle } from '@/firebase/firestore/mutations';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';

type ServiceItem = {
  item: string;
  intervalKms: number;
  intervalMonths: number;
  reason?: string;
};

type ServiceScheduleDisplayProps = {
  schedule: ServiceItem[];
  formValues: FormValues;
  vehicle?: Vehicle; // Make vehicle optional for the main form
};

const ENGINE_ITEMS = [
  'Engine Oil & Filter',
  'Spark Plugs (Iridium/Platinum)',
  'Air Filter',
  'Timing Belt',
  'Transmission Fluid (Automatic)',
  'Transmission Fluid (Manual)',
];

export function ServiceScheduleDisplay({ schedule, formValues, vehicle }: ServiceScheduleDisplayProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const { user } = useUser();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCheckChange = (item: string, checked: boolean | 'indeterminate') => {
    if (checked) {
      setCheckedItems((prev) => [...prev, item]);
    } else {
      setCheckedItems((prev) => prev.filter((i) => i !== item));
    }
  };

  const handleCompleteService = async () => {
    if (!user || !vehicle || checkedItems.length === 0) return;

    setIsSubmitting(true);
    try {
      const updates: Partial<Vehicle> = {
        lastServiceKms: formValues.chassisKms,
        lastServiceItems: vehicle.lastServiceItems 
          ? Array.from(new Set([...vehicle.lastServiceItems, ...checkedItems])) 
          : checkedItems,
      };

      await updateVehicle(user.uid, vehicle.id, updates);

      toast({
        title: "Service Completed!",
        description: "Vehicle history has been updated.",
      });

      // Clear checks and refresh state implicitly by parent re-render
      setCheckedItems([]);

    } catch (error) {
      console.error("Failed to update vehicle service history:", error);
      toast({
        title: "Error",
        description: "Could not update service history.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  const calculateDueStatus = (item: ServiceItem) => {
    const isEngineItem = ENGINE_ITEMS.includes(item.item);
    const {
      chassisKms,
      hasSwappedEngine,
      engineSwapKms,
      engineKmsAtSwap,
      lastServiceKms,
    } = formValues;
  
    // Type guards for calculations
    const lastServiceNum = typeof lastServiceKms === 'number' ? lastServiceKms : 0;
    const chassisKmsNum = typeof chassisKms === 'number' ? chassisKms : 0;
    const engineSwapKmsNum = typeof engineSwapKms === 'number' ? engineSwapKms : 0;
    const engineKmsAtSwapNum = typeof engineKmsAtSwap === 'number' ? engineKmsAtSwap : 0;
  
    let currentKms = 0;
    let lastServicePoint = 0;
  
    if (isEngineItem) {
      // Calculate current engine KMs
      if (hasSwappedEngine && chassisKmsNum > engineSwapKmsNum) {
        currentKms = (chassisKmsNum - engineSwapKmsNum) + engineKmsAtSwapNum;
      } else {
        currentKms = chassisKmsNum; // Engine is original or swap happened after current kms (unlikely)
      }
  
      // Calculate engine KMs at the time of the last service
      if (lastServiceNum > 0) {
        if (hasSwappedEngine && lastServiceNum >= engineSwapKmsNum) {
          // Last service was performed ON THE NEW engine
          lastServicePoint = (lastServiceNum - engineSwapKmsNum) + engineKmsAtSwapNum;
        } else {
          // Last service was on the OLD engine, or there was no swap
          lastServicePoint = lastServiceNum;
        }
      } else {
          // No service history, so the starting point is the engine's 'birth'
          if (hasSwappedEngine) {
            lastServicePoint = engineKmsAtSwapNum;
          } else {
            lastServicePoint = 0;
          }
      }
    } else {
      // For chassis items, the logic is simple
      currentKms = chassisKmsNum;
      lastServicePoint = lastServiceNum;
    }
  
    const kmsSinceLastService = Math.max(0, currentKms - lastServicePoint);
  
    const isDue = kmsSinceLastService >= item.intervalKms;
  
    return { isDue, kmsSinceLastService, lastServicePoint, currentKms };
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
    <>
      {vehicle && (
        <div className="mb-6 flex justify-end">
          <Button 
            onClick={handleCompleteService} 
            disabled={checkedItems.length === 0 || isSubmitting}
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            {isSubmitting ? 'Updating...' : `Complete ${checkedItems.length} Selected Item(s)`}
          </Button>
        </div>
      )}
      <Accordion type="multiple" className="w-full" defaultValue={processedSchedule.filter(item => item.isDue).map((item) => item.item)}>
        {processedSchedule.map((item) => (
          <AccordionItem value={item.item} key={item.item} className={item.isDue ? "border-primary/20" : ""}>
            <AccordionTrigger className="hover:no-underline text-left">
              <div className="flex items-center gap-4 w-full">
                {vehicle ? (
                  <Checkbox 
                    id={`item-check-${item.item}`} 
                    aria-label={`Mark ${item.item} as complete`} 
                    onCheckedChange={(c) => handleCheckChange(item.item, c)}
                    checked={checkedItems.includes(item.item)}
                  />
                ) : <div className="w-4 h-4" /> }
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
    </>
  );
}
