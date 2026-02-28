import { useEffect, useRef, useState } from "react";

export const Note = () => {
  const [noteContent] = useState<string>("Test note");
  const [noteId] = useState<string>("001");
  const [xPosition, setXposition] = useState<number>(500);
  const [yPosition, setYPosition] = useState<number>(100);

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

    const newX = clientX + drag.xOffset;
    const newY = clientY + drag.yOffset;

    setXposition(newX);
    setYPosition(newY);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    // store which note was grabbed, and from where (offset)
    dragRef.current = {
      noteId,
      xOffset: xPosition - e.clientX,
      yOffset: yPosition - e.clientY,
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

  return (
    <div
      className="p-2 shadow-lg border-slate-400 rounded-xl bg-yellow-200 w-[100px] h-[100px] transform"
      style={{ transform: `translate(${xPosition}px, ${yPosition}px)` }}
      onMouseDown={handleMouseDown}
    >
      <div className="text-sm text-black">{noteContent}</div>
    </div>
  );
};
