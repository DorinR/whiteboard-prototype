import { useState } from "react";

export const Note = () => {
  const [noteContent] = useState<string>("Test note");
  const [xPosition] = useState<number>(500);
  const [yPosition] = useState<number>(100);

  return (
    <div
      className={` p-2 shadow-lg border-slate-400 rounded-xl bg-yellow-200 w-[100px] h-[100px] transform transition-transform`}
      style={{ transform: `translate(${xPosition}px, ${yPosition}px)` }}
    >
      <div className="text-sm text-black">{noteContent}</div>
    </div>
  );
};
