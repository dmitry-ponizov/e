import React from 'react';
import styles from 'components/AppLoader/styles.module.scss';

interface IProps {
  text?: string;
}

const AppLoader: React.FC<IProps> = ({text}) => {
  return (
    <div className={styles.loader}>
      <img className={styles.image} src={require('assets/images/logo-engage-color.svg')} alt="Engage" />
      {!!text && <span className={styles.text}>{text}</span>}
    </div>
  );
};

export default AppLoader;
