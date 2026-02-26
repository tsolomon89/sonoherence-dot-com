import React, { type ReactNode, useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { GlassPanel } from './GlassPanel';
import './ui.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const frame = window.requestAnimationFrame(() => {
        setShouldRender(true);
        setIsClosing(false);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    if (!shouldRender) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsClosing(true);
    });
    const timeout = window.setTimeout(() => {
      setShouldRender(false);
      setIsClosing(false);
    }, 340);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [isOpen, shouldRender]);

  useEffect(() => {
    if (shouldRender) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [shouldRender]);

  useEffect(() => {
    if (!shouldRender) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      className={`modal-overlay ${isClosing ? 'modal-overlay-closing' : 'modal-overlay-open'}`}
      onClick={onClose}
    >
      <div
        className={`modal-container ${isClosing ? 'modal-container-closing' : 'modal-container-open'}`}
        onClick={(event) => event.stopPropagation()}
      >
        <GlassPanel className="modal-content" padding="lg">
          <button onClick={onClose} className="modal-close" aria-label="Close modal">
            <X size={24} />
          </button>
          {title && <h2 className="modal-title">{title}</h2>}
          {children}
        </GlassPanel>
      </div>
    </div>
  );
};
