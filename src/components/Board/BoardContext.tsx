import { createContext, type Dispatch } from "react";
import type { NoteState, NotesAction } from "../../App";

export const GlobalStoreContext = createContext<Record<string, NoteState>>({});

export const NotesDispatchContext = createContext<Dispatch<NotesAction> | null>(
  null,
);
