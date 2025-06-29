import styles from "./AnalyticsPage.module.css";
import { useRef, useState } from "react";
import { UploaderField } from "./UploaderField.jsx";
import { ButtonSend } from "./ButtonSend.jsx";
import { ListHighlights } from "./ListHighlights.jsx";
import { arrayFromData } from "../../utils/dataPreparation.js";
import { uploadFile } from "../../api/fileUploader.js";
import { formateDate } from "../../utils/formateData.js";



export const AnalyticsPage = () => {
  const [file, setFile] = useState(null);
  const [uploadState, setUploadState] = useState("idle");

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
      setAnalyticsData(null);
      setFile(null);
      setFileName("");
      analyticsDataRef.current = null; 
    }
    setUploadState(state);
  };

  const handlePartialData = (partialData) => {
    const newData = { ...analyticsDataRef.current, ...partialData };
    analyticsDataRef.current = newData;
    setAnalyticsData(newData);
  };

  const handleSendFile = async () => {
    if (!file) return;

    setUploadState("parsing");
    setAnalyticsData(null); 

    analyticsDataRef.current = {};

    try {
      await uploadFile(
        file,
        handlePartialData,
        () => {
          setUploadState("done");
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
        data: data,
      };

      const updatedHistory = [newEntry, ...history];

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
          fileName={fileName} 
          setFileName={setFileName} 
        />
        {uploadState !== "error" &&
          uploadState !== "parsing" &&
          uploadState !== "done" && ( 
            <ButtonSend
              hasFile={uploadState === "success"}
              state={uploadState}
              setUploadState={setUploadState}
              onClick={handleSendFile}
            />
          )}
      </div>

      {!analyticsData && uploadState !== "error" && (
        <div className={styles.highlights}>
          Здесь <br />
          появятся хайлайты
        </div>
      )}

      {!!analyticsData && (
        <ListHighlights dataArray={arrayFromData(analyticsData)} />
      )}
    </div>
  );
};
