import styles from "./ButtonClear.module.css";

export const ButtonClear = ({ setNotes }) => {
  return (
    <button
      className={styles.button}
      onClick={() => {
        setNotes([]);
        localStorage.clear();
      }}
    >
      <div className={styles.text}>Очистить всё</div>
    </button>
  );
};
