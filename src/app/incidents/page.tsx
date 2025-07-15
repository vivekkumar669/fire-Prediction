"use client";

import { useState } from "react";
import Link from "next/link";
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
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/page-header";
import { mockIncidents } from "@/lib/data";
import { type Incident } from "@/lib/types";
import { ArrowUpRight, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function IncidentsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredIncidents = mockIncidents.filter((incident) =>
    incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    incident.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        title="Historical Incidents"
        description="A searchable repository of past fire incidents."
      >
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search incidents..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </PageHeader>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Incident ID</TableHead>
                <TableHead className="hidden sm:table-cell">Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Size</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell className="font-medium">{incident.id}</TableCell>
                  <TableCell className="hidden sm:table-cell">{incident.location}</TableCell>
                  <TableCell>
                    <Badge variant={getBadgeVariant(incident.status)} className={
                      incident.status === 'Contained' ? 'bg-accent text-accent-foreground' : ''
                    }>
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{incident.size}</TableCell>
                  <TableCell className="hidden md:table-cell">{new Date(incident.date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/incidents/${incident.id}`}>View<ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
