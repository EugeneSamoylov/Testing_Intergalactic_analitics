import { useRef } from "react";
import styles from "./ButtonUpload.module.css";

export const ButtonUpload = ({ onFileSelect, setFileName }) => {

  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelect(file);
    } else {
      setFileName("");
    }
  };

  return (
    <div className={styles.buttonUpload}>
      <button className={styles.button} onClick={handleButtonClick}>
        Загрузить файл
      </button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
    </div>
  );
};
