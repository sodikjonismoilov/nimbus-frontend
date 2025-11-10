// src/pages/Home.tsx
import { useMemo, useState } from "react";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

import {
    fetchAirports,
    createAirport,
    type Airport,
    type CreateAirportPayload,
} from "../features/airports/api";

import {
    searchFlights,
    type Offer,
} from "../features/external/api";

/* ---------------- Zod schema ---------------- */
const AirportSchema = z.object({
    code: z.string().trim().min(3).max(4),
    name: z.string().trim().min(2),
    city: z.string().trim().min(2),
    country: z.string().trim().min(2),
});

/* ---------------- Helpers for offers -> rows ---------------- */
type OfferRow = {
    id: string;
    flight: string;          // e.g. B62503
    route: string;           // JFK → LAX
    departure: string;       // ISO string from API
    arrival: string;         // ISO string from API
    price: string;           // "388.45 USD"
};

function offerToRow(o: Offer): OfferRow {
    const it = o.itineraries?.[0];
    const s = it?.segments?.[0];

    const carrier = s?.carrierCode ?? "";
    const number  = s?.flightNumber ?? "";
    const depIata = s?.departureIata ?? "-";
    const arrIata = s?.arrivalIata ?? "-";
    const depAt   = s?.departureAt ?? "-";
    const arrAt   = s?.arrivalAt ?? "-";

    const total   = o.total ?? "";
    const curr    = o.currency ?? "";

    return {
        id: o.id ?? `${carrier}${number}-${depAt}`,
        flight: carrier && number ? `${carrier}${number}` : "-",
        route: `${depIata} → ${arrIata}`,
        departure: depAt,
        arrival: arrAt,
        price: total && curr ? `${total} ${curr}` : "-",
    };
}

/* Pretty time/date helpers (optional) */
const fmtDateTime = (iso?: string) =>
    iso && iso !== "-" ? new Date(iso).toLocaleString([], { hour: "2-digit", minute: "2-digit" }) : "-";

