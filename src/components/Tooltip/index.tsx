import React from 'react';
import styles from 'components/Tooltip/styles.module.scss';

interface IProps {
  disabled?: boolean;
  dark?: boolean;
  className?: string;
  content?: JSX.Element;
}

const Tooltip: React.FC<IProps> = ({className, children, content, disabled, dark}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }
  if (disabled) {
    containerClasses += ` ${styles.disabled}`;
  }
  if (dark) {
    containerClasses += ` ${styles.dark}`;
  }
  return (
    <div className={containerClasses}>
      {children}
      <div className={styles.tooltip}>{content}</div>
    </div>
  );
};

export default Tooltip;
