import { useEffect, useState } from "react";

const useHover = (node: HTMLDivElement | null) => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    node?.addEventListener("mouseover", () => {
      setOn(true);
    });
    node?.addEventListener("mouseout", () => {
      setOn(false);
    });
  }, [node]);

  return on;
};

export default useHover;
