import {http} from "@/lib/api.ts";

export type Airport = {
    id: number;
    code: string;
    name: string;
    city: string;
    country: string;
};

export type CreateAirportPayload = Omit<Airport, "id">;

const AIRPORTS_ENDPOINT = "/airports";

export async function fetchAirports() {
    const res = await http.get<Airport[]>(AIRPORTS_ENDPOINT, { params: { page: 0, size: 50 } });
    return res.data;
}

export async function createAirport(payload: CreateAirportPayload) {
    const res = await http.post<Airport>(AIRPORTS_ENDPOINT, payload);
    return res.data;
}
