import styles from "./Modal.module.css";
import { CloseButton } from "../../components/CloseButton.jsx";
import { ModalRow } from "./ModalRow.jsx";
import { createPortal } from "react-dom";

export const Modal = ({ isOpen, onClose, dataArray }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={onClose}
      data-testid="modal-overlay"
    >
      <div className={styles.container}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
          data-testid="modal-content"
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
