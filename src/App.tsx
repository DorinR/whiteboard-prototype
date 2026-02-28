import { useReducer } from "react";
import "./App.css";
import { Board } from "./components/Board/Board";
import {
  GlobalStoreContext,
  NotesDispatchContext,
} from "./components/Board/BoardContext";

export type NoteState = {
  id: string;
  content: string;
  xPosition: number;
  yPosition: number;
  zPosition: number;
  width: number;
  height: number;
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
    <NotesDispatchContext.Provider value={dispatch}>
      <GlobalStoreContext.Provider value={state}>
        <Board />
      </GlobalStoreContext.Provider>
    </NotesDispatchContext.Provider>
  );
}

export default App;
