import React from 'react';
import styles from 'components/ExtensionPageModal/styles.module.scss';

interface IProps {
  className?: string;
}

const ExtensionPageModal: React.FC<IProps> = ({children, className}) => {
  let modalClasses = styles.modal;
  if (className) {
    modalClasses += ` ${className}`;
  }

  return <div className={modalClasses}>{children}</div>;
};

export default ExtensionPageModal;
