import { useContext, useEffect, useState } from "react";
import { HotelContext } from "../../context/hotelContext";
import { NotificationContext } from "../../context/notificationContext";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import styles from "./Reviews.module.css";
import { Link } from "react-router-dom";

export default function Reviews() {
  const { userId, email } = useContext(HotelContext);
  const { addNotification } = useContext(NotificationContext);
  const [comment, setComment] = useState("");
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(db, "reviews");
      const reviewsSnapshot = await getDocs(reviewsCollection);
      const reviewsList = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      reviewsList.sort((a, b) => b.date.toDate() - a.date.toDate());
      setReviews(reviewsList);
    };

    fetchReviews();
  }, []);

  const handleAddReview = async () => {
    if (comment.trim() === "") {
      addNotification({
        severity: "error",
        message: "Comment cannot be empty.",
      });
      return;
    }

    try {
      const newReview = {
        email,
        comment,
        date: new Date(),
      };

      await addDoc(collection(db, "reviews"), newReview);
      setComment("");

      const reviewsCollection = collection(db, "reviews");
      const reviewsSnapshot = await getDocs(reviewsCollection);
      const reviewsList = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      reviewsList.sort((a, b) => b.date.toDate() - a.date.toDate());
      setReviews(reviewsList);

      addNotification({
        severity: "success",
        message: "Review added successfully!",
      });
    } catch (error) {
      addNotification({
        severity: "error",
        message: "Error adding review: " + error.message,
      });
    }
  };

  return (
    <div className={styles.reviewsContainer}>
      <h2 className={styles.heading}>Hotel Reviews</h2>
      <div className={styles.reviewsList}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <p className={styles.email}>{review.email}</p>
            <p className={styles.comment}>{review.comment}</p>
            <p className={styles.date}>
              {new Date(review.date.seconds * 1000).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
      {userId ? (
        <div className={styles.addReview}>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your review..."
            className={styles.textarea}
          />
          <button onClick={handleAddReview} className={styles.button}>
            Submit
          </button>
        </div>
      ) : (
        <p className={styles.info}>
          <Link to="/login" className={styles.loginLink}>
            Log in
          </Link>{" "}
          to add a review.
        </p>
      )}
    </div>
  );
}
