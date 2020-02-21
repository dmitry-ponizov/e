import React from 'react';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import LocationsPageLayout from 'pages/LocationsPage/layout';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {withTranslation, WithTranslation} from 'react-i18next';

interface IInjectedProps {
  activeLocationTab: LocationTabType;
  selectedLocationDetails: ILocationDetails | null;
  selectLocationLoading: boolean;
  getLocations: (params?: IPaginationRequestParams) => Promise<void>;
  getLocationsError: string;
  getLocationsLoading: boolean;
  clearErrors: () => void;
}

interface IState {
  initiated: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    activeLocationTab: rootStore.locationsStore.activeLocationTab,
    selectedLocationDetails: rootStore.locationsStore.selectedLocationDetails,
    selectLocationLoading: rootStore.locationsStore.selectLocationLoading,
    getLocations: rootStore.locationsStore.getLocations,
    getLocationsError: rootStore.locationsStore.getLocationsError,
    getLocationsLoading: rootStore.locationsStore.getLocationsLoading,
    clearErrors: rootStore.locationsStore.clearErrors,
  }),
)
@observer
class LocationsPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      initiated: false,
    };
  }

  async componentDidMount() {
    await this.props.getLocations({
      sort: 'name,ASC',
    });
    this.setState({initiated: true});
  }

  componentWillUnmount() {
    this.props.clearErrors();
  }

  render() {
    return (
      <LocationsPageLayout
        t={this.props.t}
        activeLocationTab={this.props.activeLocationTab}
        selectedLocationDetails={this.props.selectedLocationDetails}
        selectLocationLoading={this.props.selectLocationLoading}
        initiated={this.state.initiated}
      />
    );
  }
}

const LocationsPage = enhance(LocationsPageContainer, [withRouter, withTranslation()]);
export default LocationsPage;
