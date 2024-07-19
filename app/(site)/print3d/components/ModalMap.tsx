import React, { forwardRef, Ref, useImperativeHandle, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Это для обеспечения доступности модального окна

interface ModalMapRef {
    openModal: () => void;
    closeModal: () => void;
  }

// Используем forwardRef и useImperativeHandle, добавляя типы
const ModalMap = forwardRef<ModalMapRef>((props, ref: Ref<ModalMapRef>) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // Применяем useImperativeHandle для передачи методов наружу
    useImperativeHandle(ref, () => ({
      openModal() {
        setModalIsOpen(true);
      },
      closeModal() {
        setModalIsOpen(false);
      }
    }));

  return (
    <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={()=> setModalIsOpen(false)}
        contentLabel="Iframe Modal"
        style={{
          content: {
            width: '80%',
            height: '80%',
            margin: 'auto'
          }
        }}
      >
        <button onClick={()=> setModalIsOpen(false)}>Close</button>
        <iframe 
          src="https://robobug.ru/cdek/example2.html" 
          style={{ width: '100%', height: '90%' }} 
          title="Iframe Example"
        />
      </Modal>
    </div>
  );
});

export default ModalMap;
