import React from 'react';
import styles from 'components/ContactCard/styles.module.scss';
import Checkbox from 'components/Checkbox';
import Icon from 'components/Icon';

interface IProps {
  className?: string;
  name: string;
  checked?: boolean;
  image?: string;
  online?: boolean;
  mark?: string;
  title: string;
  sub: string;
  badge?: string;
  selected?: boolean;
  onUnarchive?: (name: string) => void;
  onCheckChange: (name: string) => void;
  onSelect: (name: string) => void;
}

const ContactCard: React.FC<IProps> = ({
  name,
  className,
  checked,
  image,
  online,
  title,
  sub,
  badge,
  onCheckChange,
  onSelect,
  selected,
  mark,
  onUnarchive,
}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }
  if (selected) {
    containerClasses += ` ${styles.containerSelected}`;
  }

  let statusClasses = styles.status;
  if (online) {
    statusClasses += ` ${styles.statusOnline}`;
  }

  let markedTitle: JSX.Element | string = title;
  if (mark) {
    const index = title.toLowerCase().indexOf(mark.toLowerCase());
    if (index > -1) {
      markedTitle = (
        <>
          {title.substring(0, index)}
          <span className={styles.mark}>{title.substr(index, mark.length)}</span>
          {title.substring(index + mark.length, title.length)}
        </>
      );
    }
  }

  return (
    <div className={containerClasses}>
      <Checkbox name={name} checked={!!checked} onChange={() => onCheckChange(name)} />
      <div className={styles.body} onClick={() => onSelect(name)}>
        {!!image && (
          <div className={styles.avatar} style={{backgroundImage: `url(${image})`}}>
            {online !== undefined && <div className={statusClasses} />}
          </div>
        )}
        <div className={styles.content}>
          <span className={styles.title}>{markedTitle}</span>
          <span className={styles.sub}>{sub}</span>
        </div>
        {!!badge && <span className={styles.badge}>{badge}</span>}
        {onUnarchive && (
          <div
            className={styles.unarchive}
            onClick={e => {
              e.stopPropagation();
              onUnarchive(name);
            }}
          >
            <Icon name="archive" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCard;
