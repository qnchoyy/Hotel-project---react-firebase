import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { db } from "../../config/firebase";
import {
  addDoc,
  collection,
  Timestamp,
  getDoc,
  doc,
  updateDoc,
  setDoc,
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

  // Функция за проверка и създаване на документ за наличност
  const checkAndCreateAvailability = async (roomType, date) => {
    const availabilityDocRef = doc(db, "rooms", roomType, "availability", date);

    const availabilityDoc = await getDoc(availabilityDocRef);

    if (!availabilityDoc.exists()) {
      await setDoc(availabilityDocRef, {
        availableRooms: 10, // Можеш да зададеш начален брой налични стаи тук
      });
    }
  };

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
      let allDaysAvailable = true;

      for (
        let day = new Date(checkInTimestamp.toDate());
        day <= checkOutTimestamp.toDate();
        day.setDate(day.getDate() + 1)
      ) {
        const dayFormatted = day.toISOString().split("T")[0];

        await checkAndCreateAvailability(roomType, dayFormatted);

        const availabilityDocRef = doc(
          db,
          "rooms",
          roomType,
          "availability",
          dayFormatted
        );

        const availabilityDoc = await getDoc(availabilityDocRef);

        if (availabilityDoc.data().availableRooms <= 0) {
          allDaysAvailable = false;
          break;
        }
      }

      if (!allDaysAvailable) {
        alert("No available rooms for the selected dates.");
        return;
      }

      // Добавяне на резервация
      await addDoc(reservationCollectionRef, {
        userId: userId,
        checkInDate: checkInTimestamp,
        checkOutDate: checkOutTimestamp,
        roomType: roomType,
        guests: guests,
      });

      // Намаляване на броя на наличните стаи за всяка дата
      for (
        let day = new Date(checkInTimestamp.toDate());
        day <= checkOutTimestamp.toDate();
        day.setDate(day.getDate() + 1)
      ) {
        const dayFormatted = day.toISOString().split("T")[0];

        const availabilityDocRef = doc(
          db,
          "rooms",
          roomType,
          "availability",
          dayFormatted
        );

        const availabilityDoc = await getDoc(availabilityDocRef);

        await updateDoc(availabilityDocRef, {
          availableRooms: availabilityDoc.data().availableRooms - 1,
        });
      }

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
