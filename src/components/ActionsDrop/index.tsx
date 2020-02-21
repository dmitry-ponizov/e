import React, {useState} from 'react';
import styles from 'components/ActionsDrop/styles.module.scss';
import Icon, {IconName} from 'components/Icon';

interface IAction {
  icon: IconName;
  iconSize: number;
  label: string;
  onClick: () => void;
}

interface IProps {
  className?: string;
  dropTitle?: string;
  actions: IAction[];
  opener: (active: boolean) => JSX.Element;
}

const ActionsDrop: React.FC<IProps> = ({className, actions, dropTitle, opener}) => {
  const [active, setActive] = useState(false);

  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }
  if (active) {
    containerClasses += ` ${styles.active}`;
  }

  return (
    <div className={containerClasses}>
      <div className={styles.openerHolder} onClick={() => setActive(!active)}>
        {opener(active)}
      </div>
      {active && (
        <>
          <div className={styles.overlay} onClick={() => setActive(false)} />
          <div className={styles.drop}>
            {dropTitle && <span className={styles.title}>{dropTitle}</span>}
            {actions.map((action, i) => {
              return (
                <div
                  key={i}
                  className={styles.action}
                  onClick={() => {
                    action.onClick();
                    setActive(false);
                  }}
                >
                  <Icon name={action.icon} style={{fontSize: action.iconSize}} />
                  {action.label}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ActionsDrop;
