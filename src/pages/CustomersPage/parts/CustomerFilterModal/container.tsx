import React, {ChangeEvent, useState} from 'react';
import {TFunction} from 'i18next';

import FILTER_OPERATORS from 'constants/filterOperators';
import CustomerFilterModalLayout from 'pages/CustomersPage/parts/CustomerFilterModal/layout';

interface IProps {
  t: TFunction;
  visible: boolean;
  onCancel: () => void;
  // onFiltersChange: (filters: IState) => void;
}

interface IState {
  selectFields: IMultiSelectFieldsState;
  filterFields: IFiltersFieldsState;
  genderField: IFormFieldState;
}

// default Filter
const defaultFilter = {
  selectFields: {
    city: {
      values: [],
      error: '',
    },
    state: {
      values: [],
      error: '',
    },
    zip: {
      values: [],
      error: '',
    },
    relationship: {
      values: [],
      error: '',
    },
    children: {
      values: [],
      error: '',
    },
  },
  filterFields: {
    totalSpend: {
      values: ['0', '0'],
      operator: FILTER_OPERATORS[0],
      error: '',
    },
    totalTransactions: {
      values: ['0', '0'],
      operator: FILTER_OPERATORS[1],
      error: '',
    },
    averageTicket: {
      values: ['0', '100'],
      operator: FILTER_OPERATORS[5],
      error: '',
    },
    nps: {
      values: ['0', '0'],
      operator: FILTER_OPERATORS[3],
      error: '',
    },
    age: {
      values: ['0', '0'],
      operator: FILTER_OPERATORS[4],
      error: '',
    },
  },
  genderField: {
    value: 'all',
    error: '',
  }
};

const CustomerFilterModalContainer: React.FC<IProps> = ({
  t,
  visible,
  onCancel,
}) => {
  const [state, setState] = useState <IState>(defaultFilter);

  const resetSort = () => {
    setState(defaultFilter)
  };

  const onApply = () => {
  };

  const handleCancel = () => {
    setState(defaultFilter);
    onCancel();
  };

  const handleSelectChange = (name: string, values: string[]) => {
    setState({
      ...state,
      selectFields: {
        ...state.selectFields,
        [name]: {
          values,
          error: '',
        }
      }
    });
  };

  const handleFilterChange = (operator: IOption, values: string[], name: string) => {
    const regex = /^[0-9]\d*(((,\d{3}){1})?(\.\d{0,2})?)$/;

    if(!values.every(value=>regex.test(value))) return;
    setState({
      ...state,
      filterFields: {
        ...state.filterFields,
        [name]: {
          operator,
          values,
          error: '',
        }
      }
    });
  };

  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;

    setState({
      ...state,
      genderField: {
        value,
        error: '',
      }
    });
  };

  return (
    <CustomerFilterModalLayout
      t={t}
      visible={visible}
      state={state}
      onCancel={handleCancel}
      resetSort={resetSort}
      onApply={onApply}
      handleSelectChange={handleSelectChange}
      handleFilterChange={handleFilterChange}
      handleRadioChange={handleRadioChange}
    />
  );
};

export default CustomerFilterModalContainer;
