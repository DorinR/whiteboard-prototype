import { useEffect, useRef, useState } from "react";

export const Note = () => {
  const [noteContent] = useState<string>("Test note");
  const [noteId] = useState<string>("001");
  const [xPosition, setXposition] = useState<number>(500);
  const [yPosition, setYPosition] = useState<number>(100);

  const dragRef = useRef<{ noteId: string; x: number; y: number }>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    dragRef.current = {
      noteId,
      x: e.clientX,
      y: e.clientY,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (dragRef.current === null) return;

      setXposition(e.clientX);
      setYPosition(e.clientY);
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

  return (
    <div
      className="p-2 shadow-lg border-slate-400 rounded-xl bg-yellow-200 w-[100px] h-[100px] transform transition-transform"
      style={{ transform: `translate(${xPosition}px, ${yPosition}px)` }}
      onMouseDown={handleMouseDown}
    >
      <div className="text-sm text-black">{noteContent}</div>
    </div>
  );
};
