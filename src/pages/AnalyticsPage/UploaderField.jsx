import { useCallback, useState } from "react";
import { ButtonUpload } from "./ButtonUpload.jsx";
import styles from "./UploaderField.module.css";
import { CloseButton } from "../../components/CloseButton.jsx";
import { isFileValid } from "../../validation/isFileValid.js";
import { Spinner } from "../../components/Spinner.jsx";

export const UploaderField = ({
  onFileSelect,
  onDragStateChange,
  state,
  //   sendSetState,
  fileName,
  setFileName,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  //   const [fileName, setFileName] = useState("");

  const handleFileChange = useCallback(
    (file) => {
      const isValid = isFileValid(file);

      onFileSelect(file, isValid);
    },
    [onFileSelect]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isDragging) {
      setIsDragging(true);
      onDragStateChange("dragging");
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onDragStateChange("idle");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    setFileName(files[0].name);
    if (files.length > 0) {
      handleFileChange(files[0]);
    } else {
      onDragStateChange("error");
    }
  };

  const getFieldClasses = () => {
    const classes = [styles.uploaderField];

    switch (state) {
      case "dragging":
        classes.push(styles.dragging);
        break;
      case "success":
        classes.push(styles.success);
        break;
      case "error":
        classes.push(styles.error);
        break;
      default:
        classes.push(styles.idle);
    }

    return classes.join(" ");
  };

  const handleReset = () => {
    onDragStateChange("idle");
    // sendSetState(true);
  };

  return (
    <div
      className={getFieldClasses()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {(state === "idle" || state === "dragging") && (
        <ButtonUpload
          onFileSelect={handleFileChange}
          setFileName={setFileName}
        />
      )}

      {state === "success" && (
        <div className={styles.doneContainer}>
          <div className={styles.doneText}>{fileName}</div>
          <CloseButton onClick={handleReset} />
        </div>
      )}

      {/*нужно доделать*/}
      {state === "done" && (
        <div className={styles.doneContainer}>
          <div className={styles.doneText}>{fileName}</div>
          <CloseButton onClick={handleReset} />
        </div>
      )}

      {state === "error" && (
        <div className={styles.errorContainer}>
          <div className={styles.errorText}>{fileName}</div>
          <CloseButton onClick={handleReset} />
        </div>
      )}

      {state === "parsing" && <Spinner />}

      <div className={styles.text}>
        {(state === "idle" || state === "dragging") && "или перетащите сюда"}
        {state === "success" && "файл загружен!"}
        {state === "parsing" && "идет парсинг файла"}
        {state === "done" && "готово!"}
        {state === "error" && <div className={styles.yps}>упс, не то...</div>}
      </div>
    </div>
  );
};
