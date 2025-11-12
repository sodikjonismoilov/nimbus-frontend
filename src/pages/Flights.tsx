import { useQuery } from "@tanstack/react-query";
import {fetchFlights, type Flight} from "@/features/flights/api.ts";

export default function Flights() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["flights"],
        queryFn: () => fetchFlights(),
    });

    console.log("Flight data:", data);

    if (isLoading) return <div className="p-6">Loading flights…</div>;
    if (isError) return <div className="p-6 text-red-600">Failed to load flights.</div>;

    // Ensure data is an array
    const flights = Array.isArray(data) ? data : [];

    return (
        <div>
            <h1 className="text-xl font-semibold mb-4">Flights</h1>

            {flights.length === 0 ? (
                <div className="p-6 text-gray-500">No flights available.</div>
            ) : (
                <div className="overflow-x-auto rounded border">
                    <table className="min-w-full text-sm">
                        <thead className="bg-muted/40">
                        <tr>
                            <th className="px-4 py-2 text-left">ID</th>
                            <th className="px-4 py-2 text-left">Flight</th>
                            <th className="px-4 py-2 text-left">Origin</th>
                            <th className="px-4 py-2 text-left">Destination</th>
                            <th className="px-4 py-2 text-left">Departure</th>
                            <th className="px-4 py-2 text-left">Arrival</th>
                            <th className="px-4 py-2 text-left">Price</th>
                            <th className="px-4 py-2 text-left">Seats</th>
                        </tr>
                        </thead>
                        <tbody>
                        {flights.map((f: Flight) => (
                            <tr key={f.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-2">{f.id}</td>
                                <td className="px-4 py-2 font-medium">{f.flightNumber}</td>
                                <td className="px-4 py-2">
                                    <div className="font-medium">{f.originCode}</div>
                                    <div className="text-xs text-gray-500">{f.originName}</div>
                                </td>
                                <td className="px-4 py-2">
                                    <div className="font-medium">{f.destinationCode}</div>
                                    <div className="text-xs text-gray-500">{f.destinationName}</div>
                                </td>
                                <td className="px-4 py-2">
                                    {new Date(f.departureTime).toLocaleString()}
                                </td>
                                <td className="px-4 py-2">
                                    {new Date(f.arrivalTime).toLocaleString()}
                                </td>
                                <td className="px-4 py-2">
                                    {f.price} {f.currency}
                                </td>
                                <td className="px-4 py-2">
                                    {f.availableSeats}/{f.totalSeats}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}