import { useEffect, RefObject } from "react";

const useClickOutside = (
  ref: RefObject<HTMLElement | null>,
  handler: () => unknown
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target instanceof Node)) return;
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
};

export default useClickOutside;
