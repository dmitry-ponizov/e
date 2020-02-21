import React from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import Icon from 'components/Icon';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {RouteComponentProps, withRouter} from 'react-router';
import enhance from 'helpers/enhance';
import memoizeOne from 'memoize-one';
import ItemManager from 'components/ItemManager';
import Tooltip from 'components/Tooltip';
import TableManager from 'components/TableManager';

interface ITableItem {
  id: string;
  tableData: [string, string];
}

interface IInjectedProps {
  locations: ILocation[];
  selectedLocation: ILocation | null;
  selectLocation: (location: ILocation) => Promise<void>;
  toggleCreateModal: (value: boolean) => void;
  toggleDeleteModal: (value: boolean, locationsIds?: string[]) => void;
}

type SortType = 'name' | 'customers';

interface IState {
  searchQuery: string;
  selectedLocations: string[];
  sortAsc: boolean;
  sortType: SortType;
  activeLocationId: string | null;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  locations: rootStore.locationsStore.locations,
  selectedLocation: rootStore.locationsStore.selectedLocation,
  selectLocation: rootStore.locationsStore.selectLocation,
  toggleCreateModal: rootStore.locationsStore.toggleCreateModal,
  toggleDeleteModal: rootStore.locationsStore.toggleDeleteModal,
}))
@observer
class LocationsManagerBase extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      selectedLocations: [],
      activeLocationId: null,
      sortAsc: true,
      sortType: 'name',
    };
  }

  handleCreateLocation = () => {
    this.props.toggleCreateModal(true);
  };

  handleChangeSearch = searchQuery => {
    this.setState({
      searchQuery,
      selectedLocations: [],
    });
  };

  handleChooseItems = (selectedLocations: string[]) => {
    this.setState({selectedLocations});
  };

  handleChangeSort = (sortType: SortType) => {
    this.setState({
      sortType,
      sortAsc: this.state.sortType === sortType ? !this.state.sortAsc : true,
    });
  };

  handleSetActiveLocation = (locationID: string) => {
    const location: ILocation = this.props.locations.find(location => location.id === locationID)!;
    this.props.selectLocation(location);
  };

  handleDeleteLocation = () => {
    const {selectedLocations} = this.state;
    if (!selectedLocations.length) return;
    this.props.toggleDeleteModal(true, selectedLocations);
  };

  filterLocations = memoizeOne((locations, searchQuery) => {
    return this.props.locations.filter(location => {
      return location.name.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
    });
  });

  sortLocations = memoizeOne((locations, sortType, sortAsc) => {
    return [...locations].sort((a, b) => {
      if (sortType === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortType === 'customers') {
        // TODO: implement sort
        // return sortAsc ? a.customersNumber - b.customersNumber : b.customersNumber - a.customersNumber;
      }
      return 0;
    });
  });

  render() {
    const {t, locations, selectedLocation} = this.props;
    const {selectedLocations, sortAsc, sortType, searchQuery} = this.state;

    const filteredLocations = this.filterLocations(locations, searchQuery);
    const sortedLocations = this.sortLocations(filteredLocations, sortType, sortAsc);

    const getDataForTableManager: ITableItem[] = sortedLocations.map(item => {
      return {
        id: item.id,
        tableData: [item.name, item.value || 'N/A'],
      };
    });

    return (
      <ItemManager
        searchPlaceholder={t('Find location')}
        onChangeSearch={this.handleChangeSearch}
        onCreate={this.handleCreateLocation}
        actions={
          <Tooltip disabled={!!selectedLocations.length} content={t('Select location to delete')}>
            <div onClick={this.handleDeleteLocation}>
              <Icon name="delete" />
            </div>
          </Tooltip>
        }
      >
        <TableManager
          data={getDataForTableManager}
          choosedData={selectedLocations}
          currentItem={selectedLocation && selectedLocation.id}
          sortType={sortType}
          sortAsc={sortAsc}
          onChooseItems={this.handleChooseItems}
          onChangeSort={this.handleChangeSort}
          columns={[t('Name'), t('Associated Customers')]}
          onSetActiveItem={this.handleSetActiveLocation}
          noResultFoundMsg={t('No locations found.')}
        />
      </ItemManager>
    );
  }
}

const LocationsManager = enhance(LocationsManagerBase, [withRouter, withTranslation()]);
export default LocationsManager;
