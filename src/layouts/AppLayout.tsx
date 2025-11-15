import { Link, NavLink, Outlet } from "react-router-dom"
import ThemeToggle from "@/components/ThemeToggle.tsx";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

function AppLayout() {
    const { user, signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    };

    return (
        <div className="min-h-screen">
            <header className="border-b">
                <nav className="mx-auto max-w-6xl flex items-center gap-6 p-4">
                    <Link to="/" className="font-semibold">Airlines</Link>
                    {user && (
                        <ul className="flex items-center gap-4 text-sm">
                            <li><NavLink to="/flights">Flights</NavLink></li>
                            <li><NavLink to="/bookings">Bookings</NavLink></li>
                            <li><NavLink to="/passengers">Passengers</NavLink></li>
                        </ul>
                    )}
                    <div className="ml-auto flex items-center gap-4">
                        {user ? (
                            <>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <User className="h-4 w-4" />
                                    <span>{user.email}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <Button variant="outline" size="sm" asChild>
                                <Link to="/login">Sign In</Link>
                            </Button>
                        )}
                        <ThemeToggle />
                    </div>
                </nav>
            </header>
            <main className="mx-auto max-w-6xl p-6">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout
