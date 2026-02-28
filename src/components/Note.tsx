import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BoardContext } from "./Board/BoardContext";
import type { NoteState } from "../App";

const useNoteState = (id: string) => {
  const { notesStore, updateStore } = useContext(BoardContext);

  const note = notesStore[id];

  return { note, updateStore };
};

export const Note = ({ id }: { id: string }) => {
  const { note, updateStore } = useNoteState(id);

  const dragRef = useRef<{ noteId: string; xOffset: number; yOffset: number }>(
    null,
  );

  // for storing id of requestAnimationFrame - so we can cancel scheduled update on unmount.
  const rafRef = useRef<number | null>(null);

  const updateNotePosition = ({
    clientX,
    clientY,
  }: {
    clientX: number;
    clientY: number;
  }) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (!updateStore) return;

    const newX = clientX + drag.xOffset;
    const newY = clientY + drag.yOffset;

    updateStore({
      type: "UPDATE_NOTE",
      note: {
        ...note,
        xPosition: newX,
        yPosition: newY,
      },
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    // store which note was grabbed, and from where (offset)
    dragRef.current = {
      noteId: id,
      xOffset: note.xPosition - e.clientX,
      yOffset: note.yPosition - e.clientY,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const drag = dragRef.current;
      if (!drag) return;

      if (rafRef.current !== null) return;

      rafRef.current = requestAnimationFrame(() => {
        updateNotePosition({ clientX: e.clientX, clientY: e.clientY });
        rafRef.current = null; // scheduled update complete
      });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // cancel scheduled note position update if component is unmounted.
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  if (!note) return null;

  return (
    <div
      className="p-2 shadow-lg border-slate-400 rounded-xl bg-yellow-200 w-[100px] h-[100px] transform"
      style={{
        transform: `translate(${note.xPosition}px, ${note.yPosition}px)`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="text-sm text-black">{note.content}</div>
    </div>
  );
};
