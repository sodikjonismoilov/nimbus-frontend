// src/features/external/api.ts
import axios from "axios";

// normalize and append /external
const ROOT = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");
const BASE_URL = `${ROOT}/external`;

/** Backend search DTO (matches your SearchOfferDTO) */

export type Offer = {
    id: string;
    validatingCarrier: string | null;
    currency: string | null;
    total: string | null;
    itineraries: {
        duration: string | null;
        segments: {
            carrierCode: string | null;
            flightNumber: string | null;
            departureIata: string | null;
            departureAt: string | null; // ISO string
            arrivalIata: string | null;
            arrivalAt: string | null;   // ISO string
        }[];
    }[];
};

/** Single-flight status DTO (matches ExternalFlightStatus) */
export type ExternalFlightStatus = {
    carrierCode: string | null;
    flightNumber: string | null;
    status: string | null;
    departureIata: string | null;
    departureScheduled: string | null;
    departureEstimated: string | null;
    // departureTerminal: string | null;
    // departureGate: string | null;
    arrivalIata: string | null;
    arrivalScheduled: string | null;
    arrivalEstimated: string | null;
    // arrivalTerminal: string | null;
    // arrivalGate: string | null;
};

/** Bulk result DTO */
export type BulkStatusEntry = {
    code: string;
    date: string;
    status: ExternalFlightStatus | null;
    error: "INVALID_INPUT" | "PAST_DATE" | "NOT_FOUND" | null;
};

export type BulkStatusResult = { results: BulkStatusEntry[] };

/** Required params for search — stop sending page/size */
export type SearchParams = {
    origin: string;                 // "JFK"
    destination: string;            // "LHR"
    date: string;                   // "YYYY-MM-DD"
    adults?: number | string;       // default 1
    nonStop?: boolean | string;     // default true
    max?: number | string;          // default 20
    currencyCode?: string;          // "USD"
    travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
    includedAirlineCodes?: string;  // "VS,BA"
    //returnDate?: string;            // "YYYY-MM-DD"
};

export async function searchFlights(params: SearchParams) {
    // enforce required keys so you don’t ship nonsense
    if (!params?.origin || !params?.destination || !params?.date) {
        throw new Error("origin, destination, and date are required (YYYY-MM-DD).");
    }
    const { data } = await axios.get<Offer[]>(`${BASE_URL}/search/offers`, { params });
    return data;
}

export async function getFlightStatus(code: string, date: string) {
    const { data } = await axios.get<ExternalFlightStatus>(`${BASE_URL}/flights/status`, {
        params: { code, date },
    });
    return data;
}

export async function getBulkStatus(items: { code: string; date: string }[]) {
    const { data } = await axios.post<BulkStatusResult>(`${BASE_URL}/flights/status/bulk`, { items });
    return data.results;
}