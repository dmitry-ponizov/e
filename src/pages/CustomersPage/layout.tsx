import React from 'react';
import styles from 'pages/CustomersPage/styles.module.scss';
import {TFunction} from 'i18next';
import StatisticsPanel from 'containers/StatisticsPanel';
import ModuleLoader from 'components/ModuleLoader';
import Icon from 'components/Icon';
import Pagination from 'components/Pagination';
import AdvancedTable from 'components/AdvancedTable';
import Button from '../../components/Button';
import CustomerFilterModalContainer from 'pages/CustomersPage/parts/CustomerFilterModal/container';

import {DraggableList} from 'components/DraggableList';
import ContentWrapper from 'components/ContentWrapper';

interface ISortableItem {
  id: string;
  label: string;
  isActive: boolean;
}

interface IProps {
  t: TFunction;
  initiated: boolean;
  filtersIsVisible: boolean;
  defaultSortableList: ISortableItem[];
  sortableList: ISortableItem[];
  tableColumnsData: ITableColumn[];
  tableRowsData: Array<string[]>;
  onApplySortableList: (list: ISortableItem[]) => void;
  onFiltersOpen: () => void;
  onFiltersApply: (filters: any) => void;
  onFiltersClose: () => void;
}

interface ITableColumn {
  title: string;
  width: number;
}

const GroupsPageLayout: React.FunctionComponent<IProps> = ({
  t,
  initiated,
  filtersIsVisible,
  defaultSortableList,
  onFiltersOpen,
  tableColumnsData,
  tableRowsData,
  sortableList,
  onFiltersClose,
  onApplySortableList,
}) => {
  return (
    <ContentWrapper title={t('Customers')}>
      <CustomerFilterModalContainer t={t} visible={filtersIsVisible} onCancel={onFiltersClose} />
      <StatisticsPanel
        items={[
          {value: 999, icon: 'cash', label: t('Spend')},
          {value: 999, icon: 'transaction', label: t('Transactions')},
          {value: 999, icon: 'ticket', label: t('Ave Ticket')},
          {value: 999, icon: 'view', label: t('Views')},
          {value: 999, icon: 'like', label: t('Likes')},
          {value: 999, icon: 'heart', label: t('Favorites')},
          {value: 999, icon: 'share', label: t('Shared')},
          {value: 999, icon: 'feedback', label: t('Feedback')},
          {value: 999, icon: 'lightning', label: t('Disputes')},
          {value: 999, icon: 'smile', label: t('NPS')},
        ]}
      />
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
                label={`${t('Columns')}:`}
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
          <AdvancedTable columns={tableColumnsData} rows={tableRowsData} />
          <div className={styles.footer}>
            <span className={styles.rppLabel}>{t('Rows per page')}:</span>
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

export default GroupsPageLayout;
