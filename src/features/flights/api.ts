import { http } from "../../lib/api";

export type Flight = {
    id: number;
    flightNumber: string;
    originCode: string;
    originName: string;
    destinationCode: string;
    destinationName: string;
    departureTime: string;
    arrivalTime: string;
    totalSeats: number;
    availableSeats: number;
    price: number;
    currency: string;
};

type Page<T> = {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number; // current page (0-based)
    size: number;
};

export async function fetchFlights(params?: Record<string, string | number>) {
    const { data } = await http.get<Page<Flight> | Flight[]>("/flights", { params });
    // Normalize both paginated and non-paginated responses
    return Array.isArray(data) ? data : data.content;
}