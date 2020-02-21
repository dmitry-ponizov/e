import React from 'react';
import styles from 'components/MessageBox/styles.module.scss';
import Icon from '../Icon';

type MessageBoxType = 'warning' | 'danger' | 'success' | 'info';

interface IProps {
  className?: string;
  type?: MessageBoxType;
}

const MessageBox: React.FC<IProps> = ({className, type, children}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }
  switch (type) {
    case 'warning':
      containerClasses += ` ${styles.warning}`;
      break;
    case 'danger':
      containerClasses += ` ${styles.danger}`;
      break;
    case 'success':
      containerClasses += ` ${styles.success}`;
      break;
    case 'info':
      containerClasses += ` ${styles.info}`;
      break;
    default:
      containerClasses += ` ${styles.info}`;
  }

  return (
    <div className={containerClasses}>
      <div className={styles.circle}>
        {type === 'danger' && <Icon name="close" className={styles.icon} />}
        {type === 'warning' && <i className={styles.letter}>!</i>}
        {type === 'success' && <Icon name="check" className={styles.icon} />}
        {(type === 'info' || !type) && <i className={styles.letter}>i</i>}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default MessageBox;
