export type Incident = {
  id: string;
  location: string;
  date: string;
  status: 'Active' | 'Contained' | 'Extinguished';
  confidence: number;
  size: string; // e.g. "50 acres"
  cause: string;
  weatherConditions: string;
  vegetationType: string;
  responseEfforts: string;
  damages: string;
  duration: string;
  latitude: number;
  longitude: number;
};

export type Alert = {
  id: string;
  incidentId: string;
  message: string;
  timestamp: string;
  severity: 'High' | 'Medium' | 'Low';
  read: boolean;
};
