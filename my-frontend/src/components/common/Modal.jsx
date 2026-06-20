const Modal = ({ children, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {children}

        {onClose && (
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
