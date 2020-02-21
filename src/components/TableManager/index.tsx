import React from 'react';
import Checkbox from 'components/Checkbox';
import styles from 'components/TableManager/styles.module.scss';
import SortStatus from 'components/SortStatus';

interface ITableItem {
  id: string;
  tableData: [string, JSX.Element | string];
}

interface IProps {
  data: ITableItem[];
  choosedData: string[];
  currentItem: string | null;
  columns: [string, string];
  sortType: string;
  sortAsc: boolean;
  noResultFoundMsg: string;
  onChangeSort: (value: string) => void;
  onChooseItems: (ids: string[]) => void;
  onSetActiveItem: (id: string) => void;
}

type SortType = 'name' | 'customers';

const TableManager: React.FC<IProps> = ({
  data,
  choosedData,
  currentItem,
  columns,
  onChangeSort,
  sortType,
  sortAsc,
  onSetActiveItem,
  onChooseItems,
  noResultFoundMsg,
}) => {
  const renderSortIcon = (sortTypeValue: SortType): JSX.Element => {
    const isActive = sortType === sortTypeValue;
    return <SortStatus status={isActive ? (sortAsc ? 'asc' : 'desc') : undefined} />;
  };

  return (
    <div className={styles.body}>
      {data.length ? (
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <div className={styles.th}>
              <Checkbox
                inputClass={styles.thCheckbox}
                inputActiveClass={styles.checkboxActive}
                name="allItems"
                checked={data.length === choosedData.length}
                onChange={() => {
                  onChooseItems(data.length === choosedData.length ? [] : data.map(el => el.id));
                }}
              />
            </div>
            <div className={styles.th} onClick={() => onChangeSort('name')}>
              {renderSortIcon('name')}
              <span>{columns[0]}</span>
            </div>
            <div className={styles.th} onClick={() => onChangeSort('customers')}>
              {renderSortIcon('customers')}
              <span>{columns[1]}</span>
            </div>
          </div>
          <div className={styles.tableBody}>
            {data.map(item => {
              const selected = choosedData.indexOf(item.id) > -1;
              const setActiveHandler = () => onSetActiveItem(item.id);
              let rowClasses = styles.tableRow;
              if (currentItem && item.id === currentItem) {
                rowClasses += ` ${styles.activeItem}`;
              }
              return (
                <div key={item.id} className={rowClasses}>
                  <div className={styles.td}>
                    <Checkbox
                      inputClass={styles.tdCheckbox}
                      inputActiveClass={styles.checkboxActive}
                      name={`tableItem-${item.id}`}
                      checked={selected}
                      onChange={() => {
                        onChooseItems(selected ? choosedData.filter(el => el !== item.id) : [...choosedData, item.id]);
                      }}
                    />
                  </div>
                  <div className={styles.td} onClick={setActiveHandler}>
                    {item.tableData[1]}
                  </div>
                  <div className={styles.td} onClick={setActiveHandler}>
                    <span className={styles.ellipsis}>{item.tableData[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <span className={styles.noResultsText}>{noResultFoundMsg}</span>
      )}
    </div>
  );
};

export default TableManager;
