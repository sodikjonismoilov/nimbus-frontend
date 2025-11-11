import {http} from "../../lib/api";

export type Booking = {
    id: number;
    flightId: number;
    passengerId?: number;
    seatNumber: string;
    passengerFirstName?: string;
    passengerLastName?: string;
    passengerEmail?: string;
    passengerPassportNumber?: string;
};

export type CreateBookingPayload = {
    flightId: number;
    seatNumber: string;
    passengerId?: number;
    passengerFirstName?: string;
    passengerLastName?: string;
    passengerEmail?: string;
    passengerPassportNumber?: string;
};

export async function fetchBookings(flightId?: number): Promise<Booking[]> {
    const res = await http.get<Booking[]>("/bookings", {
        params: flightId ? { flightId } : undefined,
    });
    return res.data;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
    const res = await http.post<Booking>("/bookings", payload);
    return res.data;
}