export default function Home() {
    const qc = useQueryClient();

    /* ---------------- Airports ---------------- */
    const {
        data: airports,
        isLoading: airportsLoading,
        isError: airportsError,
    } = useQuery({
        queryKey: ["airports"],
        queryFn: fetchAirports,
    });

    const createMutation = useMutation({
        mutationFn: (payload: CreateAirportPayload) => createAirport(payload),
        onSuccess: () => {
            toast("Airport added");
            qc.invalidateQueries({ queryKey: ["airports"] });
        },
        onError: (e: unknown) => {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message ?? "Failed to add airport");
        },
    });

    function handleCreateAirport(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const raw = Object.fromEntries(form.entries());
        const parsed = AirportSchema.safeParse(raw);
        if (!parsed.success) {
            toast.error("Fix airport form errors");
            return;
        }
        createMutation.mutate(parsed.data as CreateAirportPayload);
        (e.currentTarget as HTMLFormElement).reset();
    }

    /* ---------------- External flight offers (filters + client-side pagination) ---------------- */
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState(""); // YYYY-MM-DD
    const [page, setPage] = useState(0);
    const pageSize = 20;

    const canQuery = origin.trim().length === 3 && destination.trim().length === 3 && /^\d{4}-\d{2}-\d{2}$/.test(date);

    const {
        data: offers,
        isLoading: offersLoading,
        isError: offersError,
        isFetching: offersFetching,
        refetch: refetchOffers,
    } = useQuery({
        queryKey: ["external-offers", { origin, destination, date }],
        queryFn: () =>
            searchFlights({
                origin: origin.trim().toUpperCase(),
                destination: destination.trim().toUpperCase(),
                date,
                currencyCode: "USD",
                nonStop: "true",
                max: "40", // fetch more, paginate on client
            }),
        enabled: canQuery, // only query when inputs are valid
    });

    const rows: OfferRow[] = useMemo(() => (offers ?? []).map(offerToRow), [offers]);

    const pagedRows = useMemo(() => {
        const start = page * pageSize;
        return rows.slice(start, start + pageSize);
    }, [rows, page]);

    function applyFilters() {
        if (!canQuery) {
            toast.error("Enter origin, destination (3-letter IATA) and a date (YYYY-MM-DD).");
            return;
        }
        setPage(0);
        refetchOffers();
    }

    return (
        <div className="space-y-10">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>

            {/* Add Airport */}
            <section className="space-y-4">
                <h2 className="text-lg font-medium">Add Airport</h2>
                <form onSubmit={handleCreateAirport} className="grid gap-4 sm:grid-cols-4">
                    <div>
                        <Label htmlFor="code" className="mb-1">Code (IATA/ICAO)</Label>
                        <Input id="code" name="code" placeholder="JFK" required />
                    </div>
                    <div className="sm:col-span-2">
                        <Label htmlFor="name" className="mb-1">Name</Label>
                        <Input id="name" name="name" placeholder="John F. Kennedy International Airport" required />
                    </div>
                    <div>
                        <Label htmlFor="city" className="mb-1">City</Label>
                        <Input id="city" name="city" placeholder="New York" required />
                    </div>
                    <div>
                        <Label htmlFor="country" className="mb-1">Country</Label>
                        <Input id="country" name="country" placeholder="USA" required />
                    </div>
                    <div className="sm:col-span-4">
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? "Adding..." : "Add Airport"}
                        </Button>
                    </div>
                </form>
            </section>

            {/* Airports List */}
            <section className="space-y-4">
                <h2 className="text-lg font-medium">Airports</h2>
                <div className="overflow-x-auto rounded border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/40">
                        <tr>
                            <th className="px-3 py-2 text-left">ID</th>
                            <th className="px-3 py-2 text-left">Code</th>
                            <th className="px-3 py-2 text-left">Name</th>
                            <th className="px-3 py-2 text-left">City</th>
                            <th className="px-3 py-2 text-left">Country</th>
                        </tr>
                        </thead>
                        <tbody>
                        {airportsLoading ? (
                            <tr>
                                <td className="px-3 py-3" colSpan={5}>Loading…</td>
                            </tr>
                        ) : airportsError ? (
                            <tr>
                                <td className="px-3 py-3 text-red-600" colSpan={5}>Failed to load airports.</td>
                            </tr>
                        ) : (airports ?? []).length === 0 ? (
                            <tr>
                                <td className="px-3 py-3" colSpan={5}>No airports yet.</td>
                            </tr>
                        ) : (
                            (airports as Airport[]).map((a) => (
                                <tr key={a.id} className="border-t">
                                    <td className="px-3 py-2">{a.id}</td>
                                    <td className="px-3 py-2 font-medium">{a.code}</td>
                                    <td className="px-3 py-2">{a.name}</td>
                                    <td className="px-3 py-2">{a.city}</td>
                                    <td className="px-3 py-2">{a.country}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* External Flight Offers */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">External Flight Offers</h2>
                    <div className="text-xs text-muted-foreground">Page {page + 1}</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                    <div>
                        <Label htmlFor="origin" className="mb-1">Origin</Label>
                        <Input
                            id="origin"
                            placeholder="JFK"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div>
                        <Label htmlFor="destination" className="mb-1">Destination</Label>
                        <Input
                            id="destination"
                            placeholder="LAX"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value.toUpperCase())}
                        />
                    </div>
                    <div>
                        <Label htmlFor="date" className="mb-1">Date</Label>
                        <Input
                            id="date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                    <div className="flex items-end gap-2">
                        <Button onClick={applyFilters} disabled={offersFetching}>
                            {offersFetching ? "Fetching…" : "Apply"}
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setOrigin("");
                                setDestination("");
                                setDate("");
                                setPage(0);
                            }}
                        >
                            Clear
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/40">
                        <tr>
                            <th className="px-3 py-2 text-left">Flight</th>
                            <th className="px-3 py-2 text-left">Route</th>
                            <th className="px-3 py-2 text-left">Departure</th>
                            <th className="px-3 py-2 text-left">Arrival</th>
                            <th className="px-3 py-2 text-left">Price</th>
                        </tr>
                        </thead>
                        <tbody>
                        {!canQuery ? (
                            <tr><td className="px-3 py-3" colSpan={5}>Enter origin, destination and date to search.</td></tr>
                        ) : offersLoading ? (
                            <tr><td className="px-3 py-3" colSpan={5}>Loading…</td></tr>
                        ) : offersError ? (
                            <tr><td className="px-3 py-3 text-red-600" colSpan={5}>Failed to load offers.</td></tr>
                        ) : pagedRows.length === 0 ? (
                            <tr><td className="px-3 py-3" colSpan={5}>No results.</td></tr>
                        ) : (
                            pagedRows.map((r) => (
                                <tr key={r.id} className="border-t">
                                    <td className="px-3 py-2 font-medium">{r.flight}</td>
                                    <td className="px-3 py-2">{r.route}</td>
                                    <td className="px-3 py-2">{ fmtDateTime(r.departure) }</td>
                                    <td className="px-3 py-2">  { fmtDateTime(r.arrival) }</td>
                                    <td className="px-3 py-2">{r.price}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        disabled={page === 0 || offersFetching || rows.length <= pageSize}
                    >
                        Prev
                    </Button>
                    <Button
                        onClick={() => setPage((p) => (p + 1) * pageSize < rows.length ? p + 1 : p)}
                        disabled={offersFetching || (page + 1) * pageSize >= rows.length}
                    >
                        Next
                    </Button>
                </div>
            </section>
        </div>
    );
}