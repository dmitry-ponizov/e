import React from 'react';
import styles from 'components/Modal/styles.module.scss';
import ReactDOM from 'react-dom';
import Icon from '../Icon';

interface IProps {
  visible: boolean;
  className?: string;
  onClose: () => void;
}

const Modal: React.FC<IProps> = ({visible, onClose, children, className}) => {
  let boxClasses = `engage-portal ${styles.box}`;
  if (boxClasses) {
    boxClasses += ` ${className}`;
  }
  let modalClasses = styles.modal;
  if (visible) {
    modalClasses += ` ${styles.modalActive}`;
  }

  return ReactDOM.createPortal(
    <div className={modalClasses} onClick={onClose}>
      <div className={boxClasses} onClick={e => e.stopPropagation()}>
        <div className={styles.close} onClick={onClose}>
          <Icon name="close" />
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
