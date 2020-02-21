import React from 'react';
import styles from 'components/ChatInfo/styles.module.scss';
import Icon, {IconName} from 'components/Icon';

interface IItem {
  icon: IconName;
  iconSize: number;
  label: string;
  value: string;
}

interface IProps {
  title: string;
  items: (IItem | null)[];
  onClose: () => void;
}

const ChatInfo: React.FC<IProps> = ({title, items, onClose}) => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.close} onClick={onClose}>
        <Icon name="close" />
      </div>
      <div className={styles.body}>
        {items.map((item, i) => {
          if (!item) {
            return <div className={styles.separator} />;
          }
          return (
            <div key={i} className={styles.item}>
              <Icon name={item.icon} className={styles.icon} style={{fontSize: item.iconSize || 20}} />
              <span className={styles.value}>{item.value}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatInfo;
