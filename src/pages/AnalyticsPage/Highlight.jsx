import styles from "./Highlight.module.css";

export const Highlight = ({ data, naming }) => {
  return (
    <div className={styles.highlight}>
      <div className={styles.data}>{data}</div>
      <div className={styles.naming}>{naming}</div>
    </div>
  );
};
