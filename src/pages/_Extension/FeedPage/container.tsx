import React  from 'react';
import {inject, observer} from 'mobx-react';
import enhance from 'helpers/enhance';
import {IExtensionRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';
import FeedCustomerPageLayout from './layout';
import {ExtensionRoute} from 'constants/extensionRoutes';

interface IInjectedProps {
  getFeeds: () => Promise<void>;
  getFeedsError: string;
  getFeedsLoading: boolean;
  clearErrors: () => void;
  setRoute: (route: ExtensionRoute | null) => void;
}

interface IState {
  initiated: boolean;
  search: IFormFieldState;
  multiSelectFields: IMultiSelectFieldsState;
  checkboxFields: ICheckboxFieldsState;
  datePicker: IFormFieldState;
}

@inject((rootStore: IExtensionRootStore): IInjectedProps => ({
  getFeeds: rootStore.feedsStore.getFeeds,
  getFeedsError: rootStore.feedsStore.getFeedsError,
  getFeedsLoading: rootStore.feedsStore.getFeedsLoading,
  clearErrors: rootStore.feedsStore.clearErrors,
  setRoute: rootStore.simpleRouterStore.setRoute,
}))
@observer
class FeedPageContainer extends React.Component<IInjectedProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.selectedFeedDetails);
  }

  async componentDidMount() {
    // await this.props.getFeeds();
    this.setState({initiated: true});
  }


  getInitialState = (selectedFeedDetails: IFeedBusiness): IState => {
    return  {
      initiated: true,
      search: {
        value: '',
        error: '',
      },
      multiSelectFields: {
        groups: {
          values: [],
          error: '',
        },
        locations: {
          values: [],
          error: '',
        },
      },
      checkboxFields: {
        offer: true,
        reward: false,
        other: true,
        viewed: false,
        liked: false,
        favorites: true,
        shared: false,
        feedToEmail: false,
      },
      datePicker: {
        value: "Jan 5, 2020 - Jan 10, 2020",
        error: '',
      },

    }
  };

  handleSearchChange = (e) => {
    const {value} = e.target;
    this.setState({
      search: {
        value: value,
        error: ''
      }
    })
  };

  handleSelectChange = (name: string, values: string[]) => {
    this.setState({
      multiSelectFields: {
        ...this.state.multiSelectFields,
        [name]: {
          values,
          error: '',
        }
      }
    });
  };

  handleCheckboxChange = (value) => {
    const {name, checked} = value.target;
    this.setState({
      checkboxFields: {
        ...this.state.checkboxFields,
        [name]: checked,
      }
    });
  };

  handleDateChange = (name, readableValue) => {
    this.setState({
      datePicker: {
        ...this.state.datePicker,
        value: readableValue
      }
    });
  };

  handleClosePage = () => {
    this.props.setRoute(null);
  };

  render() {
    return (
      <FeedCustomerPageLayout
        t={this.props.t}
        search={this.state.search}
        checkboxFields={this.state.checkboxFields}
        datePicker={this.state.datePicker}
        handleSelectChange={this.handleSelectChange}
        handleCheckboxChange={this.handleCheckboxChange}
        handleSearchChange={this.handleSearchChange}
        handleDateChange={this.handleDateChange}
        handleClosePage={this.handleClosePage}
      />
    );
  }
}

const CustomerFeedPage = enhance(FeedPageContainer, [withTranslation()]);
export default CustomerFeedPage;
