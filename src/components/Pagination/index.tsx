import React from 'react';
import styles from 'components/Pagination/styles.module.scss';
import Icon from 'components/Icon';

interface IProps {
  className?: string;
  itemsCount: number;
  perPage: number;
  currentPage: number;
  onChange: (page: number) => void;
}

const Pagination: React.FC<IProps> = ({className, currentPage, onChange, itemsCount, perPage}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }

  const pagesCount = Math.ceil(itemsCount / perPage);

  return (
    <div className={containerClasses}>
      <div className={`${styles.btn} ${styles.btnIcon}`} onClick={() => onChange(0)}>
        <Icon name="angle-left" />
        <Icon name="angle-left" />
      </div>
      <div
        className={`${styles.btn} ${styles.btnIcon}`}
        onClick={() => onChange(currentPage - 1)}
      >
        <Icon name="angle-left" />
      </div>
      <div className={styles.pages}>
        {Array(pagesCount)
          .fill(0)
          .map((el, i) => (
            <div
              key={i}
              className={`${styles.btn}${currentPage === i + 1 ? ' ' + styles.selected : ''}`}
              onClick={() => onChange(i + 1)}
            >
              {i + 1}
            </div>
          ))}
      </div>
      <div
        className={`${styles.btn} ${styles.btnIcon}`}
        onClick={() => onChange(currentPage + 1)}
      >
        <Icon name="angle-right" />
      </div>
      <div
        className={`${styles.btn} ${styles.btnIcon}`}
        onClick={() => onChange(currentPage - 1)}
      >
        <Icon name="angle-right" />
        <Icon name="angle-right" />
      </div>
    </div>
  );
};

export default Pagination;
