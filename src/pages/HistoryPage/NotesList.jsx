import { HistoryString } from "./HistoryString";
import styles from "./NotesList.module.css";

export const NotesList = ({ notes, setNotes }) => {
  return (
    <div className={styles.history}>
      {notes.map((note) => {
        return (
          <HistoryString
            name={note.filename}
            date={note.date}
            status={!!note.data.length}
            error={!note.data.length}
            key={note.id}
            onDelete={() => {
              setNotes(
                notes.filter((currentNote) => currentNote.id !== note.id)
              );
            }}
            data={note.data}
          />
        );
      })}
    </div>
  );
};
