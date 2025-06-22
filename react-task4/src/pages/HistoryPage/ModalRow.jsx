import styles from "./ModalRow.module.css";

export const ModalRow = ({ data, naming }) => {
  return (
    <div className={styles.row}>
      <div className={styles.data}>{data}</div>
      <div className={styles.naming}>{naming}</div>
    </div>
  );
};
