


export type Flight = {
    id: number;
    flightNumber: string;
    originCode: string;
    originName: string;
    destinationCode: string;
    destinationName: string;
    departureTime: string;
    arrivalTime: string;
    totalSeats: number;
    availableSeats: number;
    price: number;
    currency: string;

};

export const fetchFlights = async () => {
    const response = await fetch("http://localhost:8080/flights");

    if (!response.ok) {
        throw new Error("Failed to fetch flights");
    }

    const data = await response.json();

    // Handle both paginated and direct array responses
    return data.content || data;
};

