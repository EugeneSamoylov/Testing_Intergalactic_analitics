import { NavLink } from "react-router-dom";

import styles from "./Header.module.css";
import logoPng from "../assets/Logo SS.png";
import uploadPng from "../assets/mage_upload.png";
import generatorPng from "../assets/oui_ml-create-multi-metric-job.png";
import historyPng from "../assets/solar_history-linear.png";

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.containerLeft}>
        <img src={logoPng} alt="Логотип"></img>
        <div className={styles.naming}>Межгалактическая Аналитика</div>
      </div>
      <div className={styles.containerRight}>
        <div>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.anal} ${styles.active}` : styles.anal
            }
          >
            <img src={uploadPng} alt="Аналитика" />
            CSV Аналитик
          </NavLink>
        </div>
        <div>
          <NavLink
            to="/generator"
            className={({ isActive }) =>
              isActive ? `${styles.gen} ${styles.active}` : styles.gen
            }
          >
            <img src={generatorPng} alt="Генератор" />
            CSV Генератор
          </NavLink>
        </div>
        <div>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive ? `${styles.history} ${styles.active}` : styles.history
            }
          >
            <img src={historyPng} alt="История" />
            История
          </NavLink>
        </div>
      </div>
    </header>
  );
};
