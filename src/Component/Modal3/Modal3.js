import React, { useEffect, useState } from 'react';
import styles from './Modal3.module.css';

const Modal3 = ({ isOpen, onClose, children ,isEndingRef,isCallInProgress}) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [callstatus, setcallstatus] = useState(isCallInProgress);
useEffect(() => {
  if (isOpen) {
    setShouldRender(true);
    document.body.style.overflow = 'hidden';
  } else if (shouldRender) {
    setIsClosing(true);

    const timer = setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
      document.body.style.overflow = 'auto'; // ✅ RESTORE SCROLL HERE
    }, 300);

    return () => clearTimeout(timer);
  }
}, [isOpen]);

  useEffect(() => {
    const escHandler = (e) => {
      if (e.key === 'Escape') onClose();  
    };
    document.addEventListener('keydown', escHandler);
    return () => document.removeEventListener('keydown', escHandler);
  }, [onClose]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = 'auto';
      setIsClosing(false);
      onClose();  
    }, 300);
  };

  if (!shouldRender) return null;

  return (
    <div className={styles.backdrop} >
      <div
        className={`${styles.modalContainer} ${isClosing ? styles.slideDown : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.modal}>
          {/* {!isEndingRef.current && */}
          <button className={styles.closeBtn} onClick={handleClose} disabled={isEndingRef.current}>
            <img src='images/cross-icon.png' alt='cross-icon' />
          </button>
          {/* } */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal3;
