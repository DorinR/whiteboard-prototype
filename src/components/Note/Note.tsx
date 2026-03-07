import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { NoteState } from "../../App";
import { cn } from "../../utils/cn";
import { NotesDispatchContext } from "../Board/BoardContext";
import { ResizeCorner } from "./ResizeCorner";

export const Note = memo(({ note }: { note: NoteState }) => {
  const [isHoveringDeleteLocalState, setIsHoveringDeleteLocalState] =
    useState<boolean>(false);
  const dispatch = useContext(NotesDispatchContext);

  const noteRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ noteId: string; xOffset: number; yOffset: number }>(
    null,
  );

  // We use this to prevent moving the note when dragging to resize.
  const isResizingRef = useRef<boolean>(false);

  // for storing id of requestAnimationFrame - so we can cancel scheduled update on unmount.
  const requestAnimationFrameRef = useRef<number | null>(null);

  const isHoveringDeleteArea = useCallback(() => {
    const deleteArea = document.getElementById("delete-area");
    if (noteRef.current && deleteArea) {
      const noteRect = noteRef.current.getBoundingClientRect();
      const deleteAreaRect = deleteArea.getBoundingClientRect();

      if (isColliding(noteRect, deleteAreaRect)) {
        return true;
      }
    }
    return false;
  }, []);

  const updateNotePosition = useCallback(
    ({ clientX, clientY }: { clientX: number; clientY: number }) => {
      console.log("updating note position");
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

    // if we are currently resizing, don't do anything
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

      const isHoveringDelete = isHoveringDeleteArea();
      if (isHoveringDelete !== isHoveringDeleteLocalState) {
        setIsHoveringDeleteLocalState(isHoveringDelete);
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      if (requestAnimationFrameRef.current !== null) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
        requestAnimationFrameRef.current = null;
      }

      if (isHoveringDeleteArea()) {
        if (!dispatch) return;
        dispatch({
          type: "REMOVE_NOTE",
          note: {
            ...note,
            id: note.id,
          },
        });
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [
    updateNotePosition,
    dispatch,
    note,
    isHoveringDeleteArea,
    isHoveringDeleteLocalState,
  ]);

  // cancel scheduled note position update if component is unmounted
  useEffect(() => {
    return () => {
      if (requestAnimationFrameRef.current !== null) {
        cancelAnimationFrame(requestAnimationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={noteRef}
      className={cn([
        "p-2 shadow-lg rounded-xl bg-yellow-200 transform text-black text-sm flex flex-col absolute",
        isHoveringDeleteLocalState && "bg-red-200",
      ])}
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

function isColliding(rectA: DOMRect, rectB: DOMRect): boolean {
  return !(
    rectA.right < rectB.left ||
    rectA.left > rectB.right ||
    rectA.bottom < rectB.top ||
    rectA.top > rectB.bottom
  );
}
