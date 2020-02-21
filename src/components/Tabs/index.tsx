import React from 'react';
import styles from 'components/Tabs/styles.module.scss';
import Link from 'components/Link';

interface ITab {
  id: string;
  label: string;
}
export interface ITabsProps {
  className?: string;
  active?: string;
  tabs: ITab[];
  onChange: (id: string) => void;
}

const Tabs: React.FC<ITabsProps> = ({className, tabs = [], active, onChange}) => {
  let tabsClasses = styles.tabs;
  if (className) {
    tabsClasses += ` ${className}`;
  }

  return (
    <div className={tabsClasses}>
      <div className={styles.scrollable}>
        {tabs.map(tab => {
          let tabStyles = styles.tab;
          if (tab.id === active) {
            tabStyles += ` ${styles.active}`;
          }
          return (
            <Link key={tab.id} className={tabStyles} onClick={() => onChange(tab.id)}>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
