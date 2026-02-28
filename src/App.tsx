import "./App.css";
import { BoardContext } from "./components/Board/BoardContext";
import { Board } from "./components/Board/Board";
import { useReducer } from "react";

export type NoteState = {
  id: string;
  content: string;
  xPosition: number;
  yPosition: number;
  zPosition: number;
};

export type NotesAction = {
  type: "ADD_NOTE" | "UPDATE_NOTE" | "REMOVE_NOTE";
  note: NoteState;
};

const notesReducer = (
  state: Record<string, NoteState>,
  action: NotesAction,
): Record<string, NoteState> => {
  switch (action.type) {
    case "ADD_NOTE":
      return { ...state, [action.note.id]: action.note };
    case "UPDATE_NOTE":
      return { ...state, [action.note.id]: action.note };
    case "REMOVE_NOTE": {
      const updateStateEntries = Object.entries(state).filter(
        (note) => note[0] !== action.note.id,
      );

      return Object.fromEntries(updateStateEntries);
    }
  }
};

function App() {
  const [state, dispatch] = useReducer(notesReducer, {});

  return (
    <BoardContext.Provider value={{ notesStore: state, updateStore: dispatch }}>
      <Board />
    </BoardContext.Provider>
  );
}

export default App;
