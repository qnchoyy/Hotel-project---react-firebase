import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      {/* <div className={styles.container}>
        <div className={styles.socialSection}>
          <p className={styles.followUs}>Follow Us:</p>
          <div className={styles.socialIcons}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/59/59439.png"
              alt="Facebook"
              className={styles.icon}
            />
            <img
              src="https://cdn-icons-png.flaticon.com/512/87/87390.png"
              alt="Instagram"
              className={styles.icon}
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/X_logo_2023_original.svg"
              alt="Twitter"
              className={styles.icon}
            />
          </div>
        </div>
      </div> */}
      <div className={styles.copySection}>
        <p>© 2024 Luxury Retreat. All rights reserved.</p>
      </div>
    </footer>
  );
}
