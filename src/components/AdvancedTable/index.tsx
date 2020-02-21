import React from 'react';
import styles from 'components/AdvancedTable/styles.module.scss';
import SortStatus from 'components/SortStatus';

interface IProps {
  className?: string;
  columns: ITableColumn[];
  rows?: (string | JSX.Element)[][];
  groups?: (string | JSX.Element)[][][];
}

interface ITableColumn {
  title: string;
  width: number;
}

const AdvancedTable: React.FC<IProps> = ({className, columns, rows, groups}) => {
  const titleColumns: JSX.Element[] = [];
  columns.forEach((col, i) => {
    if (i === 0) return;
    titleColumns.push(
      <div
        key={columns[i].title}
        className={styles.cell}
        style={{minWidth: columns[i].width, maxWidth: columns[i].width}}
      >
        <span>{columns[i].title}</span>
        <SortStatus />
      </div>,
    );
  });

  const renderRow = (staticRows, mainRows, columns) => (row, i) => {
    staticRows.push(
      <div key={`static_row__${i}`} className={styles.row}>
        <div className={styles.cell}>{row[0]}</div>
      </div>,
    );

    const cols: JSX.Element[] = [];
    row.forEach((col, i) => {
      if (i === 0) return;
      cols.push(
        <div
          key={`col__${i}`}
          className={styles.cell}
          style={{minWidth: columns[i]?.width || 168, maxWidth: columns[i]?.width || 168}}
        >
          {col}
        </div>,
      );
    });
    mainRows.push(
      <div key={`main_row__${i}`} className={styles.row}>
        {cols}
      </div>,
    );
  };

  const staticRows: JSX.Element[] = [];
  const mainRows: JSX.Element[] = [];
  if (groups) {
    groups.forEach((group, i) => {
      const groupStaticRows: JSX.Element[] = [];
      const groupMainRows: JSX.Element[] = [];
      group.forEach(renderRow(groupStaticRows, groupMainRows, columns));

      staticRows.push(
        <div key={`group__${i}`} className={`${styles.group} ${styles.staticTitle}`}>
          {groupStaticRows}
        </div>,
      );
      mainRows.push(
        <div key={`group__${i}`} className={styles.group}>
          {groupMainRows}
        </div>,
      );
    });
  } else if (rows) {
    rows.forEach(renderRow(staticRows, mainRows, columns));
  } else {
    return null;
  }

  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }
  if (rows) {
    containerClasses += ` ${styles.noGroups}`;
  }

  return (
    <div className={containerClasses}>
      <div
        className={`${styles.table} ${styles.static}`}
        style={{minWidth: columns[0].width, maxWidth: columns[0].width}}
      >
        <div className={styles.tableHead}>
          <div className={styles.cell}>
            <span>{columns[0].title}</span>
            <SortStatus />
          </div>
        </div>
        {staticRows}
      </div>
      <div className={styles.scrollable} style={{paddingLeft: columns[0].width - 16}}>
        <div className={`${styles.table}`}>
          <div className={styles.tableHead}>{titleColumns}</div>
          {mainRows}
        </div>
      </div>
    </div>
  );
};

export default AdvancedTable;
