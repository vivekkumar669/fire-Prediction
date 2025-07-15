import { PageHeader } from "@/components/page-header";
import { mockAlerts } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Bell, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function AlertsPage() {
    return (
        <>
            <PageHeader
                title="Alerts"
                description="Notifications and updates about fire incidents."
            >
                <Button>Mark all as read</Button>
            </PageHeader>
            <Card>
                <CardContent className="p-0">
                    <ul className="divide-y">
                        {mockAlerts.map(alert => (
                            <li key={alert.id} className={cn(
                                "flex items-start md:items-center gap-4 p-4 flex-col sm:flex-row",
                                !alert.read && "bg-primary/5"
                            )}>
                                <div className={cn(
                                    "p-2 rounded-full",
                                    alert.severity === 'High' && "bg-destructive/10 text-destructive",
                                    alert.severity === 'Medium' && "bg-yellow-500/10 text-yellow-500",
                                    alert.severity === 'Low' && "bg-green-500/10 text-green-500",
                                )}>
                                    {alert.severity === 'High' ? <AlertTriangle className="size-5" /> : <Bell className="size-5" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{alert.message}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Incident {alert.incidentId} &middot; {new Date(alert.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                {!alert.read && (
                                    <Button variant="ghost" size="sm">
                                        <CheckCircle2 className="mr-2 size-4" />
                                        Mark as read
                                    </Button>
                                )}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </>
    )
}
