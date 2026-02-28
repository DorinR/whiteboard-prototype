import { createContext, type Dispatch } from "react";
import type { NoteState, NotesAction } from "../../App";

export const BoardContext = createContext<{
  notesStore: Record<string, NoteState>;
  updateStore: Dispatch<NotesAction> | null;
}>({ notesStore: {}, updateStore: null });
