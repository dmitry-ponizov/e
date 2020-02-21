import React from 'react';
import styles from 'components/WidgetBlock/styles.module.scss';

interface IItem {
  title: string;
  icon?: JSX.Element;
  subTitle?: string;
}

interface IProps {
  className?: string;
  mainTitle: string;
  items: IItem[];
}

const WidgetBlock: React.FC<IProps> = ({mainTitle, items}) => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>{mainTitle}</span>
      <div className={styles.body}>
        {items.map((item, i) => {
          return (
            <div key={i} className={styles.item}>
              {!!item.icon && <div className={styles.left}>{item.icon}</div>}
              <div className={styles.right}>
                <span className={styles.itemTitle}>{item.title}</span>
                <span className={styles.subTitle}>{item.subTitle}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default WidgetBlock;
