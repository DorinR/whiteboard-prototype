import { useCallback, useContext } from "react";
import { BoardContext } from "./BoardContext";
import { Note } from "../Note";

const DEFAULT_X = 50;
const DEFAULT_Y = 50;
const DEFAULT_Z = 1;

export const Board = () => {
  const { notesStore, updateStore } = useContext(BoardContext);

  const addNote = useCallback(() => {
    if (!updateStore) return;
    updateStore({
      type: "ADD_NOTE",
      note: {
        id: crypto.randomUUID(),
        content: "new note content",
        xPosition: DEFAULT_X,
        yPosition: DEFAULT_Y,
        zPosition: DEFAULT_Z,
      },
    });
  }, [updateStore]);

  return (
    <div className="w-full h-full bg-slate-200 relative flex-col">
      <div className="p-2">
        <button
          onClick={addNote}
          className="bg-slate-50 text-slate-500 shadow-md hover:bg-slate-100 px-3 py-1 rounded-lg transition-all hover:shadow-lg cursor-pointer"
        >
          Add Note
        </button>
      </div>
      <div>
        {Object.keys(notesStore).map((noteId) => {
          return <Note key={noteId} id={noteId} />;
        })}
      </div>
    </div>
  );
};
