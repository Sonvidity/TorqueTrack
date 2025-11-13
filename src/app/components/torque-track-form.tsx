
"use client";

import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { getServiceScheduleAction, saveVehicleAction, type ActionResponse } from "@/app/actions";
import { formSchema } from "@/lib/schema";
import { vehicles, commonEngineSwaps } from "@/lib/vehicles";
import { useUser } from "@/firebase/index";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServiceSchedule } from "./service-schedule";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <svg
        className="h-16 w-16 animate-spin text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <p className="font-headline text-lg text-primary animate-pulse">
        Tuning Your Schedule...
      </p>
    </div>
  );
}

type TorqueTrackFormProps = {
  onMakeChange: (make: string | null) => void;
};


export function TorqueTrackForm({ onMakeChange }: TorqueTrackFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<ActionResponse | null>(null);
  const { user } = useUser();
  const { toast } = useToast();
  const router = useRouter();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "Toyota",
      model: "86 / BRZ (ZN6)",
      year: 2012,
      chassisKms: 170325,
      hasSwappedEngine: true,
      engineKms: 124325,
      drivingHabits: "Spirited Weekend Drives",
      stage: "none",
      forcedInduction: "none",
      turboType: "",
      superchargerKit: "",
      engineSwap: "stock",
      lastServiceKms: 166000,
      lastServiceItems: "Oil Change, Oil Filter",
      engineSwapKms: 110000,
      engineKmsAtSwap: 60000,
    },
  });

  const make = form.watch("make");
  const model = form.watch("model");
  const forcedInduction = form.watch("forcedInduction");
  const hasSwappedEngine = form.watch("hasSwappedEngine");

  const engineSwap = form.watch("engineSwap");


  useEffect(() => {
    onMakeChange(make);
  }, [make, onMakeChange]);

  const availableModels = useMemo(() => {
    return vehicles.find((v) => v.make === make)?.models || [];
  }, [make]);

  const availableYears = useMemo(() => {
    return availableModels.find((m) => m.name === model)?.years || [];
  }, [model, availableModels]);

  const availableEngines = useMemo(() => {
    const stockEngine = availableModels.find((m) => m.name === model)?.engine || "Stock Engine";
    return [{name: stockEngine, value: "stock"}, ...commonEngineSwaps];
  }, [model, availableModels])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    // If engine is not swapped, set engineKms to chassisKms before submitting
    const submissionValues = { ...values };
    if (!submissionValues.hasSwappedEngine) {
      submissionValues.engineKms = submissionValues.chassisKms;
    }

    const actionResult = await getServiceScheduleAction(submissionValues);
    setResult(actionResult);
    setIsLoading(false);
  }

  async function handleSave() {
    if (!user) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to save a vehicle.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    const values = form.getValues();
     const submissionValues = { ...values };
    if (!submissionValues.hasSwappedEngine) {
      submissionValues.engineKms = submissionValues.chassisKms;
    }

    const result = await saveVehicleAction(user.uid, submissionValues);

    if (result.success) {
      toast({
        title: "Vehicle Saved!",
        description: `${values.year} ${values.make} ${values.model} has been added to your garage.`,
      });
      router.push(`/my-vehicles/${result.vehicleId}`);
    } else {
      toast({
        title: "Error",
        description: result.error || "Could not save the vehicle.",
        variant: "destructive",
      });
    }
    setIsSaving(false);
  }
  
  return (
    <div id="form">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Vehicle Configuration</CardTitle>
          <CardDescription>
            Enter your vehicle's details to generate a personalized service schedule.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <Tabs defaultValue="vehicle" className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                  <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="mods">Modifications</TabsTrigger>
                  <TabsTrigger value="history">Service History</TabsTrigger>
                </TabsList>

                <div className="pt-8">
                <TabsContent value="vehicle" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormField control={form.control} name="make" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make</FormLabel>
                        <Select onValueChange={(value) => { field.onChange(value); form.setValue('model', ''); form.setValue('year', 0); }} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a make" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {vehicles.map((v) => <SelectItem key={v.make} value={v.make}>{v.make}</SelectItem>)}
                          </SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="model" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model</FormLabel>
                        <Select onValueChange={(value) => { field.onChange(value); form.setValue('year', 0); }} value={field.value} disabled={!make}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a model" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableModels.map((m) => <SelectItem key={m.name} value={m.name}>{m.name}</SelectItem>)}
                          </SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="year" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year</FormLabel>
                        <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)} disabled={!model}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a year" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableYears.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
                          </SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                  </div>
                </TabsContent>

                <TabsContent value="usage" className="space-y-6">
                  <FormField control={form.control} name="chassisKms" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chassis KMs</FormLabel>
                      <FormControl><Input type="number" placeholder="e.g., 100000" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} /></FormControl>
                      <FormDescription>Total kilometers on the vehicle's body.</FormDescription><FormMessage />
                    </FormItem>
                  )} />
                  <FormField
                    control={form.control}
                    name="hasSwappedEngine"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            Engine has been swapped or replaced
                          </FormLabel>
                          <FormDescription>
                            Select this if the engine isn't the original one that came with the chassis.
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  {hasSwappedEngine && (
                     <div className="space-y-6 p-4 border rounded-md bg-muted/50 animate-in fade-in-50">
                        <FormField control={form.control} name="engineKms" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Engine KMs</FormLabel>
                            <FormControl><Input type="number" placeholder="e.g., 50000" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} /></FormControl>
                            <FormDescription>Total KMs on the replacement engine itself.</FormDescription><FormMessage />
                          </FormItem>
                        )} />
                     </div>
                  )}
                  <FormField control={form.control} name="drivingHabits" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Driving Style</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 pt-2">
                          {["Daily Commuting", "Spirited Weekend Drives", "Regular Track/Race Use"].map(habit => (
                            <FormItem key={habit} className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value={habit} /></FormControl>
                              <FormLabel className="font-normal">{habit}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </TabsContent>

                <TabsContent value="mods" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <FormField control={form.control} name="stage" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modification Stage</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select a stage" /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="none">Stock / None</SelectItem>
                            <SelectItem value="1">Stage 1 (Tune)</SelectItem>
                            <SelectItem value="2">Stage 2 (Bolt-ons & Tune)</SelectItem>
                            <SelectItem value="3">Stage 3 (Major build)</SelectItem>
                          </SelectContent>
                        </Select><FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="engineSwap" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Engine Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue placeholder="Select an engine" /></SelectTrigger></FormControl>
                          <SelectContent>
                            {availableEngines.map(engine => (
                              <SelectItem key={engine.value} value={engine.value}>{engine.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>Select the current engine in your car. Leave as stock if original.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  
                   <FormField control={form.control} name="forcedInduction" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forced Induction</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4 pt-2">
                          {["none", "turbo", "supercharger"].map(type => (
                            <FormItem key={type} className="flex items-center space-x-3 space-y-0">
                              <FormControl><RadioGroupItem value={type} /></FormControl>
                              <FormLabel className="font-normal capitalize">{type}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl><FormMessage />
                    </FormItem>
                  )} />
                  {forcedInduction === "turbo" && (
                     <FormField control={form.control} name="turboType" render={({ field }) => (
                      <FormItem className="animate-in fade-in-50">
                        <FormLabel>Turbo Type</FormLabel>
                        <FormControl><Input placeholder="e.g., Garrett G25-660" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                  {forcedInduction === "supercharger" && (
                    <FormField control={form.control} name="superchargerKit" render={({ field }) => (
                      <FormItem className="animate-in fade-in-50">
                        <FormLabel>Supercharger Kit</FormLabel>
                        <FormControl><Input placeholder="e.g., Jackson Racing C30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-6">
                  {hasSwappedEngine && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border rounded-md bg-muted/50">
                       <FormField control={form.control} name="engineSwapKms" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chassis KMs at Swap</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g., 120000" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} /></FormControl>
                          <FormDescription>KMs on the car when the new engine was installed.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                       <FormField control={form.control} name="engineKmsAtSwap" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Engine KMs at Swap</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g., 76000" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} /></FormControl>
                          <FormDescription>KMs on the replacement engine when it was installed.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField control={form.control} name="lastServiceKms" render={({ field }) => (
                        <FormItem>
                          <FormLabel>KMs at Last Service</FormLabel>
                          <FormControl><Input type="number" placeholder="e.g., 75000" {...field} onChange={e => field.onChange(e.target.value === '' ? undefined : e.target.valueAsNumber)} /></FormControl>
                          <FormDescription>Odometer reading at your last service.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                  </div>
                   <FormField control={form.control} name="lastServiceItems" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Items Serviced</FormLabel>
                          <FormControl><Textarea placeholder="e.g., Oil change, Spark plugs, Air filter. If engine was swapped, mention if a full service was done." {...field} /></FormControl>
                           <FormDescription>List the main items that were replaced or serviced.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )} />
                </TabsContent>
                </div>
              </Tabs>
              
              <Separator />

              <div className="flex justify-end gap-4">
                {user && (
                    <Button type="button" variant="outline" onClick={handleSave} disabled={isSaving || isLoading}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save to Garage"}
                    </Button>
                )}
                <Button type="submit" disabled={isLoading || isSaving} size="lg">
                  {isLoading ? "Generating..." : "Generate Schedule"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      {isLoading && <LoadingIndicator />}
      <ServiceSchedule result={result} />
    </div>
  );
}
