'use server';

/**
 * @fileOverview Generates a fire spread prediction prompt based on incident factors.
 *
 * - fireSpreadPrediction - A function that generates the fire spread prediction prompt.
 * - FireSpreadPredictionInput - The input type for the fireSpreadPrediction function.
 * - FireSpreadPredictionOutput - The return type for the fireSpreadPrediction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { FireSpreadPredictionInputSchema } from '../schemas';

export type FireSpreadPredictionInput = z.infer<typeof FireSpreadPredictionInputSchema>;

const FireSpreadPredictionOutputSchema = z.object({
  predictionPrompt: z.string().describe('A detailed prompt for fire spread simulation, incorporating incident factors.'),
});
export type FireSpreadPredictionOutput = z.infer<typeof FireSpreadPredictionOutputSchema>;

export async function fireSpreadPrediction(input: FireSpreadPredictionInput): Promise<FireSpreadPredictionOutput> {
  return fireSpreadPredictionFlow(input);
}

const fireSpreadPredictionPrompt = ai.definePrompt({
  name: 'fireSpreadPredictionPrompt',
  input: {schema: FireSpreadPredictionInputSchema},
  output: {schema: FireSpreadPredictionOutputSchema},
  prompt: `You are an expert fire behavior analyst. Generate a detailed prompt for a fire spread simulation tool based on the following incident factors:

Wind Speed: {{windSpeed}} mph
Wind Direction: {{windDirection}}
Vegetation Density: {{vegetationDensity}}
Terrain Slope: {{terrainSlope}}
Humidity: {{humidity}}%
Temperature: {{temperature}}°F

The prompt should instruct the simulation tool to accurately model fire spread, considering the combined influence of these factors. The prompt should be detailed and specific to produce a high-quality simulation. Also ensure that the prompt can be directly ingested into a simulation software. The prompt should also focus on keeping people and property safe.
`,
});

const fireSpreadPredictionFlow = ai.defineFlow(
  {
    name: 'fireSpreadPredictionFlow',
    inputSchema: FireSpreadPredictionInputSchema,
    outputSchema: FireSpreadPredictionOutputSchema,
  },
  async input => {
    const {output} = await fireSpreadPredictionPrompt(input);
    return output!;
  }
);
