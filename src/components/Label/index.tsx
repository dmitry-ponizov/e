import React from 'react';
import styles from 'components/Label/styles.module.scss';

interface IProps {
  focused?: boolean;
  error?: boolean;
  className?: string;
}

const Label: React.FC<IProps> = ({focused, error, className, children}) => {
  let labelClasses = styles.label;
  if (focused) {
    labelClasses += ` ${styles.focused}`;
  }
  if (error) {
    labelClasses += ` ${styles.error}`;
  }
  if (className) {
    labelClasses += ` ${className}`;
  }

  return <label className={labelClasses}>{children}</label>;
};

export default Label;
