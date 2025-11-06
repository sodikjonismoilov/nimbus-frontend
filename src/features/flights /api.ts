import { api } from "@/lib/api";


export type Flight = {
    id: string;
    flightNumber: string;
    origin?: string;
    destination?: string;
    departureTime?: string;
    arrivalTime?: string;
};

export async function fetchFlights(): Promise<Flight[]>  {
    const res = await api.get<Flight[]>('/flights');
    return res.data;
}