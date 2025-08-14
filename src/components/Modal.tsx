import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onClose}>
      <div className={`modal ${className || ""}`} onClick={(e) => e.stopPropagation()}>
        {title && <div className="modal-title">{title}</div>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
