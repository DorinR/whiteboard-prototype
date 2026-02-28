import { memo, useCallback, useContext, useEffect, useRef } from "react";
import type { NoteState } from "../../App";
import { NotesDispatchContext } from "../Board/BoardContext";
import { ResizeCorner } from "./ResizeCorner";

export const Note = memo(({ note }: { note: NoteState }) => {
  const dispatch = useContext(NotesDispatchContext);

  const dragRef = useRef<{ noteId: string; xOffset: number; yOffset: number }>(
    null,
  );

  // We use this to prevent moving the note when dragging to resize.
  const isResizingRef = useRef<boolean>(false);

  // for storing id of requestAnimationFrame - so we can cancel scheduled update on unmount.
  const requestAnimationFrameRef = useRef<number | null>(null);

  const updateNotePosition = useCallback(
    ({ clientX, clientY }: { clientX: number; clientY: number }) => {
      const drag = dragRef.current;
      if (!drag) return;
      if (!dispatch) return;

      const newX = clientX + drag.xOffset;
      const newY = clientY + drag.yOffset;

      dispatch({
        type: "UPDATE_NOTE",
        note: {
          ...note,
          xPosition: newX,
          yPosition: newY,
        },
      });
    },
    [dispatch, note],
  );

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    const isResizing = isResizingRef.current;
    if (isResizing === true) return;

    // store which note was grabbed, and from where (offset)
    dragRef.current = {
      noteId: note.id,
      xOffset: note.xPosition - e.clientX,
      yOffset: note.yPosition - e.clientY,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const drag = dragRef.current;
      if (!drag) return;

      if (requestAnimationFrameRef.current !== null) return;

      requestAnimationFrameRef.current = requestAnimationFrame(() => {
        updateNotePosition({ clientX: e.clientX, clientY: e.clientY });
        requestAnimationFrameRef.current = null;
      });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      if (requestAnimationFrameRef.current !== null) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [updateNotePosition]);

  // cancel scheduled note position update if component is unmounted.
  useEffect(() => {
    return () => {
      if (requestAnimationFrameRef.current !== null) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      className="p-2 shadow-lg rounded-xl bg-yellow-200 transform text-black text-sm flex flex-col absolute"
      style={{
        transform: `translate(${note.xPosition}px, ${note.yPosition}px)`,
        width: note.width + 1,
        height: note.height + 1,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="grow">{note.content}</div>
      <div className="flex justify-end">
        <ResizeCorner note={note} isResizingRef={isResizingRef} />
      </div>
    </div>
  );
});
