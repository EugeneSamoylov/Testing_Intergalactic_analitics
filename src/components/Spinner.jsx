import styles from "./Spinner.module.css";

export const Spinner = () => {
  return (
    <div className={styles.processingIndicator} role="status">
      <div className={styles.spinner}></div>
    </div>
  );
};
