import { http} from "../../lib/api";

export type Passenger = {
    id: number;
    firstName: string;
    lastName: string;
    email?: string;
    passportNumber?: string;
};

export async function fetchPassengers(search?: string): Promise<Passenger[]> {
    // list-all vs search
    if (!search) {
        const res = await http.get<Passenger[]>("/passengers", {
            params: { page: 0, size: 50 },
        });
        return res.data;
    }

    // Try the usual suspects in order
    const tryOnce = async (url: string, params: Record<string, any>) => {
        const r = await http.get<Passenger[]>(url, { params });
        return r.data;
    };

    // 1) /passengers?q=... (what you had)
    try {
        return await tryOnce("/passengers", { q: search, page: 0, size: 50 });
    } catch {}

    // 2) /passengers?keyword=...
    try {
        return await tryOnce("/passengers", { keyword: search, page: 0, size: 50 });
    } catch {}

    // 3) /passengers?query=...
    try {
        return await tryOnce("/passengers", { query: search, page: 0, size: 50 });
    } catch {}

    // 4) /passengers?name=... (common for name-based search)
    try {
        return await tryOnce("/passengers", { name: search, page: 0, size: 50 });
    } catch {}

    // 5) /passengers/search?q=... (separate search endpoint)
    try {
        return await tryOnce("/passengers/search", { q: search, page: 0, size: 50 });
    } catch (err: any) {
        console.error("Passenger search failed:", err?.response?.status, err?.response?.data || err);
        throw err;
    }
}