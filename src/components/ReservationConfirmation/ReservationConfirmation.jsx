import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./ReservationConfirmation.module.css";

export default function ReservationConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  const reservationDetails = location.state?.reservationDetails;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 8000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Reservation Confirmed!</h2>
      <p className={styles.message}>
        Your reservation has been successfully made. Thank you!
      </p>

      {reservationDetails && (
        <div className={styles.details}>
          <h3>Reservation Details:</h3>
          <p>Room Type: {reservationDetails.roomType}</p>
          <p>Check-in Date: {reservationDetails.checkInDate}</p>
          <p>Check-out Date: {reservationDetails.checkOutDate}</p>
          <p>Guests: {reservationDetails.guests}</p>
          <p>Total Price: ${reservationDetails.price}</p>
        </div>
      )}

      <p className={styles.redirectMessage}>
        You will be redirected to the homepage shortly.
      </p>
      <button className={styles.button} onClick={() => navigate("/")}>
        Go to Homepage
      </button>
      <button
        className={styles.button}
        onClick={() => navigate("/my-reservations")}
      >
        View My Reservations
      </button>
    </div>
  );
}
