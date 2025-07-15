// Summarizes fire incident reports to provide administrators with key details and potential causes.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IncidentReportSchema = z.object({
  incidentId: z.string().describe('Unique identifier for the incident.'),
  location: z.string().describe('The geographical location of the fire incident.'),
  date: z.string().describe('Date and time of the incident.'),
  duration: z.string().describe('Duration of the fire incident.'),
  size: z.string().describe('The estimated size of the affected area (e.g., acres, square miles).'),
  cause: z.string().describe('The suspected cause of the fire (e.g., lightning, arson, equipment failure).'),
  weatherConditions: z.string().describe('Weather conditions at the time of the incident (e.g., temperature, wind speed, humidity).'),
  vegetationType: z.string().describe('Type of vegetation in the affected area (e.g., grassland, forest, shrubland).'),
  responseEfforts: z.string().describe('Description of the fire response efforts.'),
  damages: z.string().describe('Description of damages caused by the fire.'),
});

export type IncidentReport = z.infer<typeof IncidentReportSchema>;

const IncidentReportSummarySchema = z.object({
  summary: z.string().describe('A concise summary of the fire incident, including key details and potential causes.'),
});

export type IncidentReportSummary = z.infer<typeof IncidentReportSummarySchema>;

export async function summarizeIncidentReport(incidentReport: IncidentReport): Promise<IncidentReportSummary> {
  return summarizeIncidentReportFlow(incidentReport);
}

const summarizeIncidentReportPrompt = ai.definePrompt({
  name: 'summarizeIncidentReportPrompt',
  input: {schema: IncidentReportSchema},
  output: {schema: IncidentReportSummarySchema},
  prompt: `You are an expert fire analyst. Generate a concise summary report of the following fire incident, including key details and potential causes. Focus on brevity and clarity, highlighting the most important information for administrators.

Incident ID: {{{incidentId}}}
Location: {{{location}}}
Date: {{{date}}}
Duration: {{{duration}}}
Size: {{{size}}}
Cause: {{{cause}}}
Weather Conditions: {{{weatherConditions}}}
Vegetation Type: {{{vegetationType}}}
Response Efforts: {{{responseEfforts}}}
Damages: {{{damages}}}`,
});

const summarizeIncidentReportFlow = ai.defineFlow(
  {
    name: 'summarizeIncidentReportFlow',
    inputSchema: IncidentReportSchema,
    outputSchema: IncidentReportSummarySchema,
  },
  async incidentReport => {
    const {output} = await summarizeIncidentReportPrompt(incidentReport);
    return output!;
  }
);
