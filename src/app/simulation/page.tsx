"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import { getFireSpreadPrediction } from "@/app/actions";
import { BotMessageSquare, Loader2, Wind, Mountain, Trees, Droplets, Thermometer, MapPin, CheckCircle2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const initialState = {
  prediction: "",
  imageUrl: null,
  error: "",
  success: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <BotMessageSquare className="mr-2 h-4 w-4" />
      )}
      Generate Prediction
    </Button>
  );
}

export default function SimulationPage() {
  const [state, formAction] = useActionState(getFireSpreadPrediction, initialState);
  const { pending } = useFormStatus();

  return (
    <>
      <PageHeader
        title="Fire Spread Simulation"
        description="Generate fire spread predictions based on environmental conditions."
      />
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Simulation Parameters</CardTitle>
            <CardDescription>
              Input environmental data to generate a fire spread simulation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location"><MapPin className="inline-block mr-2 h-4 w-4" />Location</Label>
                <Input id="location" name="location" type="text" placeholder="e.g., Yosemite National Park, CA" required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="temperature"><Thermometer className="inline-block mr-2 h-4 w-4" />Temperature (°F)</Label>
                  <Input id="temperature" name="temperature" type="number" defaultValue="85" required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="humidity"><Droplets className="inline-block mr-2 h-4 w-4" />Humidity (%)</Label>
                  <Input id="humidity" name="humidity" type="number" defaultValue="20" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windSpeed"><Wind className="inline-block mr-2 h-4 w-4" />Wind Speed (mph)</Label>
                  <Input id="windSpeed" name="windSpeed" type="number" defaultValue="15" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="windDirection">Wind Direction</Label>
                  <Select name="windDirection" defaultValue="SW">
                    <SelectTrigger><SelectValue placeholder="Select direction" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="N">North</SelectItem>
                      <SelectItem value="NE">Northeast</SelectItem>
                      <SelectItem value="E">East</SelectItem>
                      <SelectItem value="SE">Southeast</SelectItem>
                      <SelectItem value="S">South</SelectItem>
                      <SelectItem value="SW">Southwest</SelectItem>
                      <SelectItem value="W">West</SelectItem>
                      <SelectItem value="NW">Northwest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
               <div className="space-y-2">
                  <Label htmlFor="vegetationDensity"><Trees className="inline-block mr-2 h-4 w-4" />Vegetation Density</Label>
                  <Select name="vegetationDensity" defaultValue="dense">
                    <SelectTrigger><SelectValue placeholder="Select density" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sparse">Sparse</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="dense">Dense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="terrainSlope"><Mountain className="inline-block mr-2 h-4 w-4" />Terrain Slope</Label>
                  <Select name="terrainSlope" defaultValue="steep">
                    <SelectTrigger><SelectValue placeholder="Select slope" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="gentle">Gentle</SelectItem>
                      <SelectItem value="steep">Steep</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              <SubmitButton />
            </form>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>AI Simulation Results</CardTitle>
            <CardDescription>
              The generated map and prompt from the AI simulation.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            {pending ? (
              <div className="space-y-4">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <Skeleton className="h-48 w-full" />
              </div>
            ) : state?.imageUrl ? (
              <div className="space-y-4">
                {state.success && (
                    <div className="flex items-start gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-700 dark:text-green-400">
                        <CheckCircle2 className="size-5 flex-shrink-0" />
                        <p className="flex-1">{state.success}</p>
                    </div>
                )}
                <div className="space-y-2">
                    <h3 className="font-semibold">Predicted Spread Map</h3>
                    <Image
                        src={state.imageUrl}
                        alt="Predicted fire spread map"
                        width={600}
                        height={400}
                        className="rounded-lg object-cover aspect-video"
                    />
                    <p className="text-xs text-muted-foreground">This is an AI-generated prediction. Not for operational use.</p>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold">Simulation Prompt</h3>
                    <Textarea
                        readOnly
                        value={state.prediction || ""}
                        placeholder="Prediction prompt will appear here..."
                        className="h-48 resize-none font-mono text-xs bg-muted/50"
                    />
                </div>
              </div>
            ) : (
                <div className="text-center py-12 px-4 space-y-4 text-muted-foreground">
                    {state?.error ? (
                        <Alert variant="destructive">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    ) : (
                        <>
                            <BotMessageSquare className="size-12 mx-auto" />
                            <h3 className="text-lg font-semibold text-foreground">Ready for Simulation</h3>
                            <p>Your AI simulation results will appear here.</p>
                        </>
                    )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
