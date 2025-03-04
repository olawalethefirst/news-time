import { PropsWithChildren, FunctionComponent, ReactNode } from "react";

interface AccordionProps {
  title: ReactNode;
  isOpen: boolean;
  onToggle: () => unknown;
}
const Accordion: FunctionComponent<PropsWithChildren<AccordionProps>> = ({
  title,
  children,
  isOpen,
  onToggle,
}) => (
  <div className="border rounded-lg mb-2">
    <button
      className="w-full text-left px-4 py-2 bg-gray-200"
      onClick={onToggle}
    >
      {title}
    </button>
    {isOpen && <div className="p-4">{children}</div>}
  </div>
);

export default Accordion;