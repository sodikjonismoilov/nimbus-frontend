import { useState } from "react";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

import { fetchBookings, createBooking } from "../features/bookings /api";
import type { CreateBookingPayload } from "../features/bookings /api";

const BookingSchema = z.object({
    flightId: z.coerce.number().positive(),
    seatNumber: z.string().min(2),
    passengerFirstName: z.string().optional(),
    passengerLastName: z.string().optional(),
    passengerEmail: z.string().email().optional(),
    passengerPassportNumber: z.string().optional(),
});

export default function Bookings() {
    const qc = useQueryClient();
    const [filterFlightId, setFilterFlightId] = useState<number | undefined>(undefined);

    const { data, isLoading } = useQuery({
        queryKey: ["bookings", filterFlightId ?? "all"],
        queryFn: () => fetchBookings(filterFlightId),
    });

    const mutation = useMutation({
        mutationFn: createBooking,
        onSuccess: () => {
            toast("Booking created");
            qc.invalidateQueries({ queryKey: ["bookings"] });
        },
        onError: (e: unknown) => {
            const err = e as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message ?? "Failed to create booking");
        },
    });

    function handleCreate(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const raw = Object.fromEntries(form.entries());
        const parsed = BookingSchema.safeParse(raw);
        if (!parsed.success) {
            toast.error("Fix form errors");
            return;
        }

        // Strip undefined/empty strings so optional fields don’t break server contracts
        const payload = Object.fromEntries(
            Object.entries(parsed.data).filter(([, v]) => v !== undefined && v !== "")
        ) as CreateBookingPayload;

        mutation.mutate(payload);
        // Optional: e.currentTarget.reset();
    }

    return (
        <div className="space-y-6">
            <h1 className="text-xl font-semibold">Bookings</h1>

            {/* Filter by Flight ID */}
            <div className="flex items-end gap-3">
                <div>
                    <Label htmlFor="filterFlightId" className="mb-1">Filter By Flight ID</Label>
                    <Input
                        id="filterFlightId"
                        placeholder="e.g., 1"
                        type="number"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFilterFlightId(e.target.value ? Number(e.target.value) : undefined)
                        }
                    />
                </div>
                <Button onClick={() => qc.invalidateQueries({ queryKey: ["bookings"] })}>
                    Refresh
                </Button>
            </div>

            {/* Create booking */}
            <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
                <div>
                    <Label htmlFor="flightId" className="mb-1">Flight ID*</Label>
                    <Input id="flightId" name="flightId" type="number" required />
                </div>
                <div>
                    <Label htmlFor="seatNumber" className="mb-1">Seat Number*</Label>
                    <Input id="seatNumber" name="seatNumber" placeholder="12A" required />
                </div>

                <div className="sm:col-span-3 grid gap-4 sm:grid-cols-4 mb-3">
                    <div>
                        <Label htmlFor="passengerFirstName" className="mb-1">First Name</Label>
                        <Input id="passengerFirstName" name="passengerFirstName" />
                    </div>
                    <div>
                        <Label htmlFor="passengerLastName" className="mb-1">Last Name</Label>
                        <Input id="passengerLastName" name="passengerLastName" />
                    </div>
                    <div>
                        <Label htmlFor="passengerEmail" className="mb-1">Email</Label>
                        <Input id="passengerEmail" name="passengerEmail" type="email" />
                    </div>
                    <div>
                        <Label htmlFor="passengerPassportNumber" className="mb-1">Passport Number</Label>
                        <Input id="passengerPassportNumber" name="passengerPassportNumber" />
                    </div>
                </div>

                <div className="sm:col-span-3">
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending ? "Creating..." : "Create Booking"}
                    </Button>
                </div>
            </form>

            {/* List bookings */}
            <div className="overflow-x-auto rounded border">
                <table className="min-w-full text-sm">
                    <thead className="bg-muted/40">
                    <tr>
                        <th className="px-4 py-2 text-left">ID</th>
                        <th className="px-4 py-2 text-left">Flight</th>
                        <th className="px-4 py-2 text-left">Seat</th>
                        <th className="px-4 py-2 text-left">Passenger ID</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td className="px-3 py-3" colSpan={4}>
                                Loading…
                            </td>
                        </tr>
                    ) : (
                        (data ?? []).map(b => (
                            <tr key={b.id} className="border-t">
                                <td className="px-3 py-2">{b.id}</td>
                                <td className="px-3 py-2">{b.flightId}</td>
                                <td className="px-3 py-2">{b.seatNumber}</td>
                                <td className="px-3 py-2">{b.passengerId ?? "-"}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}