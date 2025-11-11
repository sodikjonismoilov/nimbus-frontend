import {http} from "../../lib/api"; // shared client based on VITE_API_URL

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
            departureAt: string | null;
            arrivalIata: string | null;
            arrivalAt: string | null;
        }[];
    }[];
};

export type ExternalFlightStatus = {
    carrierCode: string | null;
    flightNumber: string | null;
    status: string | null;
    departureIata: string | null;
    departureScheduled: string | null;
    departureEstimated: string | null;
    arrivalIata: string | null;
    arrivalScheduled: string | null;
    arrivalEstimated: string | null;
};

export type BulkStatusEntry = {
    code: string;
    date: string;
    status: ExternalFlightStatus | null;
    error: "INVALID_INPUT" | "PAST_DATE" | "NOT_FOUND" | null;
};
export type BulkStatusResult = { results: BulkStatusEntry[] };

export type SearchParams = {
    origin: string;
    destination: string;
    date: string;
    adults?: number | string;
    nonStop?: boolean | string;
    max?: number | string;
    currencyCode?: string;
    travelClass?: "ECONOMY" | "PREMIUM_ECONOMY" | "BUSINESS" | "FIRST";
    includedAirlineCodes?: string;
};

export async function searchFlights(params: SearchParams) {
    if (!params?.origin || !params?.destination || !params?.date) {
        throw new Error("origin, destination, and date are required (YYYY-MM-DD).");
    }
    const { data } = await http.get<Offer[]>("/external/search/offers", { params });
    return data;
}

export async function getFlightStatus(code: string, date: string) {
    const { data } = await http.get<ExternalFlightStatus>("/external/flights/status", {
        params: { code, date },
    });
    return data;
}

export async function getBulkStatus(items: { code: string; date: string }[]) {
    const { data } = await http.post<BulkStatusResult>("/external/flights/status/bulk", { items });
    return data.results;
}