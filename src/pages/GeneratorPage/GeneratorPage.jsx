import styles from "./GeneratorPage.module.css";
import { useState } from "react";
import { ButtonGenerate } from "./ButtonGenerate";
import { downloadFile } from "../../utils/fileDownload";
import { generateCSV } from "../../api/csvGenerator";
import { CloseButton } from "../../components/CloseButton";
import { Spinner } from "../../components/Spinner";

const GENERATOR_STATES = {
  IDLE: "idle", // Начальное состояние
  PROCESSING: "processing", // Генерация в процессе
  SUCCESS: "success", // Успешная генерация
  ERROR: "error", // Ошибка генерации
};

const SIZE_OF_GENERATOR = 0.1;


export const GeneratorPage = () => {
  const [state, setState] = useState(GENERATOR_STATES.IDLE);

  const handleGenerate = async () => {
    setState(GENERATOR_STATES.PROCESSING);

    try {
      // 1. Запрашиваем CSV с бэкенда
      const response = await generateCSV(SIZE_OF_GENERATOR, "off", "1000");

      // 2. Получаем данные в виде Blob
      const blob = await response.blob();

      // 3. Скачиваем файл
      downloadFile(blob, "galaxy_data.csv");

      // 4. Переходим в состояние успеха
      setState(GENERATOR_STATES.SUCCESS);
    } catch (error) {
      console.error("Ошибка генерации:", error);
      setState(GENERATOR_STATES.ERROR);
    }
  };

  const handleReset = () => {
    setState(GENERATOR_STATES.IDLE);
  };

  return (
    <div className={styles.container}>
      <div className={styles.text}>
        Сгенерируйте готовый csv-файл нажатием одной кнопки
      </div>

      {state === GENERATOR_STATES.IDLE && (
        <ButtonGenerate onClick={handleGenerate} />
      )}

      {state === GENERATOR_STATES.PROCESSING && (
        <Spinner />
      )}

      {state === GENERATOR_STATES.SUCCESS && (
        <div className={styles.doneContainer}>
          <div className={styles.doneText}>Done!</div>
          <CloseButton onClick={handleReset} />
        </div>
      )}

      {state === GENERATOR_STATES.ERROR && (
        <div className={styles.errorContainer}>
          <div className={styles.errorText}>Ошибка</div>
          <CloseButton onClick={handleReset} />
        </div>
      )}

      <div className={styles.text}>
        {state === GENERATOR_STATES.PROCESSING && "идёт процесс генерации"}

        {state === GENERATOR_STATES.SUCCESS && "файл сгенерирован!"}

        {state === GENERATOR_STATES.ERROR && (
          <div className={styles.yps}>упс, не то...</div>
          )
        }
      </div>
    </div>
  );
};
