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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4">
        <div
          className={`
                relative bg-white p-6 rounded-lg shadow-lg min-w-[300px] max-w-[600px] max-h-[80%] overflow-auto
                ${containerClassName}
            `}
          ref={modalContentRef}
        >
          <div className="flex gap-12 justify-between mb-4 relative pr-[50px]">
            <h2 className="text-lg font-bold mt-2">{title}</h2>

            <button
              className="cursor-pointer absolute top-0 right-0 text-2xl font-black  px-4 py-1 text-red-600 bg-transparent hover:text-red-700 transition"
              onClick={onClose}
            >
              x
            </button>
          </div>

          <div>{children}</div>
        </div>
      </div>
    )
  );
};

export default Modal;
