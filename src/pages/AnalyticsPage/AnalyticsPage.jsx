// src/pages/AnalyticsPage.jsx
import styles from "./AnalyticsPage.module.css";
import { useRef, useState } from "react";
import { UploaderField } from "./UploaderField.jsx";
import { ButtonSend } from "./ButtonSend.jsx";
import { ListHighlights } from "./ListHighlights.jsx";
import { arrayFromData } from "../../utils/dataPreparation.js";
import { uploadFile } from "../../api/fileUploader.js";
import { formateDate } from "../../utils/formateData.js";

// const json = {
//   total_spend_galactic: 999.8,
//   rows_affected: 45056,
//   less_spent_at: 0,
//   big_spent_at: 364,
//   big_spent_value: 678899,
//   average_spend_galactic: 876,
//   big_spent_civ: "humans",
//   less_spent_civ: "blobs",
// };

export const AnalyticsPage = () => {
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState("idle"); // idle, dragging, error, success, parsing?, done
  // const [sendState, setSendState] = useState(true); // true, false //не знаю пока нужно ли

  const [analyticsData, setAnalyticsData] = useState(null);
  const [fileName, setFileName] = useState("");

  const analyticsDataRef = useRef(null);

  const handleFileSelect = (selectedFile, isValid) => {
    setUploadState(isValid ? "success" : "error");
    if (isValid) {
      setFile(selectedFile);

      setFileName(selectedFile.name); //new
    }
  };

  const handleDragStateChange = (state) => {
    if (state === "idle") {
      // new Сброс состояния при клике на крестик
      setAnalyticsData(null);
      setFile(null);
      setFileName("");
      analyticsDataRef.current = null; // Сбрасываем реф тоже
    }
    setUploadState(state);
  };

  // Новая функция для отправки файла
  // const handleSendFile = async () => {
  //   if (!file) return;

  //   setUploadState("parsing");

  //   try {
  //     console.log("Starting file upload...", file.name);
  //     const response = await uploadFile(file);
  //     console.log("Server response:", response);

  //     // Пока просто выводим в консоль
  //     console.log("File processed successfully!");
  //     setUploadState("done");
  //   } catch (error) {
  //     console.error("Error processing file:", error);
  //     setUploadState("error");
  //   }
  // };

  const handlePartialData = (partialData) => {
    // Обновляем и состояние, и реф
    const newData = { ...analyticsDataRef.current, ...partialData };
    analyticsDataRef.current = newData;
    setAnalyticsData(newData);
  };

  const handleSendFile = async () => {
    if (!file) return;

    setUploadState("parsing");
    setAnalyticsData(null); // Сброс предыдущих данных

    analyticsDataRef.current = {};

    try {
      await uploadFile(
        file,
        handlePartialData,
        () => {
          // Завершение обработки
          setUploadState("done");
          // saveToLocalStorage(fileName, analyticsDataRef.current);
          saveToLocalStorage(fileName, arrayFromData(analyticsDataRef.current));
        },
        (error) => {
          console.error("Error processing file:", error);
          setUploadState("error");
          saveToLocalStorage(fileName, []);
        }
      );
    } catch (error) {
      console.error("Error in uploadFile:", error);
      setUploadState("error");
    }
  };

  // Сохранение результатов в localStorage
  const saveToLocalStorage = (filename, data) => {
    if (!data) {
      console.warn("No data to save");
      return;
    }

    try {
      const history = JSON.parse(
        localStorage.getItem("analyticsHistory") || "[]"
      );

      const newEntry = {
        id: Date.now(),
        filename,
        date: formateDate(new Date()),
        // data: JSON.parse(JSON.stringify(data)),
        data: data,
      };

      const updatedHistory = [newEntry, ...history];

      // Сохраняем только последние 10 записей
      const trimmedHistory = updatedHistory.slice(0, 10);

      localStorage.setItem("analyticsHistory", JSON.stringify(trimmedHistory));
      console.log("Saved to history:", newEntry);
    } catch (error) {
      console.error("Failed to save history:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loaderContainer}>
        <div className={styles.text}>
          Загрузите <span>csv</span> файл и получите{" "}
          <span>полную информацию</span> о нём за сверхнизкое время
        </div>
        <UploaderField
          onFileSelect={handleFileSelect}
          onDragStateChange={handleDragStateChange}
          setUploadState={setUploadState}
          state={uploadState}
          fileName={fileName} //new
          setFileName={setFileName} //new

          // sendState={sendState}
        />
        {uploadState !== "error" &&
          uploadState !== "parsing" &&
          uploadState !== "done" && ( //new
            <ButtonSend
              // disabled={uploadState !== "success" && uploadState==='idle'}
              hasFile={uploadState === "success"}
              state={uploadState}
              // sendSetState={setSendState}
              setUploadState={setUploadState}
              onClick={handleSendFile}
            />
          )}
      </div>

      {/* {!json */}
      {!analyticsData && uploadState !== "error" && (
        <div className={styles.highlights}>
          Здесь <br />
          появятся хайлайты
        </div>
      )}

      {/* {!!json */}
      {!!analyticsData && (
        <ListHighlights dataArray={arrayFromData(analyticsData)} />
      )}
    </div>
  );
};
