import { Routes, Route } from "react-router-dom";
import { HotelContext } from "./context/hotelContext";

import Header from "./components/Header/Header";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Home from "./components/Home/Home";
import { useState } from "react";
import Reservation from "./components/Reservation/Reservation";

function App() {
  const [userId, setUserId] = useState("");

  const contextObject = {
    userId,
    setUserId,
  };

  return (
    <>
      <HotelContext.Provider value={contextObject}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reservations" element={<Reservation />} />
        </Routes>
      </HotelContext.Provider>
    </>
  );
}

export default App;
