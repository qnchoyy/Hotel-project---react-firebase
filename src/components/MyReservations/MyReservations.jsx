import { useContext, useEffect, useState } from "react";
import { HotelContext } from "../../context/hotelContext";
import { NotificationContext } from "../../context/notificationContext";

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

import * as React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Stack from "@mui/material/Stack";
import styles from "./MyReservations.module.css";

export default function MyReservations() {
  const { userId } = useContext(HotelContext);
  const { addNotification } = useContext(NotificationContext);
  const [reservations, setReseravtions] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      if (userId) {
        const reservationsRef = collection(db, "reservations");
        const q = query(reservationsRef, where("userId", "==", userId));

        const querySnapshot = await getDocs(q);
        const userReservations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReseravtions(userReservations);
      }
    };

    fetchReservations();
  }, [userId]);

  const handleDelete = async (reservationId) => {
    if (window.confirm("Are you sure you want to delete this reservation?")) {
      try {
        const reservationToDelete = reservations.find(
          (res) => res.id === reservationId
        );

        let currentDate = reservationToDelete.checkInDate.toDate();

        while (currentDate <= reservationToDelete.checkOutDate.toDate()) {
          const formattedDate = currentDate.toISOString().split("T")[0];
          const availabilityDocRef = doc(
            db,
            "rooms",
            reservationToDelete.roomType,
            "availability",
            formattedDate
          );

          const availabilityDoc = await getDoc(availabilityDocRef);
          if (availabilityDoc.exists()) {
            const currentAvailableRooms = availabilityDoc.data().availableRooms;
            await updateDoc(availabilityDocRef, {
              availableRooms: currentAvailableRooms + 1,
            });
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        await deleteDoc(doc(db, "reservations", reservationId));
        setReseravtions((prevReservations) =>
          prevReservations.filter((res) => res.id !== reservationId)
        );
        addNotification({
          severity: "success",
          message: "Reservation deleted!",
        });
      } catch (error) {
        console.error("Error deleting reservation: ", error);
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>My Reservations</h2>
      {reservations.length > 0 ? (
        <ul className={styles.reservationList}>
          {reservations.map((reservation) => (
            <li key={reservation.id} className={styles.reservationItem}>
              <p>Room Type: {reservation.roomType}</p>
              <p>Check-in: {reservation.checkInDate.toDate().toDateString()}</p>
              <p>
                Check-out: {reservation.checkOutDate.toDate().toDateString()}
              </p>
              <p>Guests: {reservation.guests}</p>
              <p>Price: {reservation.price}$</p>
              <Stack direction="row" spacing={1}>
                <IconButton
                  aria-label="delete"
                  size="large"
                  onClick={() => handleDelete(reservation.id)}
                  className={styles.deleteIcon}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noReservations}>You have no reservations.</p>
      )}
    </div>
  );
}
