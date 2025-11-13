
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import type { ActionResponse } from "@/app/actions";
import { ServiceScheduleDisplay } from "./service-schedule-display";
import type { FormValues } from "@/lib/schema";

interface ServiceScheduleProps {
    result: ActionResponse | null;
    formValues: FormValues;
}

export function ServiceSchedule({ result, formValues }: ServiceScheduleProps) {
  if (!result) return null;

  if (!result.success && result.error) {
    return (
      <Card className="mt-12 border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle />
            I'm still getting constant errors when inputting my cars details. Why? What is occurring?
          </CardTitle>
          <CardDescription className="text-destructive/90">
            I'm sorry you're seeing this error. It means the AI model failed to generate a schedule based on the specific combination of inputs you provided. Please try adjusting the modification details or service history and try again while I work on a more permanent solution.
          </CardDescription>
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

  return (
    <Card className="mt-12 animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-3xl">Recommended Service Schedule</CardTitle>
        <CardDescription>Based on your vehicle's specifications, modifications, and usage.</CardDescription>
      </CardHeader>
      <CardContent>
        <ServiceScheduleDisplay schedule={result.data.serviceSchedule} formValues={formValues} />
      </CardContent>
    </Card>
  );
}
