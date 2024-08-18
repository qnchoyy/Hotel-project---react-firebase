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
import { NotificationContext } from "../../context/notificationContext";

import styles from "./Reservation.module.css";

export default function Reservation() {
  const { userId } = useContext(HotelContext);
  const { addNotification } = useContext(NotificationContext);
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
      addNotification({
        severity: "error",
        message: "You must be logged in.",
      });
      navigate("/login");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      addNotification({
        severity: "error",
        message: "Please select both check-in and check-out dates.",
      });
      return;
    }

    if (guests <= 0) {
      addNotification({
        severity: "error",
        message: "Number of guests must be at least 1.",
      });
      return;
    }

    if (!roomType) {
      addNotification({
        severity: "error",
        message: "Please select a room type.",
      });
      return;
    }

    const checkInTimestamp = Timestamp.fromDate(new Date(checkInDate));
    const checkOutTimestamp = Timestamp.fromDate(new Date(checkOutDate));

    if (checkOutTimestamp <= checkInTimestamp) {
      addNotification({
        severity: "error",
        message: "Check-out date must be later than check-in date.",
      });
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
        addNotification({
          severity: "error",
          message: "No available rooms for the selected dates.",
        });
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

      addNotification({
        severity: "success",
        message: `Reservation confirmed!`,
      });
      navigate("/reservation-confirmation");
    } catch (err) {
      console.error("Error creating reservation: ", err.code, err.message);
      addNotification({
        severity: "error",
        message: `Creating reservation: ${err.message}`,
      });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Make a reservation</h2>
      <div className={styles.formGroup}>
        <label className={styles.label}>Check-in Date</label>
        <input
          type="date"
          className={styles.input}
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Check-out Date</label>
        <input
          type="date"
          className={styles.input}
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Room Type</label>
        <select
          value={roomType}
          className={styles.select}
          onChange={(e) => setRoomType(e.target.value)}
        >
          <option value=""></option>
          <option value="single">Single Room</option>
          <option value="double">Double Room</option>
          <option value="apartament">Apartament</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label className={styles.label}>Guests</label>
        <input
          type="number"
          className={styles.input}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
        />
      </div>
      <button className={styles.button} onClick={handleReservation}>
        Reserve
      </button>
    </div>
  );
}
