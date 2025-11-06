import { Link, NavLink, Outlet } from "react-router-dom"

function AppLayout() {
    return (
        <div className="min-h-screen">
            <header className="border-b">
                <nav className="mx-auto max-w-6xl flex items-center gap-6 p-4">
                    <Link to="/" className="font-semibold">Airlines</Link>
                    <ul className="flex items-center gap-4 text-sm">
                        <li><NavLink to="/flights">Flights</NavLink></li>
                        <li><NavLink to="/bookings">Bookings</NavLink></li>
                        <li><NavLink to="/passengers">Passengers</NavLink></li>
                    </ul>
                </nav>
            </header>
            <main className="mx-auto max-w-6xl p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout
