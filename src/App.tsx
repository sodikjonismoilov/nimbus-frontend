import { Routes, Route } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout.tsx";
import Home from "@/pages/Home.tsx";
import Flights from "@/pages/Flights.tsx";
import Passengers from "@/pages/Passengers.tsx";
import NotFound from "@/pages/NotFound.tsx";
import Bookings from "@/pages/Bookings.tsx";
import Login from "@/pages/Login.tsx";
import Signup from "@/pages/Signup.tsx";
import ProtectedRoute from "@/components/ProtectedRoute.tsx";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route
          path="flights"
          element={
            <ProtectedRoute>
              <Flights />
            </ProtectedRoute>
          }
        />
        <Route
          path="bookings"
          element={
            <ProtectedRoute>
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="passengers"
          element={
            <ProtectedRoute>
              <Passengers />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}


