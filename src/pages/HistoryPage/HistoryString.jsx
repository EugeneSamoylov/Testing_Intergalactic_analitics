import styles from "./HistoryString.module.css";

import akar from "../../assets/akar-icons_file.png";
import smile from "../../assets/Smile.png";
import sad from "../../assets/ph_smiley-sad.png";
import trash from "../../assets/Trash.png";
import { useState } from "react";
import { Modal } from "./Modal";

export const HistoryString = (props) => {
  const { name, date, status, error, onDelete, data } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className={styles.container} onClick={() => setIsModalOpen(true)}>
        <div className={styles.info}>
          <div className={styles.name}>
            <img className={styles.img} src={akar} alt="file"></img>
            {name}
          </div>
          <div className={styles.date}>{date}</div>
          <div
            className={
              status ? styles.status : `${styles.status} ${styles.transparent}`
            }
          >
            Обработан успешно
            <img src={smile} alt="smile"></img>
          </div>
          <div
            className={
              error ? styles.error : `${styles.error} ${styles.transparent}`
            }
          >
            Не удалось обработать
            <img src={sad} alt="sad-smile"></img>
          </div>
        </div>
        <button
          className={styles.trashContainer}
          onClick={onDelete}
          title="Удалить"
          aria-label="Удалить"
        >
          <img className={styles.trashImg} src={trash} alt="trash"></img>
        </button>
      </div>
      {!error && <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dataArray={data}
      />}
    </>
  );
};
