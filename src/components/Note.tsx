import { useState } from "react";

export const Note = () => {
  const [noteContent] = useState<string>("Test note");
  const [xPosition] = useState<number>(500);
  const [yPosition] = useState<number>(100);

  return (
    <div
      className={`border-2 border-amber-800 bg-amber-300 w-[100px] h-[100px] transform transition-transform`}
      style={{ transform: `translate(${xPosition}px, ${yPosition}px)` }}
    >
      <div className="text-sm text-black">{noteContent}</div>
    </div>
  );
};
