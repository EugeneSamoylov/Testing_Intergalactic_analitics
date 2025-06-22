import styles from "./ListHighlights.module.css";
import { Highlight } from "./Highlight";

export const ListHighlights = ({ dataArray }) => {
  return (
    <div className={styles.list}>
      {dataArray.map((item, index) => (
        <Highlight key={index} data={item.data} naming={item.naming} />
      ))}
    </div>
  );
};
