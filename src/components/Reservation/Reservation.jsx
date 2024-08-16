import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../config/firebase";
import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

import { HotelContext } from "../../context/hotelContext";

export default function Reservation() {
  const { userId } = useContext(HotelContext);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [roomType, setRoomType] = useState("");
  const [guests, setGuests] = useState(1);

  const navigate = useNavigate();

  const reservationCollectionRef = collection(db, "reservations");

  const handleReservation = async () => {
    if (!userId) {
      alert("You must be logged in to make a reservation!");
      navigate("/login");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if (guests <= 0) {
      alert("Number of guests must be at least 1.");
      return;
    }

    if (!roomType) {
      alert("Please select a room type.");
      return;
    }

    const checkInTimestamp = Timestamp.fromDate(new Date(checkInDate));
    const checkOutTimestamp = Timestamp.fromDate(new Date(checkOutDate));

    if (checkOutTimestamp <= checkInTimestamp) {
      alert("Check-out date must be later than check-in date.");
      return;
    }

    try {
      // Създаване на заявка за проверка на налични стаи от избрания тип
      const q = query(
        reservationCollectionRef,
        where("roomType", "==", roomType),
        where("checkInDate", "<", checkOutTimestamp),
        where("checkOutDate", ">", checkInTimestamp)
      );

      const querySnapshot = await getDocs(q);

      const numberOfReservations = querySnapshot.size;

      // Вземане на броя налични стаи от съответния документ в колекцията `rooms`
      const roomDocRef = doc(db, "rooms", roomType); // roomType трябва да бъде ID на документа
      const roomDoc = await getDoc(roomDocRef);

      if (!roomDoc.exists()) {
        alert("Room type does not exist.");
        return;
      }

      const availableRooms = roomDoc.data().availableRooms;
      console.log(availableRooms);

      if (numberOfReservations >= availableRooms) {
        alert("No available rooms for the selected dates.");
        return;
      }

      // Ако има налични стаи, добавяме резервацията
      await addDoc(reservationCollectionRef, {
        userId: userId,
        checkInDate: checkInTimestamp,
        checkOutDate: checkOutTimestamp,
        roomType: roomType,
        guests: guests,
      });

      navigate("/");
    } catch (err) {
      console.error("Error creating reservation: ", err.code, err.message);
      alert(`Error creating reservation: ${err.message}`);
    }
  };

  return (
    <>
      <div>
        <h2>Make a reservation</h2>
        <div>
          <label>Check-in Date</label>
          <input
            type="date"
            value={checkInDate}
            onChange={(e) => setCheckInDate(e.target.value)}
          />
        </div>
        <div>
          <label>Check-out Date</label>
          <input
            type="date"
            value={checkOutDate}
            onChange={(e) => setCheckOutDate(e.target.value)}
          />
        </div>
        <div>
          <label>Room Type</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value=""></option>
            <option value="single">Single Room</option>
            <option value="double">Double Room</option>
            <option value="apartament">Apartament</option>
          </select>
        </div>
        <div>
          <label>Guests</label>
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
          />
        </div>
        <button onClick={handleReservation}>Reserve</button>
      </div>
    </>
  );
}
