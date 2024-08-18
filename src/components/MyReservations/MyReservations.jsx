import { useContext, useEffect, useState } from "react";
import { HotelContext } from "../../context/hotelContext";

import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

import styles from "./MyReservations.module.css";

export default function MyReservations() {
  const { userId } = useContext(HotelContext);
  const [reservations, setReseravtions] = useState("");

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
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noReservations}>You have no reservations.</p>
      )}
    </div>
  );
}
