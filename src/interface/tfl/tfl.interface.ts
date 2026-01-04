export interface TransitRoute {
    mode: string;
    route: string;
    status: string;
    details: string;
}

export interface TransitEta {
    line: string;
    destination: string;
    platform: string;
    timeToStation: number;
    expectedArrival: string;
}

export interface IncidentInput {
    type: string;
    line: string;
    description: string;
    stopId?: string;
}