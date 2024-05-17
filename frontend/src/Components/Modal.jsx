import './Modal.css';

const Modal = ({ isOpen, closeModal, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <button className="modal-close" onClick={closeModal}>Закрыть</button>
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
