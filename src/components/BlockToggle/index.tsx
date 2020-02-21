import React from 'react';
import styles from 'components/BlockToggle/styles.module.scss';

interface IProps {
  title: string;
  content: JSX.Element;
}

const BlockToggle: React.FC<IProps> = ({title, content}) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.content}>{content}</div>
    </div>
  );
};

export default BlockToggle;
