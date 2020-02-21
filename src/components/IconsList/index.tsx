import React from 'react';
import styles from 'components/IconsList/styles.module.scss';
import Icon from 'components/Icon';

interface IProps {
  className?: string;
  values: string[];
}

const IconsList: React.FC<IProps> = ({className, values}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }

  return (
    <div className={containerClasses}>
      <div className={styles.item}>
        <Icon name="view" />
        <span>{values[0]}</span>
      </div>
      <div className={styles.item}>
        <Icon name="heart" />
        <span>{values[1]}</span>
      </div>
      <div className={styles.item}>
        <Icon name="like" />
        <span>{values[2]}</span>
      </div>
      <div className={styles.item}>
        <Icon name="share" />
        <span>{values[3]}</span>
      </div>
    </div>
  );
};

export default IconsList;
