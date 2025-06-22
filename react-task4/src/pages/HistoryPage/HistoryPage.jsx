import styles from "./HistoryPage.module.css";
import { ButtonGenerateMore } from "./ButtonGenerateMore.jsx";
import { ButtonClear } from "./ButtonClear.jsx";
import { NotesList } from "./NotesList.jsx";
import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "analyticsHistory";

export const HistoryPage = () => {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem(LOCAL_STORAGE_KEY);

    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  return (
    <div className={styles.container}>
      <NotesList notes={notes} setNotes={setNotes} />
      <div className={styles.buttons}>
        <ButtonGenerateMore />
        {Boolean(notes.length) && <ButtonClear setNotes={setNotes} />}
      </div>
    </div>
  );
};
