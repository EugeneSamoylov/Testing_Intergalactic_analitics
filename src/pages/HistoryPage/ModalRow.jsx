import styles from "./ModalRow.module.css";

export const ModalRow = ({ data, naming }) => {
  return (
    <div className={styles.row}>
      <div className={styles.data} data-testid="modal-data">{data}</div>
      <div className={styles.naming} data-testid="modal-naming">{naming}</div>
    </div>
  );
};
