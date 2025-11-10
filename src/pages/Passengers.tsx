import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPassengers, type Passenger } from "../features/passengers/api";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { BadgeCheck } from "lucide-react";

export default function Passengers() {
    const [query, setQuery] = useState("");

    const { data, isLoading, isError, refetch, isFetching } = useQuery({
        queryKey: ["passengers", query],
        queryFn: () => fetchPassengers(query.trim() || undefined),
        enabled: query.trim().length === 0 || query.trim().length >= 2,
    });

    // if backend search is weak, we can client-filter as a fallback
    const rows = useMemo<Passenger[]>(
        () => data ?? [],
        [data]
    );

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold tracking-tight">Passengers</h1>

            <div className="flex flex-col sm:flex-row gap-3">
                <Input
                    placeholder="Search name, email, passport…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    className="sm:max-w-sm"
                />
                <div className="flex gap-2">
                    <Button onClick={() => refetch()} disabled={isFetching}>
                        {isFetching ? "Searching…" : "Search"}
                    </Button>
                    <Button variant="outline" onClick={() => setQuery("")}>
                        Clear
                    </Button>
                </div>
            </div>

            <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/40">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Passport</th>
                        <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr><td className="px-4 py-3" colSpan={5}>Loading…</td></tr>
                    ) : isError ? (
                        <tr><td className="px-4 py-3 text-red-600" colSpan={5}>Failed to load passengers.</td></tr>
                    ) : rows.length === 0 ? (
                        <tr><td className="px-4 py-3" colSpan={5}>No passengers found.</td></tr>
                    ) : (
                        rows.map(p => (
                            <tr key={p.id} className="border-t">
                                <td className="px-4 py-2">{p.id}</td>
                                <td className="px-4 py-2 font-medium">
                                    {p.firstName} {p.lastName}
                                </td>
                                <td className="px-4 py-2">{p.email ?? "-"}</td>
                                <td className="px-4 py-2">{p.passportNumber ?? "-"}</td>
                                <td className="px-4 py-2">
                    <span className="inline-flex items-center gap-1 text-xs">
                      <BadgeCheck className="h-4 w-4" /> Active
                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};