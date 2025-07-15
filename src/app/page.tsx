import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { mockIncidents } from "@/lib/data";
import { ArrowUpRight, AlertTriangle, ShieldCheck, Thermometer } from "lucide-react";
import { SpreadMap } from "./dashboard-spread-map";

export default function Dashboard() {
  const activeIncidents = mockIncidents.filter(i => i.status === 'Active');
  const firstActiveIncident = activeIncidents[0];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Real-time overview of fire detection and system status."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIncidents.length}</div>
            <p className="text-xs text-muted-foreground">Currently monitored fire events</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <ShieldCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Operational</div>
            <p className="text-xs text-muted-foreground">All systems running normally</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Confidence</CardTitle>
            <Thermometer className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.max(...mockIncidents.map(i => i.confidence))}%</div>
            <p className="text-xs text-muted-foreground">Max confidence score on active fires</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Area</CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L12 18l-3.3 3.3a2.4 2.4 0 0 1-3.4 0l-2.6-2.6a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0L12 16l3.3-3.3a2.4 2.4 0 0 1 3.4 0Z"/><path d="m7.5 7.5 3 3"/><path d="m13.5 7.5 3 3"/><path d="m7.5 13.5 3 3"/><path d="m13.5 13.5 3 3"/></svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~525 Acres</div>
            <p className="text-xs text-muted-foreground">Total estimated burn area</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Active Incidents</CardTitle>
            <CardDescription>A list of fires currently being tracked.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeIncidents.map((incident) => (
                  <TableRow key={incident.id}>
                    <TableCell>
                      <div className="font-medium">{incident.id}</div>
                      <div className="text-sm text-muted-foreground">{incident.location}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={incident.status === 'Active' ? 'destructive' : 'default'} className="bg-primary/20 text-primary border-primary/40">
                        {incident.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{incident.confidence.toFixed(1)}%</TableCell>
                    <TableCell>{new Date(incident.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/incidents/${incident.id}`}>View Details <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <SpreadMap incident={firstActiveIncident} />
        </Card>
      </div>
    </>
  );
}
