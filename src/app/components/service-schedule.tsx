import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Wrench, AlertCircle, Bell } from "lucide-react"
import type { ActionResponse } from "@/app/actions";
import { Badge } from "@/components/ui/badge";

export function ServiceSchedule({ result }: { result: ActionResponse | null }) {
  if (!result) return null;

  if (!result.success && result.error) {
    return (
      <Card className="mt-12 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle />
            An Error Occurred
          </CardTitle>
          <CardDescription className="text-destructive/90">
            {result.error}
          </Card-description>
        </CardHeader>
      </Card>
    );
  }
  
  if (!result.data?.serviceSchedule?.length) {
    return (
       <Card className="mt-12">
        <CardHeader>
            <CardTitle className="font-headline text-3xl">Recommended Service Schedule</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground py-8">
                <p>No service schedule generated for the provided details.</p>
                <p className="text-sm">Please try adjusting your inputs.</p>
            </div>
        </CardContent>
       </Card>
    );
  }

  const sortedSchedule = [...result.data.serviceSchedule].sort((a, b) => {
    if (a.isDue && !b.isDue) return -1;
    if (!a.isDue && b.isDue) return 1;
    return a.item.localeCompare(b.item);
  });

  return (
    <Card className="mt-12 animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Recommended Service Schedule</CardTitle>
        <CardDescription>Based on your vehicle's specifications, modifications, and usage.</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full" defaultValue={sortedSchedule.filter(item => item.isDue).map((_, index) => `item-${index}`)}>
          {sortedSchedule.map((item, index) => (
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
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
