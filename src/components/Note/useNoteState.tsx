import { useContext } from "react";
import { BoardContext } from "../Board/BoardContext";

export const useNoteState = (id: string) => {
  const { notesStore, updateStore } = useContext(BoardContext);

  const note = notesStore[id];

  return { note, updateStore };
};
