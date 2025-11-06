import { useQuery } from "@tanstack/react-query";
import {fetchFlights} from "@/features/flights /api.ts";


export default function Flights() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["flights"],
        queryFn: fetchFlights,
    });

    if (isLoading) return <div className="p-6">Loading flights…</div>;
    if (isError) return <div className="p-6 text-red-600">Failed to load flights.</div>;

    return (
        <div>
            <h1 className="text-xl font-semibold mb-4">Flights</h1>

            <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Flight</th>
                        <th className="px-4 py-2 text-left">Origin</th>
                        <th className="px-4 py-2 text-left">Destination</th>
                        <th className="px-4 py-2 text-left">Departure</th>
                        <th className="px-4 py-2 text-left">Arrival</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map(f => (
                        <tr key={f.id} className="border-t">
                            <td className="px-4 py-2">{f.id}</td>
                            <td className="px-4 py-2 font-medium">{f.flightNumber}</td>
                            <td className="px-4 py-2">{f.origin ?? "-"}</td>
                            <td className="px-4 py-2">{f.destination ?? "-"}</td>
                            <td className="px-4 py-2">{f.departureTime ?? "-"}</td>
                            <td className="px-4 py-2">{f.arrivalTime ?? "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
