import { Routes, Route } from "react-router-dom"
import AppLayout from "@/layouts/AppLayout.tsx";
import Home from "@/pages/Home.tsx";
import Flights from "@/pages/Flights.tsx";
import Passengers from "@/pages/Passengers.tsx";
import NotFound from "@/pages/NotFound.tsx";
import Bookings from "@/pages/Bookings.tsx";




 export default function App() {
  return(

      <Routes>
          <Route element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="flights" element={<Flights />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="passengers" element={<Passengers />} />
              <Route path="*" element={<NotFound />} />
          </Route>
      </Routes>
  );
}


