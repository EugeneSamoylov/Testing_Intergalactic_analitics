import styles from "./CloseButton.module.css";

import krestik from "../assets/proicons_cancel.png";

export const CloseButton = ({ onClick }) => {
    return (
        <button className={styles.button} onClick={onClick} aria-label="Close">
            <img src={krestik} alt="крестик" />
        </button>
    )
}