import { useCallback, useContext } from "react";
import { Note } from "../Note/Note";
import { GlobalStoreContext, NotesDispatchContext } from "./BoardContext";
import { DeleteArea } from "./DeleteArea";

const DEFAULT_X = 50;
const DEFAULT_Y = 50;
const DEFAULT_Z = 1;
const DEFAULT_WIDTH = 120;
const DEFAULT_HEIGHT = 120;

export const Board = () => {
  const notesStore = useContext(GlobalStoreContext);
  const dispatch = useContext(NotesDispatchContext);

  const addNote = useCallback(() => {
    if (!dispatch) return;
    dispatch({
      type: "ADD_NOTE",
      note: {
        id: crypto.randomUUID(),
        content: "new note content",
        xPosition: DEFAULT_X,
        yPosition: DEFAULT_Y,
        zPosition: DEFAULT_Z,
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
      },
    });
  }, [dispatch]);

  return (
    <div className="w-full h-full bg-slate-200 relative flex flex-col">
      <div className="p-2">
        <button
          onClick={addNote}
          className="bg-slate-50 text-slate-500 shadow-md hover:bg-slate-100 px-3 py-1 rounded-lg transition-all hover:shadow-lg cursor-pointer"
        >
          Add Note
        </button>
      </div>
      <div className="grow">
        {Object.keys(notesStore).map((noteId) => {
          return <Note key={noteId} note={notesStore[noteId]} />;
        })}
      </div>
      <DeleteArea />
    </div>
  );
};
