import React from 'react';

interface ModalProps {
  isVisible?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

// Добавление значений по умолчанию для `isVisible`
const Modal: React.FC<ModalProps> = ({ 
  isVisible = false, 
  onClose, 
  children 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-4/5 h-4/5 flex flex-col">
        <button className="self-end p-2" onClick={onClose}>Закрыть</button>
        <div className="flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;