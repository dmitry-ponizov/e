import React from 'react';
import styles from 'components/SortStatus/styles.module.scss';
import Icon from 'components/Icon';

type statusType = 'asc' | 'desc' | undefined;

interface IProps {
  className?: string;
  status?: statusType;
}

const SortStatus: React.FC<IProps> = ({className, status}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }
  if (status === 'asc') {
    containerClasses += ` ${styles.asc}`;
  } else if (status === 'desc') {
    containerClasses += ` ${styles.desc}`;
  }

  return (
    <div className={containerClasses}>
      <Icon className={styles.iconTop} name="arrow-up" />
      <Icon className={styles.iconBottom} name="arrow-down" />
    </div>
  );
};

export default SortStatus;
