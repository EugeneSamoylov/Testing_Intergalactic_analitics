import styles from "./Spinner.module.css";

export const Spinner = () => {
  return (
    <div className={styles.processingIndicator}>
      <div className={styles.spinner}></div>
    </div>
  );
};
