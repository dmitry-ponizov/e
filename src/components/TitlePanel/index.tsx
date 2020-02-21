import React from 'react';
import styles from 'components/TitlePanel/styles.module.scss';

interface IProps {
  className?: string;
  title: string;
  actions?: JSX.Element;
}

const TitlePanel: React.FC<IProps> = ({className, actions, title}) => {
  let panelClasses = styles.container;
  if (className) {
    panelClasses += ` ${className}`;
  }

  return (
    <div className={panelClasses}>
      <span className={styles.title}>{title}</span>
      {actions && <div className={styles.right}>{actions}</div>}
    </div>
  );
};

export default TitlePanel;
