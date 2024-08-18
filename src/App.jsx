import { Routes, Route, Navigate } from "react-router-dom";
import { HotelContext } from "./context/hotelContext";
import { NotificationProvider } from "./context/notificationContext";

import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import { useState } from "react";
import Reservation from "./components/Reservation/Reservation";

import MyReservations from "./components/MyReservations/MyReservations";
import ReservationConfirmation from "./components/ReservationConfirmation/ReservationConfirmation";
import NotificationAlerts from "./components/Notifications/Notifications";

function App() {
  const [userId, setUserId] = useState("");

  const contextObject = {
    userId,
    setUserId,
  };

  return (
    <>
      <HotelContext.Provider value={contextObject}>
        <NotificationProvider>
          <Header />
          <NotificationAlerts />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reservations" element={<Reservation />} />
            <Route
              path="/reservation-confirmation"
              element={<ReservationConfirmation />}
            />
            <Route
              path="/my-reservations"
              element={
                userId ? <MyReservations /> : <Navigate to="/login" replace />
              }
            />
          </Routes>
        </NotificationProvider>
      </HotelContext.Provider>
    </>
  );
}

export default App;
