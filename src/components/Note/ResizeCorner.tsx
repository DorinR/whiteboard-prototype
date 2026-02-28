import { useContext, useEffect, useRef } from "react";
import type { NoteState } from "../../App";
import { NotesDispatchContext } from "../Board/BoardContext";

export const ResizeCorner = ({
  note,
  isResizingRef,
}: {
  note: NoteState;
  isResizingRef: React.RefObject<boolean>;
}) => {
  const dispatch = useContext(NotesDispatchContext);

  const resizeDragRef = useRef<{
    noteId: string;
    pickedUpX: number;
    originalWidth: number;
    pickedUpY: number;
    originalHeight: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isResizingRef.current = true;

    e.preventDefault();

    resizeDragRef.current = {
      noteId: note.id,
      pickedUpX: e.clientX,
      originalWidth: note.width,
      pickedUpY: e.clientY,
      originalHeight: note.height,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const resizeRef = resizeDragRef.current;
      if (!resizeRef) return;
      if (!dispatch) return;

      const cursorX = e.clientX;
      const cursorY = e.clientY;

      const newWidth = resizeRef.originalWidth + cursorX - resizeRef.pickedUpX;
      const newHeight =
        resizeRef.originalHeight + cursorY - resizeRef.pickedUpY;

      if (newWidth < 80 || newHeight < 80) return;

      dispatch({
        type: "UPDATE_NOTE",
        note: {
          ...note,
          id: note.id,
          height: newHeight,
          width: newWidth,
        },
      });
    };

    const handleMouseUp = () => {
      resizeDragRef.current = null;
      isResizingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [note, dispatch, isResizingRef]);

  return (
    <div
      className="cursor-se-resize h-[8px] w-[8px] border-b-2 border-r-2 hover:border-slate-500 border-slate-400"
      onMouseDown={handleMouseDown}
    >
      {" "}
    </div>
  );
};
