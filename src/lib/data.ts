import type { Incident, Alert } from './types';

// Declare a global variable to hold our mock data, preventing it from being reset on hot reloads
declare global {
  var mockIncidents: Incident[] | undefined;
  var mockAlerts: Alert[] | undefined;
}


const initialIncidents: Incident[] = [
  {
    id: 'INC-001',
    location: 'Yosemite National Park, CA',
    date: '2024-07-20T14:30:00Z',
    status: 'Active',
    confidence: 95.5,
    size: '150 acres',
    cause: 'Lightning strike',
    weatherConditions: 'Temp: 85°F, Wind: 15 mph SW, Humidity: 20%',
    vegetationType: 'Mixed Conifer Forest',
    responseEfforts: '2 fire engines, 1 helicopter, 50 personnel deployed.',
    damages: 'No structures threatened.',
    duration: 'Ongoing',
    latitude: 37.8651,
    longitude: -119.5383,
  },
  {
    id: 'INC-002',
    location: 'Rocky Mountain National Park, CO',
    date: '2024-07-18T09:00:00Z',
    status: 'Contained',
    confidence: 99.0,
    size: '75 acres',
    cause: 'Unattended campfire',
    weatherConditions: 'Temp: 75°F, Wind: 5 mph N, Humidity: 35%',
    vegetationType: 'Ponderosa Pine Woodland',
    responseEfforts: 'Containment lines established. Mop-up operations in progress.',
    damages: 'One campsite damaged.',
    duration: '48 hours',
    latitude: 40.3428,
    longitude: -105.6836,
  },
  {
    id: 'INC-003',
    location: 'Angeles National Forest, CA',
    date: '2024-06-25T18:12:00Z',
    status: 'Extinguished',
    confidence: 100,
    size: '20 acres',
    cause: 'Vehicle accident',
    weatherConditions: 'Temp: 92°F, Wind: 10 mph E, Humidity: 15%',
    vegetationType: 'Chaparral',
    responseEfforts: 'Fully extinguished by ground and air crews.',
    damages: 'None reported.',
    duration: '12 hours',
    latitude: 34.2269,
    longitude: -118.1881,
  },
  {
    id: 'INC-004',
    location: 'Sierra National Forest, CA',
    date: '2024-07-21T11:00:00Z',
    status: 'Active',
    confidence: 88.2,
    size: '300 acres',
    cause: 'Under Investigation',
    weatherConditions: 'Temp: 90°F, Wind: 20 mph W, Humidity: 18%',
    vegetationType: 'Oak woodland',
    responseEfforts: 'Evacuations in progress for nearby communities. Air support requested.',
    damages: 'Multiple structures threatened.',
    duration: 'Ongoing',
    latitude: 37.1950,
    longitude: -119.3060,
  }
];

const initialAlerts: Alert[] = [
    {
        id: 'ALT-001',
        incidentId: 'INC-001',
        message: 'New fire detected in Yosemite. High confidence (95.5%).',
        timestamp: '2024-07-20T14:32:00Z',
        severity: 'High',
        read: false,
    },
    {
        id: 'ALT-002',
        incidentId: 'INC-004',
        message: 'Fire INC-004 in Sierra NF has doubled in size. Immediate attention required.',
        timestamp: '2024-07-21T16:45:00Z',
        severity: 'High',
        read: false,
    },
    {
        id: 'ALT-003',
        incidentId: 'INC-002',
        message: 'Fire in Rocky Mountain NP is 100% contained.',
        timestamp: '2024-07-20T10:00:00Z',
        severity: 'Low',
        read: true,
    },
];

// Initialize mockIncidents and mockAlerts only if they don't exist on the global object
if (process.env.NODE_ENV !== 'production') {
  if (!global.mockIncidents) {
    global.mockIncidents = initialIncidents;
  }
  if (!global.mockAlerts) {
    global.mockAlerts = initialAlerts;
  }
} else {
  // In production, just use the initial data.
  // A real app would use a database here.
  if (!global.mockIncidents) {
    global.mockIncidents = initialIncidents;
  }
  if (!global.mockAlerts) {
    global.mockAlerts = initialAlerts;
  }
}

export const mockIncidents: Incident[] = global.mockIncidents!;
export const mockAlerts: Alert[] = global.mockAlerts!;

export const findIncidentById = (id: string) => mockIncidents.find(i => i.id === id);

export const addIncident = (incident: Incident) => {
  mockIncidents.unshift(incident);
}

export const addAlert = (alert: Alert) => {
    mockAlerts.unshift(alert);
}
