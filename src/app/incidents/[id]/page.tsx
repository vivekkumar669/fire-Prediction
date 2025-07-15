import { notFound } from "next/navigation";
import Image from "next/image";
import { findIncidentById } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Incident } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin } from "lucide-react";
import { IncidentSummary } from "./incident-summary";

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const incident = findIncidentById(params.id);

  if (!incident) {
    notFound();
  }

  const getBadgeVariant = (status: Incident["status"]) => {
    switch (status) {
      case "Active":
        return "destructive";
      case "Contained":
        return "default";
      case "Extinguished":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <>
      <PageHeader
        title={`Incident ${incident.id}`}
        description={`Details for the fire at ${incident.location}.`}
      />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant={getBadgeVariant(incident.status)} className={incident.status === 'Contained' ? 'bg-accent text-accent-foreground' : ''}>
                  {incident.status}
                </Badge>
                <span className="text-sm text-muted-foreground">Confidence: {incident.confidence}%</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Location</div>
                    <div>{incident.location}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="size-4 mt-1 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Date & Time</div>
                    <div>{new Date(incident.date).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 mt-1 text-muted-foreground"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L12 18l-3.3 3.3a2.4 2.4 0 0 1-3.4 0l-2.6-2.6a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0L12 16l3.3-3.3a2.4 2.4 0 0 1 3.4 0Z"/><path d="m7.5 7.5 3 3"/><path d="m13.5 7.5 3 3"/><path d="m7.5 13.5 3 3"/><path d="m13.5 13.5 3 3"/></svg>
                  <div>
                    <div className="font-semibold">Area Affected</div>
                    <div>{incident.size}</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold">Suspected Cause</div>
                  <div>{incident.cause}</div>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <h4 className="font-semibold">Weather Conditions</h4>
                <p className="text-sm text-muted-foreground">{incident.weatherConditions}</p>
              </div>
              <Separator className="my-4" />
               <div className="space-y-2">
                <h4 className="font-semibold">Response Efforts</h4>
                <p className="text-sm text-muted-foreground">{incident.responseEfforts}</p>
              </div>
            </CardContent>
          </Card>
          <IncidentSummary incident={incident} />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fire Location</CardTitle>
              <CardDescription>GIS map view of the incident.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-square w-full bg-muted rounded-lg overflow-hidden relative">
                <Image
                  src="https://placehold.co/600x600.png"
                  alt="Map showing fire location"
                  data-ai-hint="satellite map"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <MapPin className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-red-500 fill-red-500/50 animate-pulse" />
                <div className="absolute bottom-2 left-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                  Lat: {incident.latitude.toFixed(4)}, Lon: {incident.longitude.toFixed(4)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
