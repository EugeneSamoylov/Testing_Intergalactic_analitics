import { ButtonSend } from "./ButtonSend";
import styles from "./LoaderContainer.module.css";
import { UploaderField } from "../../components/UploaderField";

export const LoaderContainer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.text}>
        Загрузите <span>csv</span> файл и получите{" "}
        <span>полную информацию</span> о нём за сверхнизкое время
      </div>
      <UploaderField />
      <ButtonSend />
    </div>
  );
};
