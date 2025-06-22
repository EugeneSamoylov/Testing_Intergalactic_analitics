import styles from "./ButtonGenerateMore.module.css";

import { useNavigate } from "react-router-dom";

export const ButtonGenerateMore = () => {
  const navigate = useNavigate();

  return (
    <button className={styles.button} onClick={() => navigate('/generator')}>
      <div className={styles.text}>Сгенерировать больше</div>
    </button>
  );
};
