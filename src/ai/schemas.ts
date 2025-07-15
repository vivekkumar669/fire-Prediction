import {z} from 'genkit';

export const FireSpreadPredictionInputSchema = z.object({
  windSpeed: z.number().describe('Wind speed in miles per hour.'),
  windDirection: z.string().describe('Wind direction (e.g., North, South, East, West).'),
  vegetationDensity: z.string().describe('Vegetation density (e.g., sparse, moderate, dense).'),
  terrainSlope: z.string().describe('Terrain slope (e.g., flat, gentle, steep).'),
  humidity: z.number().describe('humidity in percentage'),
  temperature: z.number().describe('temperature in fahrenheit'),
});

export const GenerateSpreadMapInputSchema = FireSpreadPredictionInputSchema.extend({
    location: z.string().describe('The geographical location of the fire incident.'),
});
