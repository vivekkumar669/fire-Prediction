"use server";

import { fireSpreadPrediction } from "@/ai/flows/fire-spread-prediction-flow";
import { generateSpreadMap, type GenerateSpreadMapInput } from "@/ai/flows/generate-spread-map-flow";
import { summarizeIncidentReport, type IncidentReport } from "@/ai/flows/summarize-incident-report";
import { z } from "zod";
import { GenerateSpreadMapInputSchema } from "@/ai/schemas";
import { addIncident, addAlert, mockIncidents } from "@/lib/data";
import { type Incident, type Alert } from "@/lib/types";
import { revalidatePath } from "next/cache";


const simulationSchema = z.object({
  location: z.string().min(1, { message: "Location is required." }),
  windSpeed: z.coerce.number().min(0).max(100),
  windDirection: z.string().min(1),
  vegetationDensity: z.string().min(1),
  terrainSlope: z.string().min(1),
  humidity: z.coerce.number().min(0).max(100),
  temperature: z.coerce.number().min(-50).max(150),
});

export async function getFireSpreadPrediction(prevState: any, formData: FormData) {
  const validatedFields = simulationSchema.safeParse({
    location: formData.get("location"),
    windSpeed: formData.get("windSpeed"),
    windDirection: formData.get("windDirection"),
    vegetationDensity: formData.get("vegetationDensity"),
    terrainSlope: formData.get("terrainSlope"),
    humidity: formData.get("humidity"),
    temperature: formData.get("temperature"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid input data.",
      prediction: "",
      imageUrl: null,
      success: "",
    };
  }
  
  try {
    const result = await generateSpreadMap(validatedFields.data);

    const newIdNumber = mockIncidents.length + 1;
    const newIncidentId = `INC-${String(newIdNumber).padStart(3, '0')}`;

    const newIncident: Incident = {
      id: newIncidentId,
      location: validatedFields.data.location,
      date: new Date().toISOString(),
      status: 'Active',
      confidence: 85 + Math.random() * 15,
      size: '1 acre (simulated)',
      cause: 'Simulated Event',
      weatherConditions: `Temp: ${validatedFields.data.temperature}°F, Wind: ${validatedFields.data.windSpeed} mph ${validatedFields.data.windDirection}, Humidity: ${validatedFields.data.humidity}%`,
      vegetationType: `${validatedFields.data.vegetationDensity} density`,
      responseEfforts: 'Simulation initiated. No personnel dispatched.',
      damages: 'N/A (simulation)',
      duration: 'Ongoing',
      latitude: 34.0522, // Placeholder lat/lon for demo
      longitude: -118.2437,
    };
    addIncident(newIncident);

    const newAlert: Alert = {
        id: `ALT-${newIncidentId}`,
        incidentId: newIncidentId,
        message: `New simulated fire detected: ${newIncident.location}.`,
        timestamp: new Date().toISOString(),
        severity: 'Medium',
        read: false,
    };
    addAlert(newAlert);
    
    revalidatePath('/');
    revalidatePath('/incidents');
    revalidatePath('/alerts');
    
    return { 
      prediction: result.predictionPrompt, 
      imageUrl: result.imageUrl, 
      error: "",
      success: `Successfully created Incident ${newIncidentId}. Check the Dashboard and Alerts pages.`
    };

  } catch (e) {
    console.error(e);
    return { 
      error: "Failed to generate prediction.", 
      prediction: "", 
      imageUrl: null,
      success: "",
    };
  }
}


export async function getIncidentSummary(incident: IncidentReport) {
    try {
        const result = await summarizeIncidentReport(incident);
        return { summary: result.summary };
    } catch (e) {
        console.error(e);
        return { error: "Failed to generate summary." };
    }
}

export async function getSpreadMap(input: GenerateSpreadMapInput) {
  const validatedFields = GenerateSpreadMapInputSchema.safeParse(input);

  if (!validatedFields.success) {
    console.error(validatedFields.error.flatten().fieldErrors);
    return {
      error: "Invalid input data for map generation.",
      imageUrl: null
    };
  }
  
  try {
    const result = await generateSpreadMap(validatedFields.data);
    return { imageUrl: result.imageUrl, error: null };
  } catch (e) {
    console.error(e);
    return { error: "Failed to generate map.", imageUrl: null };
  }
}
