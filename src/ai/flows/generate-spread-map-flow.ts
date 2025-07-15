'use server';
/**
 * @fileOverview Generates a fire spread prediction map.
 * - generateSpreadMap - A function that handles the map generation.
 * - GenerateSpreadMapInput - The input type for the generateSpreadMap function.
 * - GenerateSpreadMapOutput - The return type for the generateSpreadMap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { fireSpreadPrediction } from './fire-spread-prediction-flow';
import { GenerateSpreadMapInputSchema } from '../schemas';

export type GenerateSpreadMapInput = z.infer<typeof GenerateSpreadMapInputSchema>;

const GenerateSpreadMapOutputSchema = z.object({
  imageUrl: z.string().describe('URL of the generated map image as a data URI.'),
  predictionPrompt: z.string().describe('The simulation prompt that was used.'),
});
export type GenerateSpreadMapOutput = z.infer<typeof GenerateSpreadMapOutputSchema>;


export async function generateSpreadMap(input: GenerateSpreadMapInput): Promise<GenerateSpreadMapOutput> {
    return generateSpreadMapFlow(input);
}

const generateSpreadMapFlow = ai.defineFlow(
  {
    name: 'generateSpreadMapFlow',
    inputSchema: GenerateSpreadMapInputSchema,
    outputSchema: GenerateSpreadMapOutputSchema,
  },
  async (input) => {
    const predictionResult = await fireSpreadPrediction(input);

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate a satellite-view map illustrating a potential wildfire spread scenario. The map should depict a forested, mountainous area, typical of ${input.location}.
      
      Key elements to include:
      1. A visible starting point of the fire.
      2. A clearly marked "Predicted Spread Area" based on the following simulation parameters. This area should be shown with a translucent red overlay, indicating the potential fire progression over the next few hours.
      3. Natural features like hills, valleys, and vegetation.
      
      Simulation Parameters for Visualization:
      ${predictionResult.predictionPrompt}
      
      The map should have a tactical and realistic feel, suitable for a fire management dashboard. Do not include any text, labels, or legends on the image itself.`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('Image generation failed.');
    }

    return { imageUrl: media.url, predictionPrompt: predictionResult.predictionPrompt };
  }
);
