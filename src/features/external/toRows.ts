
import type {Offer} from "@/features/external/api.ts";
export type Row = {
    id: string;
    flight: string;
    route: string;
    departure: string;
    arrival: string;
    price: string;
    code: string;
    date: string;

};

export function toRows(offers: Offer[]): Row[] {
    return offers.map(o => {
        const it = o.itineraries?.[0];
        const s = it?.segments?.[0];

        const code = [s?.carrierCode, s?.flightNumber].filter(Boolean).join("") || "-";
        const route = [s?.departureIata || "-", "→", s?.arrivalIata || "-"].join(" ");
        const departure = s?.departureAt ?? "-";
        const arrival = s?.arrivalAt ?? "-";
        const price = o.total && o.currency ? `${o.total} ${o.currency}` : "-";

        return {
            id:o.id,
            flight: code || "-",
            route,
            departure,
            arrival,
            price,
            code,
            date:(s?.departureAt || "-").slice(0, 10) || "",
        };
        });
}