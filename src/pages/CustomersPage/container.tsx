import React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import CustomersPageLayout from 'pages/CustomersPage/layout';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
// import {US_STATES_SHORT, US_STATES_VALUES} from 'constants/usStates';
// import CHILDREN_TYPES, {CHILDREN_TYPES_VALUES} from "constants/childrenTypes";
// import RELATIONSHIP_TYPES, {RELATIONSHIP_TYPES_VALUES} from "constants/relationshipTypes";
// import GENDER_TYPES from "constants/genderTypes";

interface IColumnsData {
  title: string;
  id: string;
  width: number;
}

interface ITableColumn {
  title: string;
  width: number;
}

// {{{
// TODO: DELETE when real DATA will be ready
const getCustomerTest = () => ({
  customerID: Math.random(),
  city: 'A',
  state: 'someState',
  zip: '342',
  totalSpend: '214',
  totalTransactions: '345454234',
  averageTicket: '2343244234',
  nps: '213412334234',
  gender: 'male',
  age: '33',
  relationship: 'fdsf',
  children: '0',
});
// }}}

const columnsData: IColumnsData[] = [
  {
    title: 'Customer ID',
    width: 140,
    id: 'customerID',
  },
  {
    title: 'City',
    width: 132,
    id: 'city',
  },
  {
    title: 'State',
    width: 114,
    id: 'state',
  },
  {
    title: 'Zip',
    width: 88,
    id: 'zip',
  },
  {
    title: 'Total Spend',
    width: 168,
    id: 'totalSpend',
  },
  {
    title: 'Total Transactions',
    width: 168,
    id: 'totalTransactions',
  },
  {
    title: 'Average Ticket',
    width: 168,
    id: 'averageTicket',
  },
  {
    title: 'NPS',
    width: 168,
    id: 'nps',
  },
  {
    title: 'Gender',
    width: 168,
    id: 'gender',
  },
  {
    title: 'Age',
    width: 168,
    id: 'age',
  },
  {
    title: 'Relationship',
    width: 168,
    id: 'relationship',
  },
  {
    title: 'Children',
    width: 168,
    id: 'children',
  },
];

interface ISortableItem {
  id: string;
  label: string;
  isActive: boolean;
}

const defaultActiveListItems = [
  'customerID',
  'state',
  'city',
  'zip',
  'totalSpend',
  'averageSpend',
  'totalTransactions',
  'averageNPS',
];

const defaultSortableList: ISortableItem[] = columnsData.map(el => {
  return {
    id: el.id,
    label: el.title,
    isActive: defaultActiveListItems.some(listItem => listItem === el.id),
  };
});

interface IInjectedProps {
  // getCustomers: () => Promise<void>;
  // customersFilters: any;
  // clearErrors: () => void;
}

interface IState {
  initiated: boolean;
  filtersIsVisible: boolean;
  sortableList: ISortableItem[];
  // filters: IFiltersState;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  // getCustomers: rootStore.customersStore.getCustomers,
  // customersFilters: rootStore.customersFilters,
  // clearErrors: rootStore.customersStore.clearErrors,
}))
@observer
class CustomersPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  async componentDidMount() {
    // await this.props.getCustomers();
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });
    this.setState({initiated: true});
  }

  componentWillUnmount() {
    // this.props.clearErrors();
  }

  getInitialState = (): IState => {
    return {
      initiated: false,
      filtersIsVisible: false,
      sortableList: defaultSortableList,
      // filters: {
      //   //TODO: customerId is text field
      //   customerId: {name: 'Customer ID', type: 'single', values: ['']},
      //   //city, state, zip should be handled by smarty streets autocomplete
      //   // city: {name: 'City', type: 'operator',operator:'greater', values: ['0','']},
      //   state: {name: 'State', type: 'multiple', options: US_STATES_SHORT, values: US_STATES_VALUES},
      //   // zip: {name: 'Zip', type: 'operator',operator:'greater', values: ['0','']},
      //   totalSpent: {name: 'Total Spent', type: 'operator', operator:'greater', values: ['0','']},
      //   totalTransactions: {name: 'Total Transactions', type: 'operator', operator:'greater', values: ['0','']},
      //   averageTicket: {name: 'Average Ticket', type: 'operator', operator:'greater', values: ['0','']},
      //   nps: {name: 'NPS', type: 'operator', operator:'greater', values: ['0','']},
      //   gender: {name: 'Gender', type: 'multiple', options: GENDER_TYPES,values: GENDER_TYPES_VALUES},
      //   age: {name: 'Age', type: 'operator', operator:'greater', values: ['0','']},
      //   relationship: {name: 'Relationship', type: 'multiple',options: RELATIONSHIP_TYPES, values: RELATIONSHIP_TYPES_VALUES},
      //   children: {name: 'Children', type: 'multiple',options: CHILDREN_TYPES, values: CHILDREN_TYPES_VALUES},
      // },
    };
  };

  handleApplySortableList = (sortableList: ISortableItem[]) => {
    this.setState({sortableList});
  };

  getColumns = (): ITableColumn[] => {
    const renderArray: ITableColumn[] = [];

    this.state.sortableList.forEach(column => {
      if (!column.isActive) return;
      renderArray.push({
        title: column.label,
        width: columnsData.find(item => item.title === column.label)?.width || 100,
      });
    });
    return renderArray;
  };

  getRows = (): string[][] => {
    return [
      getCustomerTest(),
      getCustomerTest(),
      getCustomerTest(),
      getCustomerTest(),
      getCustomerTest(),
      getCustomerTest(),
      getCustomerTest(),
      getCustomerTest(),
    ].reduce((acc, customer) => {
      return [
        ...acc,
        this.state.sortableList.reduce(
          (acc, column) => {
            if (!column.isActive || column.id === 'customerID') return acc;
            return [...acc, customer[column.id]];
          },
          [customer.customerID],
        ),
      ];
    }, []);
  };

  handleCloseFilters = () => this.setState({filtersIsVisible: false});
  handleOpenFilters = () => this.setState({filtersIsVisible: true});
  handleApplyFilters = filters => {
    // this.setState({filters: filters});
    //TODO: run customers request with chosen filters
    this.setState({filtersIsVisible: false});
  };

  render() {
    return (
      <CustomersPageLayout
        t={this.props.t}
        initiated={this.state.initiated}
        filtersIsVisible={this.state.filtersIsVisible}
        defaultSortableList={defaultSortableList}
        sortableList={this.state.sortableList}
        tableColumnsData={this.getColumns()}
        tableRowsData={this.getRows()}
        onApplySortableList={this.handleApplySortableList}
        // filters={this.state.filters}
        onFiltersOpen={this.handleOpenFilters}
        onFiltersApply={this.handleApplyFilters}
        onFiltersClose={this.handleCloseFilters}
      />
    );
  }
}

const CustomersPage = enhance(CustomersPageContainer, [withRouter, withTranslation()]);
export default CustomersPage;
