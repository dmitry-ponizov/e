import React from 'react';
import styles from 'components/DefinitionList/styles.module.scss';

interface IListItem {
  name: string;
  value: JSX.Element | string;
}

interface IProps {
  className?: string;
  title?: string;
  items: IListItem[];
}

const DefinitionList: React.FC<IProps> = ({
  className,
  title,
  items
}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }

  return (
    <div className={containerClasses}>
      {!!title && <span className={styles.title}>{title}</span>}
      <table className={styles.table}>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} className={(i + 1) % 2 === 0 ? styles.even : styles.odd}>
              <td>{item.name}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DefinitionList;
