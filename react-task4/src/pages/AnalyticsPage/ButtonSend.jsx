import styles from "./ButtonSend.module.css";

export const ButtonSend = ({
  state,
  sendSetState,
  setUploadState,
  onClick,
}) => {
  return (
    <button
      className={
        state === "success"
          ? `${styles.buttonSend} ${styles.success}`
          : styles.buttonSend
      }
      onClick={() => {
        if(state!=='success') return;
        setUploadState("parsing");
        onClick();
      }}
    >
      Отправить
    </button>
  );
};
