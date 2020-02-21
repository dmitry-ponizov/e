import React, {ChangeEvent} from 'react';
import styles from 'pages/CustomersPage/parts/CustomerFilterModal/styles.module.scss';
import {TFunction} from 'i18next';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Icon from 'components/Icon';
import MultiSelect from 'components/MultiSelect';
import DefinitionList from 'components/DefinitionList';
import AdvancedFilter from 'components/AdvancedFilter';
import RadioTabs from 'components/RadioTabs';
import {US_STATES_SHORT} from 'constants/usStates';
import CHILDREN_TYPES from 'constants/childrenTypes';
import RELATIONSHIP_TYPES from 'constants/relationshipTypes';
import GENDER_TYPES from 'constants/genderTypes';

interface IFilters {
  selectFields: IMultiSelectFieldsState;
  filterFields: IFiltersFieldsState;
  genderField: IFormFieldState;
}

interface IProps {
  t: TFunction;
  visible: boolean;
  state: IFilters;
  onCancel: () => void;
  resetSort: () => void;
  onApply: () => void;
  handleSelectChange: (name: string, value: string[]) => void;
  handleFilterChange: (operator: IOption, values: string[], name: string) => void;
  handleRadioChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const CustomerFilterModalLayout: React.FC<IProps> = ({
  t,
  visible,
  state,
  onCancel,
  resetSort,
  onApply,
  handleFilterChange,
}) => {
  const {filterFields, genderField} = state;

  return (
    <Modal className={styles.box} visible={visible} onClose={onCancel}>
      <div className={styles.header}>
        <span className={styles.title}>{t('Filters')}</span>
        <Button className={styles.btnReset} onClick={resetSort}>
          <Icon name="reset" />
          {t('Reset to Default')}
        </Button>
      </div>
      <DefinitionList
        className={styles.table}
        items={[
          {
            name: t('Customer ID'),
            value: <span className={styles.valueText}>1234567</span>,
          },
          {
            name: t('City'),
            value: (
              <MultiSelect
                flatOpener
                className={styles.customSelect}
                selected={['']}
                options={[
                  {value: '', label: 'none'},
                  {value: 'New York', label: 'New York'},
                  {value: 'Chicago', label: 'Chicago'},
                  {value: 'Los Angeles', label: 'Los Angeles'},
                ]}
                onChange={() => {}}
                name="city"
                t={t}
              />
            ),
          },
          {
            name: t('State'),
            value: (
              <MultiSelect
                flatOpener
                className={styles.customSelect}
                selected={[]}
                options={US_STATES_SHORT}
                onChange={() => {}}
                name="state"
                t={t}
              />
            ),
          },
          {
            name: t('Zip'),
            value: (
              <MultiSelect
                flatOpener
                className={styles.customSelect}
                selected={[]}
                options={US_STATES_SHORT}
                onChange={() => {}}
                name="zip"
                t={t}
              />
            ),
          },
          {
            name: t('Total Spend'),
            value: (
              <AdvancedFilter
                t={t}
                className={styles.customFilter}
                operator={filterFields.totalSpend.operator}
                values={filterFields.totalSpend.values}
                name="totalSpend"
                onChange={handleFilterChange}
              />
            ),
          },
          {
            name: t('Total Transactions'),
            value: (
              <AdvancedFilter
                t={t}
                className={styles.customFilter}
                operator={filterFields.totalTransactions.operator}
                values={filterFields.totalTransactions.values}
                name="totalTransactions"
                onChange={handleFilterChange}
              />
            ),
          },
          {
            name: t('Average Ticket'),
            value: (
              <AdvancedFilter
                t={t}
                className={styles.customFilter}
                operator={filterFields.averageTicket.operator}
                values={filterFields.averageTicket.values}
                name="averageTicket"
                onChange={handleFilterChange}
              />
            ),
          },
          {
            name: t('NPS'),
            value: (
              <AdvancedFilter
                t={t}
                className={styles.customFilter}
                operator={filterFields.nps.operator}
                values={filterFields.nps.values}
                name={'nps'}
                onChange={handleFilterChange}
              />
            ),
          },
          {
            name: t('Gender'),
            value: (
              <RadioTabs
                className={styles.customRadioTabs}
                selected={genderField.value}
                onChange={() => {}}
                options={[
                  {
                    value: 'all',
                    label: t('All'),
                  },
                  ...GENDER_TYPES,
                ]}
                name="genderField"
              />
            ),
          },
          {
            name: t('Age'),
            value: (
              <AdvancedFilter
                t={t}
                operator={filterFields.age.operator}
                values={filterFields.age.values}
                name="age"
                onChange={handleFilterChange}
              />
            ),
          },
          {
            name: t('Relationship'),
            value: (
              <MultiSelect
                flatOpener
                className={styles.customSelect}
                selected={['single']}
                options={RELATIONSHIP_TYPES}
                onChange={() => {}}
                name="relationship"
                t={t}
              />
            ),
          },
          {
            name: t('Children'),
            value: (
              <MultiSelect
                flatOpener
                className={styles.customSelect}
                selected={['none']}
                options={CHILDREN_TYPES}
                onChange={() => {}}
                name="children"
                t={t}
              />
            ),
          },
        ]}
      />
      <div className={styles.actions}>
        <Button alt className={styles.btn} onClick={onCancel}>
          {t('Cancel')}
        </Button>
        <Button className={`${styles.btn} ${styles.secondBtn}`} onClick={onApply}>
          {t('Apply')}
        </Button>
      </div>
    </Modal>
  );
};

export default CustomerFilterModalLayout;
