import React from 'react';
import {inject, observer} from 'mobx-react';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import CustomerMerchantPagePageLayout from './layout';
import {IconName} from 'components/Icon';
// import {US_STATES_SHORT, US_STATES_VALUES} from 'constants/usStates';
// import CHILDREN_TYPES, {CHILDREN_TYPES_VALUES} from "constants/childrenTypes";
// import RELATIONSHIP_TYPES, {RELATIONSHIP_TYPES_VALUES} from "constants/relationshipTypes";
// import GENDER_TYPES from "constants/genderTypes";

interface ITableColumn {
  title: string;
  width: number;
}

interface IColumnsData extends ITableColumn {
  id: string;
}

const columnsData: IColumnsData[] = [
  //  https://docs.google.com/spreadsheets/d/1BRFlpfmNF4RF5jJz_4dr0B8EbDTNLWwSgO33qCuhZKU/edit#gid=853134233
  // Merchant
  {
    title: 'Business Name',
    width: 244,
    id: 'businessName',
  },

  // Contact
  {
    title: 'Location Name',
    width: 190,
    id: 'locationName',
  },
  {
    title: 'Contact First Name',
    width: 200,
    id: 'contactFirstName',
  },
  {
    title: 'Contact Last Name',
    width: 200,
    id: 'contactLastName',
  },
  {
    title: 'Job Title',
    width: 132,
    id: 'jobTitle',
  },
  {
    title: 'Email',
    width: 154,
    id: 'email',
  },
  {
    title: 'Phone Number',
    width: 144,
    id: 'phoneNumber',
  },
  {
    title: 'Phone Type',
    width: 114,
    id: 'phoneType',
  },
  {
    title: 'Address 1',
    width: 156,
    id: 'address1',
  },
  {
    title: 'Address 2',
    width: 156,
    id: 'address2',
  },
  {
    title: 'State',
    width: 66,
    id: 'state',
  },
  {
    title: 'City',
    width: 124,
    id: 'city',
  },
  {
    title: 'Zip',
    width: 84,
    id: 'zip',
  },
  {
    title: 'NAICS Code',
    width: 168,
    id: 'NAICSCode',
  },
  {
    title: 'NAICS Description',
    width: 168,
    id: 'NAICSDescription',
  },
  {
    title: 'SIC Code',
    width: 168,
    id: 'SICCode',
  },
  {
    title: 'SIC Description',
    width: 168,
    id: 'SICDescription',
  },
  {
    title: 'MCC Code',
    width: 168,
    id: 'MCCCode',
  },
  {
    title: 'MCC Description',
    width: 168,
    id: 'MCCDescription',
  },
  {
    title: 'Merchant Description',
    width: 168,
    id: 'merchantDescription',
  },
  {
    title: 'Date Opened',
    width: 168,
    id: 'dateOpened',
  },
  // Transactions
  {
    title: 'Total Spend',
    width: 168,
    id: 'totalSpend',
  },
  {
    title: 'Highest Spend',
    width: 168,
    id: 'highestSpend',
  },
  {
    title: 'Lowest Spend',
    width: 168,
    id: 'lowestSpend',
  },
  {
    title: 'Avarage Spend',
    width: 168,
    id: 'averageSpend',
  },
  {
    title: 'Total Transactions',
    width: 168,
    id: 'totalTransactions',
  },
  {
    title: 'Last Transactions',
    width: 168,
    id: 'lastTransactions',
  },
  // Net Promotor Score
  {
    title: 'Highest NPS',
    width: 168,
    id: 'highestNPS',
  },
  {
    title: 'Lowest NPS',
    width: 168,
    id: 'lowestNPS',
  },
  {
    title: 'Last NPS',
    width: 168,
    id: 'lastNPS',
  },
  {
    title: 'Average NPS',
    width: 168,
    id: 'averageNPS',
  },
  // Points
  {
    title: 'Total Points',
    width: 168,
    id: 'totalPoints',
  },
  {
    title: 'Current Points',
    width: 92,
    id: 'currentPoints',
  },
  {
    title: 'Last Reward',
    width: 168,
    id: 'lastReward',
  },
  // Communication
  {
    title: 'Total Feedback',
    width: 168,
    id: 'totalFeedback',
  },
  {
    title: 'Last Feedback',
    width: 168,
    id: 'lastFeedback',
  },
  {
    title: 'Total Disputes',
    width: 168,
    id: 'totalDisputes',
  },
  {
    title: 'Last Dispute',
    width: 168,
    id: 'lastDispute',
  },
  {
    title: 'Total Messages',
    width: 168,
    id: 'totalMessages',
  },
  {
    title: 'Last Message',
    width: 168,
    id: 'lastMessage',
  },

  // Content
  {
    title: 'Total Views',
    width: 168,
    id: 'totalViews',
  },
  {
    title: 'Last View',
    width: 168,
    id: 'lastView',
  },
  {
    title: 'Total Likes',
    width: 168,
    id: 'totalLikes',
  },
  {
    title: 'Last Like',
    width: 168,
    id: 'lastLike',
  },
  {
    title: 'Total Comments',
    width: 168,
    id: 'totalComments',
  },
  {
    title: 'Last Comment',
    width: 168,
    id: 'lastComment',
  },
  {
    title: 'Total Shares',
    width: 168,
    id: 'totalShares',
  },
  {
    title: 'Last Share',
    width: 168,
    id: 'lastShare',
  },
];

interface IStyledColumn {
  id: string;
  tableIndex: number;
  tooltip: string;
  iconName: IconName;
}

