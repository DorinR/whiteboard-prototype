import { useCallback, useEffect } from "react";

// Drag note over this area to delete it
export const DeleteArea = () => {
  const handleMouseOver = useCallback(() => {}, []);

  useEffect(() => {
    const handleMouseOver = () => {};

    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <div
      id="delete-area"
      className="border-2 border-red-200 hover:bg-red-200 bg-red-100 h-14 text-center"
      onMouseOver={handleMouseOver}
    ></div>
  );
};
