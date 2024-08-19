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
  const [roomPrice, setRoomPrice] = useState(null);

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

  const fetchRoomPrice = async (selectedRoomType) => {
    try {
      const roomDocRef = doc(db, "rooms", selectedRoomType);
      const roomDoc = await getDoc(roomDocRef);
      if (roomDoc.exists()) {
        console.log("Room document data:", roomDoc.data());
        console.log("Room price:", roomDoc.data().price);
        setRoomPrice(roomDoc.data().price);
      } else {
        console.error("No such document!");
        setRoomPrice(null);
      }
    } catch (error) {
      console.error("Error fetching room price:", error);
      addNotification({
        severity: "error",
        message: `Error fetching room price: ${error.message}`,
      });
    }
  };

  const handleGuestsChange = (e) => {
    const selectedGuests = Number(e.target.value);

    let maxGuests = 1;
    if (roomType === "double") {
      maxGuests = 2;
    } else if (roomType === "apartament") {
      maxGuests = 4;
    }

    if (selectedGuests > maxGuests) {
      addNotification({
        severity: "error",
        message: `The selected room type allows a maximum of ${maxGuests} guest(s).`,
      });
      setGuests(maxGuests);
    } else {
      setGuests(selectedGuests);
    }
  };

  const handleRoomTypeChange = (e) => {
    const selectedRoomType = e.target.value;
    setRoomType(selectedRoomType);
    fetchRoomPrice(selectedRoomType);

    let defaultGuests = 1;
    if (selectedRoomType === "double") {
      defaultGuests = guests > 2 ? 2 : guests;
    } else if (selectedRoomType === "apartament") {
      defaultGuests = guests > 4 ? 4 : guests;
    }

    setGuests(defaultGuests);
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

    if (checkInDate === checkOutDate) {
      addNotification({
        severity: "error",
        message: "Check-in date and check-out date cannot be the same.",
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

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(checkInDate) < today) {
      addNotification({
        severity: "error",
        message: "Check-in date cannot be in the past.",
      });
      return;
    }

    if (new Date(checkOutDate) <= today) {
      addNotification({
        severity: "error",
        message: "Check-out date must be later than today.",
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
          onChange={handleRoomTypeChange}
        >
          <option value=""></option>
          <option value="single">Single Room</option>
          <option value="double">Double Room</option>
          <option value="apartament">Apartament</option>
        </select>
      </div>
      {roomPrice && (
        <div className={styles.formGroup}>
          <label className={styles.label}>Price per night: ${roomPrice}</label>
        </div>
      )}
      <div className={styles.formGroup}>
        <label className={styles.label}>Guests</label>
        <input
          type="number"
          className={styles.input}
          value={guests}
          onChange={handleGuestsChange}
        />
      </div>
      <button className={styles.button} onClick={handleReservation}>
        Reserve
      </button>
    </div>
  );
}