const styledColumns: IStyledColumn[] = [
  {
    id: 'email',
    tableIndex: 0,
    tooltip: 'Write Email',
    iconName: 'arrow-down',
  },
  {
    id: 'locationName',
    tableIndex: 0,
    tooltip: 'View Map',
    iconName: 'share',
  },
];

interface ISortableItem {
  id: string;
  label: string;
  isActive: boolean;
}

const defaultActiveListItems = [
  'businessName',
  'locationName',
  'phoneNumber',
  'address1',
  'address2',
  'state',
  'city',
  'zip',
  'currentPoints',
  'email', // temporary, DELETE from this list after check Styles
];

const defaultSortableList: ISortableItem[] = columnsData.map(el => {
  return {
    id: el.id,
    label: el.title,
    isActive: defaultActiveListItems.some(listItem => listItem === el.id),
  };
});

interface IProps {
  getCustomers: () => Promise<void>;
  customersFilters: any;
  clearErrors: () => void;
}

interface IState {
  initiated: boolean;
  filtersIsVisible: boolean;
  sortableList: ISortableItem[];
  // filters: IFiltersState;
}

interface ILocationData {
  [key: string]: string;
}

interface IMerchantItem {
  businessName: string | JSX.Element;
  locations: ILocationData[];
}

const devGetLocations = (): ILocationData[] => {
  const getRandomArbitrary = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
  };
  let locationNumber = getRandomArbitrary(1, 7);
  const locations: ILocationData[] = [];
  const getLocations = () => {
    if (locationNumber - 1 < 0) return [...locations];
    locationNumber -= 1;
    locations.push({
      city: 'Mineapolise',
      state: 'GA',
      zip: `18902`,
      totalSpend: `totalSpend ${Math.random()}`,
      totalTransactions: `totalTransactions ${Math.random()}`,
      averageTicket: `averageTicket ${Math.random()}`,
      nps: `nps ${Math.random()}`,
      jobTitle: `jobTitle ${Math.random()}`,
      dataOpened: `dataOpened ${Math.random()}`,
      locationName: `Location ${getRandomArbitrary(1, 5).toFixed(0)}`,
      email: `merchant@gmail.com`,
      phoneNumber: `+${getRandomArbitrary(1000000000, 9999999999).toFixed(0)}`,
      address1: '4515 Bastin Drive',
      address2: '23423 street, 342 number',
      currentPoints: `${getRandomArbitrary(1, 999).toFixed(0)}`,
    });
    return getLocations();
  };

  return getLocations();
};

const getCustomerTestWithLocation = (): IMerchantItem => {
  return {
    businessName: `${Math.random()}`,
    locations: devGetLocations(),
  };
};

@inject((rootStore: IRootStore) => ({}))
@observer
class CustomerMerchantPageContainer extends React.Component<IProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  async componentDidMount() {
    // await this.props.getCustomers();
    // await new Promise(resolve => {
    //   setTimeout(resolve, 0);
    // });
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
        width: columnsData.find(col => col.title === column.label)?.width || 100,
      });
    });
    return renderArray;
  };

  getRows = (): (string | JSX.Element)[][][] => {
    return [
      getCustomerTestWithLocation(),
      getCustomerTestWithLocation(),
      getCustomerTestWithLocation(),
      getCustomerTestWithLocation(),
      getCustomerTestWithLocation(),
      getCustomerTestWithLocation(),
      getCustomerTestWithLocation(),
      getCustomerTestWithLocation(),
    ].reduce((acc, merchant) => {
      return [
        ...acc,
        merchant.locations.map((location, i) => {
          return this.state.sortableList.reduce(
            (acc, column) => {
              if (!column.isActive || column.id === 'businessName') return acc;
              if (i !== 0) acc[0] = '';
              return [...acc, location[column.id]];
            },
            [merchant.businessName],
          );
        }),
      ];
    }, []);
  };

  getStyledColumns = () => {
    const onlyActiveSortableItems = this.state.sortableList.filter(sortableItem => sortableItem.isActive);

    return styledColumns.map(styledCell => {
      onlyActiveSortableItems.forEach((activeItem, i) => {
        if (activeItem.id === styledCell.id) {
          return (styledCell.tableIndex = i);
        }
      });
      return styledCell;
    });
  };

  handleStartChat = () => {};

  handleCloseFilters = () => this.setState({filtersIsVisible: false});
  handleOpenFilters = () => this.setState({filtersIsVisible: true});
  handleApplyFilters = filters => {
    // this.setState({filters: filters});
    //TODO: run customers request with chosen filters
    this.setState({filtersIsVisible: false});
  };

  render() {
    return (
      <CustomerMerchantPagePageLayout
        t={this.props.t}
        initiated={this.state.initiated}
        styledColumns={this.getStyledColumns()}
        filtersIsVisible={this.state.filtersIsVisible}
        defaultSortableList={defaultSortableList}
        sortableList={this.state.sortableList}
        tableColumnsData={this.getColumns()}
        tableRowsData={this.getRows()}
        onStartChat={this.handleStartChat}
        onApplySortableList={this.handleApplySortableList}
        // filters={this.state.filters}
        onFiltersOpen={this.handleOpenFilters}
        onFiltersApply={this.handleApplyFilters}
        onFiltersClose={this.handleCloseFilters}
      />
    );
  }
}

const CustomerMerchantPage = enhance(CustomerMerchantPageContainer, [withTranslation()]);
export default CustomerMerchantPage;
