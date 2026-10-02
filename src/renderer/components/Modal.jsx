import { useEffect, useRef } from 'react';

// Closed only by the X or the content's own buttons; Escape and backdrop clicks are ignored.
export const Modal = ({ onClose, children }) => {
  const ref = useRef(null);

  useEffect(() => {
    ref.current.showModal();
    // showModal focuses the first control (the X); prefer the marked field instead.
    ref.current.querySelector('[data-autofocus]')?.focus();
  }, []);

  return (
    <dialog ref={ref} className="modal" onCancel={(e) => e.preventDefault()}>
      <button className="btn modal-close" type="button" onClick={onClose}>
        X
      </button>
      {children}
    </dialog>
  );
};
