import React from 'react';
import styles from 'components/PageContainer/styles.module.scss';

interface IProps {
  className?: string;
}

const PageContainer: React.FC<IProps> = ({className, children}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }

  return <div className={containerClasses}>{children}</div>;
};

export default PageContainer;
