"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { type Incident } from "@/lib/types";
import { getSpreadMap } from "./actions";
import { Button } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Map, RefreshCw } from "lucide-react";
import { type GenerateSpreadMapInput } from "@/ai/flows/generate-spread-map-flow";

function parseWeather(weatherString: string) {
  const tempMatch = weatherString.match(/Temp: (\d+)°F/);
  const windMatch = weatherString.match(/Wind: (\d+) mph (\w+)/);
  const humidityMatch = weatherString.match(/Humidity: (\d+)%/);

  return {
    temperature: tempMatch ? parseInt(tempMatch[1], 10) : 70,
    windSpeed: windMatch ? parseInt(windMatch[1], 10) : 10,
    windDirection: windMatch ? windMatch[2] : 'SW',
    humidity: humidityMatch ? parseInt(humidityMatch[1], 10) : 30,
  };
}

function getVegetationDensity(vegetationType: string): 'sparse' | 'moderate' | 'dense' {
    const lowerVeg = vegetationType.toLowerCase();
    if (lowerVeg.includes('forest') || lowerVeg.includes('woodland') || lowerVeg.includes('chaparral')) {
        return 'dense';
    }
    if (lowerVeg.includes('shrubland')) {
        return 'moderate';
    }
    return 'sparse';
}

export function SpreadMap({ incident }: { incident: Incident | undefined }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerateMap = () => {
    if (!incident) return;
    
    startTransition(async () => {
      setError(null);
      
      const weather = parseWeather(incident.weatherConditions);

      const input: GenerateSpreadMapInput = {
          temperature: weather.temperature,
          humidity: weather.humidity,
          windSpeed: weather.windSpeed,
          windDirection: weather.windDirection,
          vegetationDensity: getVegetationDensity(incident.vegetationType),
          terrainSlope: 'steep',
          location: incident.location,
      }
      
      const result = await getSpreadMap(input);
      if (result.error) {
        setError(result.error);
      } else if (result.imageUrl) {
        setImageUrl(result.imageUrl);
      }
    });
  };

  if (!incident) {
    return (
        <>
            <CardHeader>
                <CardTitle>Spread Prediction</CardTitle>
                <CardDescription>No active incidents to predict.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    There are no active fires to generate a spread prediction for.
                </p>
            </CardContent>
        </>
    );
  }
  
  return (
    <>
        <CardHeader>
            <CardTitle>{imageUrl ? 'Predicted Spread Map' : 'Spread Prediction'}</CardTitle>
            <CardDescription>
                {imageUrl 
                    ? `For incident ${incident.id} in ${incident.location}` 
                    : 'Generate an AI-powered prediction of fire spread.'
                }
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 justify-between">
           <div className="flex-grow">
                {isPending && (
                    <div className="flex flex-col items-center justify-center gap-4 aspect-video">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">Generating prediction map...</p>
                    </div>
                )}
                {!isPending && imageUrl && (
                    <div className="space-y-4">
                        <div className="relative group">
                        <Image
                            src={imageUrl}
                            alt="Predicted fire spread map"
                            width={600}
                            height={400}
                            className="rounded-lg object-cover aspect-video"
                        />
                        </div>
                        <p className="text-xs text-muted-foreground">This is an AI-generated prediction. Not for operational use.</p>
                    </div>
                )}
                {!isPending && !imageUrl && (
                    <div className="flex flex-col items-start gap-4">
                        <p className="text-sm text-muted-foreground">
                            Predict spread for incident {incident.id} at {incident.location}.
                        </p>
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                )}
           </div>
            <Button onClick={handleGenerateMap} disabled={isPending} className="mt-4 w-full">
                {imageUrl ? <RefreshCw /> : <Map />}
                {imageUrl ? 'Generate New Map' : 'Generate Prediction Map'}
            </Button>
        </CardContent>
    </>
  );
}
