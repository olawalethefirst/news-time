import useClickOutside from "@/hooks/useClickOutside";
import { FunctionComponent, PropsWithChildren, useRef } from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => unknown;
  containerClassName?: string;
}
const Modal: FunctionComponent<PropsWithChildren<ModalProps>> = ({
  title,
  isOpen,
  onClose,
  children,
  containerClassName,
}) => {
  const modalContentRef = useRef(null);

  useClickOutside(modalContentRef, onClose);
  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-10 p-4">
        <div
          className={`
                relative bg-white p-6 rounded-lg shadow-lg min-w-[300px] max-w-[600px] max-h-[80%] overflow-auto
                ${containerClassName}
            `}
          ref={modalContentRef}
        >
          <div className="flex gap-12 justify-between mb-4 relative pr-[50px]">
            <h2 className="text-xl -mt-1">{title}</h2>

            <button
              className="cursor-pointer absolute top-0 right-0 text-2xl font-black   text-red-600 bg-transparent hover:text-red-700 transition"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="20"
                height="20"
                viewBox="0 0 50 50"
              >
                <path d="M 9.15625 6.3125 L 6.3125 9.15625 L 22.15625 25 L 6.21875 40.96875 L 9.03125 43.78125 L 25 27.84375 L 40.9375 43.78125 L 43.78125 40.9375 L 27.84375 25 L 43.6875 9.15625 L 40.84375 6.3125 L 25 22.15625 Z"></path>
              </svg>
            </button>
          </div>

          <div className="mt-2">{children}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
