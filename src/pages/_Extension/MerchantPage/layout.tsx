import React from 'react';
import styles from 'pages/_Extension/MerchantPage/styles.module.scss';
import {TFunction} from 'i18next';
import ModuleLoader from 'components/ModuleLoader';
import Icon, {IconName} from 'components/Icon';
import Pagination from 'components/Pagination';
import AdvancedTable from 'components/AdvancedTable';

import {DraggableList} from 'components/DraggableList';
import ContentWrapper from 'components/ContentWrapper';
import Button from 'components/Button';
import Tooltip from 'components/Tooltip';

interface ISortableItem {
  id: string;
  label: string;
  isActive: boolean;
}

interface ITableColumn {
  title: string;
  width: number;
}

interface IStyledColumn {
  id: string;
  tableIndex: number;
  tooltip: string;
  iconName: IconName;
}

interface IProps {
  t: TFunction;
  initiated: boolean;
  filtersIsVisible: boolean;
  defaultSortableList: ISortableItem[];
  sortableList: ISortableItem[];
  tableColumnsData: ITableColumn[];
  tableRowsData: (string | JSX.Element)[][][];
  styledColumns: IStyledColumn[];
  onStartChat: () => void;
  onApplySortableList: (list: ISortableItem[]) => void;
  onFiltersOpen: () => void;
  onFiltersApply: (filters: any) => void;
  onFiltersClose: () => void;
}

const CustomerMerchantPagePageLayout: React.FunctionComponent<IProps> = ({
  t,
  initiated,
  defaultSortableList,
  onFiltersOpen,
  styledColumns,
  tableColumnsData,
  tableRowsData,
  sortableList,
  onApplySortableList,
  onStartChat,
}) => {
  return (
    <ContentWrapper title={t('Merchants')} sub={`${tableRowsData.length} Total`}>
      {initiated ? (
        <div className={styles.box}>
          <div className={styles.header}>
            <div className={styles.search}>
              <Icon className={styles.searchIcon} name="search" />
              <input
                name="searchQuery"
                placeholder={t('Search')}
                type="search"
                className={styles.searchField}
                onChange={() => {}}
              />
            </div>
            <div className={styles.headerRight}>
              <DraggableList
                t={t}
                label="Column"
                defaultItems={defaultSortableList}
                items={sortableList}
                onChange={changedSortableList => onApplySortableList(changedSortableList)}
              />
              <Button className={styles.filterButton} onClick={() => onFiltersOpen()}>
                {/*TODO: add the filter icon to the moonicon font instead of the star below*/}
                <Icon name={'star'} />
                {t('Filters')}
              </Button>
            </div>
          </div>
          <AdvancedTable
            columns={tableColumnsData}
            groups={tableRowsData.map(group => {
              return group.map(location => {
                const styledTableRow = [...location];
                styledTableRow[0] = location[0] && (
                  <>
                    <img className={styles.logo} src="https://opensource.org/files/twitterlogo.png" alt="avatar" />
                    <span className={styles.businessName}>{location[0]}</span>
                    <div className={styles.iconChat} onClick={onStartChat}>
                      <Tooltip dark={true} content={t('Chat With Merchant')}>
                        <Icon name="message" style={{color: '#6ACBF4', fontSize: ' 24px'}} />
                      </Tooltip>
                    </div>
                  </>
                );
                styledColumns.forEach(styledField => {
                  styledTableRow[styledField.tableIndex] = (
                    <Tooltip
                      dark={true}
                      content={
                        <div className={styles.tooltipBox}>
                          <Icon name={styledField.iconName} style={{color: '#FFCB3D', fontSize: ' 16px'}} />
                          <span>{t(styledField.tooltip)}</span>
                        </div>
                      }
                    >
                      <span className={styles.link}>{styledTableRow[styledField.tableIndex]}</span>
                    </Tooltip>
                  );
                });

                return styledTableRow;
              });
            })}
          />
          <div className={styles.footer}>
            <span className={styles.rppLabel}>Rows per page:</span>
            <span>15</span>
            <div className={styles.footerRight}>
              <Pagination itemsCount={98} perPage={10} currentPage={2} onChange={() => {}} />
            </div>
          </div>
        </div>
      ) : (
        <ModuleLoader />
      )}
    </ContentWrapper>
  );
};

export default CustomerMerchantPagePageLayout;
