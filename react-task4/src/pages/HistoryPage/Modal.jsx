import styles from "./Modal.module.css";
import { CloseButton } from "../../components/CloseButton.jsx";
import { ModalRow } from "./ModalRow.jsx";
import { createPortal } from "react-dom";

export const Modal = ({ isOpen, onClose, dataArray }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.container}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          {dataArray.map((item, index) => (
            <ModalRow key={index} data={item.data} naming={item.naming} />
          ))}
        </div>
        <CloseButton onClick={onClose} />
      </div>
    </div>,
    document.body
  );
};
