"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getIncidentSummary } from "@/app/actions";
import { type Incident } from "@/lib/types";
import { BotMessageSquare, Loader2 } from "lucide-react";
import { type IncidentReport } from "@/ai/flows/summarize-incident-report";

export function IncidentSummary({ incident }: { incident: Incident }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerateSummary = () => {
    startTransition(async () => {
      setError(null);
      // Map frontend Incident type to backend IncidentReport type
      const reportData: IncidentReport = {
        incidentId: incident.id,
        location: incident.location,
        date: incident.date,
        duration: incident.duration,
        size: incident.size,
        cause: incident.cause,
        weatherConditions: incident.weatherConditions,
        vegetationType: incident.vegetationType,
        responseEfforts: incident.responseEfforts,
        damages: incident.damages,
      }
      const result = await getIncidentSummary(reportData);
      if (result.error) {
        setError(result.error);
      } else {
        setSummary(result.summary || null);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Generated Incident Analysis</CardTitle>
        <CardDescription>
          Generate a concise summary of this incident using AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {summary ? (
          <div className="space-y-4">
            <div className="text-sm p-4 bg-muted/50 rounded-lg whitespace-pre-wrap font-mono">
              {summary}
            </div>
            <Button variant="secondary" onClick={() => setSummary(null)}>
              Generate New Summary
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <p className="text-sm text-muted-foreground">Click the button to generate an after-incident analysis.</p>
            <Button onClick={handleGenerateSummary} disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BotMessageSquare className="mr-2 h-4 w-4" />
              )}
              Generate Summary
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
