import {action, observable} from 'mobx';
import LocationsService, {ICreateLocationRequestData} from 'services/LocationsService';
import PAYMENT_SYSTEM from 'constants/paymentSystem';
import Toast from 'components/Toast';
import MESSAGES from 'constants/messages';
import getErrorsFromResponse from 'helpers/getErrorsFromResponse';
import {
  locationContactAdapterIn,
  locationContactAdapterOut,
  locationProcessingInfoAdapterIn,
  locationProcessingInfoAdapterOut,
  locationProfileAdapterIn,
  locationProfileAdapterOut,
} from 'helpers/adapters/location';

export class LocationsStore {
  @observable
  locations: ILocation[] = [];

  // TABS -------------------------------------------------------------------------------------------------------------/
  @observable
  activeLocationTab: LocationTabType = 'contact';
  @action
  setActiveLocationTab = (activeLocationTab: LocationTabType) => {
    this.activeLocationTab = activeLocationTab;
  };

  // MODALS -----------------------------------------------------------------------------------------------------------/
  @observable
  createModalIsActive = false;
  @observable
  deleteModalIsActive = false;
  @action
  toggleCreateModal = (value: boolean) => {
    this.createModalIsActive = value;
  };
  @action
  toggleDeleteModal = (value: boolean, locationsIds?: string[]) => {
    if (locationsIds) {
      this.requestedToDeleteLocations = locationsIds;
    }
    this.deleteModalIsActive = value;
  };

  // GET LOCATIONS ----------------------------------------------------------------------------------------------------/
  @observable
  getLocationsLoading = false;
  @observable
  getLocationsError = '';
  @action
  getLocationsStart = () => {
    this.getLocationsLoading = true;
    this.getLocationsError = '';
  };
  @action
  getLocations = async (params?: IPaginationRequestParams): Promise<void> => {
    this.getLocationsStart();
    const transport = await LocationsService.getLocations(params);
    if (!transport.success) {
      this.getLocationsLoading = false;
      this.getLocationsError = getErrorsFromResponse(transport);
      Toast.show(this.getLocationsError, {type: 'danger'});
      return;
    }
    this.locations = transport.response.data.data;
    this.getLocationsLoading = false;

    if (this.locations.length) {
      this.selectLocation(this.locations[0]);
    }
  };

  // SELECT LOCATION --------------------------------------------------------------------------------------------------/
  @observable
  selectedLocation: ILocation | null = null;
  @observable
  selectedLocationDetails: ILocationDetails | null = null;
  @observable
  selectLocationLoading = false;
  @observable
  selectLocationError = '';
  @action
  selectLocationStart = (location: ILocation) => {
    this.selectedLocation = location;
    this.selectedLocationDetails = null;
    this.selectLocationLoading = true;
    this.selectLocationError = '';
  };
  @action
  selectLocation = async (location: ILocation): Promise<void> => {
    this.selectLocationStart(location);

    const transports = await Promise.all([
      LocationsService.getLocationBusiness(location.id),
      LocationsService.getLocationProcessingInfo(location.id),
      LocationsService.getLocationOperations(location.id),
      LocationsService.getLocationIntegrations(location.id),
    ]);

    // prevent errors when user reselect fast
    if (!this.selectedLocation || this.selectedLocation.id !== location.id) return;

    const failedTransport = transports.find(transport => !transport.success);
    if (failedTransport) {
      this.selectLocationLoading = false;
      this.selectLocationError = getErrorsFromResponse(failedTransport);
      Toast.show(this.selectLocationError, {type: 'danger'});
      return;
    }

    this.selectedLocationDetails = {
      ...location,
      contact: locationContactAdapterIn(transports[0]),
      profile: locationProfileAdapterIn(transports[0]),
      operations: transports[2].response.data.data,
      integrations: transports[3].response.data.data,
      vm: locationProcessingInfoAdapterIn(transports[1], PAYMENT_SYSTEM.VM),
      ae: locationProcessingInfoAdapterIn(transports[1], PAYMENT_SYSTEM.AE),
      dc: locationProcessingInfoAdapterIn(transports[1], PAYMENT_SYSTEM.DC),
    };
    this.selectLocationLoading = false;
  };

  // CREATE LOCATION --------------------------------------------------------------------------------------------------/
  @observable
  createLocationLoading = false;
  @observable
  createLocationError = '';
  @action
  createLocationStart = () => {
    this.createLocationLoading = true;
    this.createLocationError = '';
  };
  @action
  createLocation = async (data: ICreateLocationRequestData): Promise<void> => {
    this.createLocationStart();
    const transport = await LocationsService.createLocation(data);
    if (!transport.success) {
      this.createLocationLoading = false;
      this.createLocationError = getErrorsFromResponse(transport);
      Toast.show(this.createLocationError, {type: 'danger'});
      return;
    }
    this.locations = [
      ...this.locations,
      {
        id: transport.response.data.id,
        name: data.name,
      },
    ];
    this.createModalIsActive = false;
    this.createLocationLoading = false;
  };

  // DELETE LOCATION --------------------------------------------------------------------------------------------------/
  @observable
  deleteLocationLoading = false;
  @observable
  deleteLocationError = '';
  @observable
  requestedToDeleteLocations: string[] = [];
  @action
  deleteLocationsStart = () => {
    this.deleteLocationLoading = true;
    this.deleteLocationError = '';
  };
  @action
  deleteLocations = async (): Promise<void> => {
    console.log({deleting: this.requestedToDeleteLocations.length});
    if (!this.requestedToDeleteLocations.length) return;
    this.deleteLocationsStart();

    const transport = await LocationsService.deleteLocations(this.requestedToDeleteLocations);
    if (!transport.success) {
      this.deleteLocationLoading = false;
      this.deleteLocationError = getErrorsFromResponse(transport);
      Toast.show(this.deleteLocationError, {type: 'danger'});
      return;
    }

    this.locations = this.locations.filter(location => this.requestedToDeleteLocations.indexOf(location.id) === 0);
    this.requestedToDeleteLocations = [];
    this.deleteModalIsActive = false;
    this.deleteLocationLoading = false;
  };

  // UPDATE LOCATION CONTACT ------------------------------------------------------------------------------------------/
  @observable
  updateLocationLoading = false;
  @observable
  updateLocationError = '';
  @action
  updateLocationStart = () => {
    this.updateLocationLoading = true;
    this.updateLocationError = '';
  };
  @action
  updateLocationContact = async (businessId: string, data: Partial<ILocationContact>): Promise<void> => {
    this.updateLocationStart();
    const transport = await LocationsService.updateLocationBusiness(businessId, locationContactAdapterOut(data));
    if (!transport.success) {
      this.updateLocationLoading = false;
      this.updateLocationError = getErrorsFromResponse(transport);
      Toast.show(this.updateLocationError, {type: 'danger'});
      return;
    }

    this.selectedLocationDetails = {
      ...this.selectedLocationDetails!,
      contact: {
        ...this.selectedLocationDetails!.contact,
        ...data,
      },
    };
    this.updateLocationLoading = false;
    Toast.show(MESSAGES.LOCATIONS.updateSuccess, {type: 'success'});
  };

  // UPDATE LOCATION CONTACT LOGO -------------------------------------------------------------------------------------/
  @action
  updateLocationContactLogo = async (id: string, url: string, file: File | null): Promise<void> => {
    this.updateLocationStart();
    const transport = await LocationsService.updateLocationContactLogo(id, file);
    if (!transport.success) {
      this.updateLocationLoading = false;
      this.updateLocationError = getErrorsFromResponse(transport);
      Toast.show(this.updateLocationError, {type: 'danger'});
      return;
    }

    this.selectedLocationDetails = {
      ...this.selectedLocationDetails!,
      contact: {
        ...this.selectedLocationDetails!.contact,
        logo: transport.response.data.picture,
      },
    };
    this.updateLocationLoading = false;
    Toast.show(MESSAGES.LOCATIONS.updateSuccess, {type: 'success'});
  };

  // UPDATE LOCATION PROFILE ------------------------------------------------------------------------------------------/
  @action
  updateLocationProfile = async (businessId: string, data: Partial<ILocationProfile>): Promise<void> => {
    this.updateLocationStart();
    const transport = await LocationsService.updateLocationBusiness(businessId, locationProfileAdapterOut(data));
    if (!transport.success) {
      this.updateLocationLoading = false;
      this.updateLocationError = getErrorsFromResponse(transport);
      Toast.show(this.updateLocationError, {type: 'danger'});
      return;
    }

    this.selectedLocationDetails = {
      ...this.selectedLocationDetails!,
      profile: {
        ...this.selectedLocationDetails!.profile,
        ...data,
      },
    };
    this.updateLocationLoading = false;
    Toast.show(MESSAGES.LOCATIONS.updateSuccess, {type: 'success'});
  };

  // UPDATE LOCATION PROCESSING INFO ----------------------------------------------------------------------------------/
  @action
  updateLocationProcessingInfo = async (
    paymentSystem: string,
    data: Partial<ILocationProcessingInfo>,
  ): Promise<void> => {
    this.updateLocationStart();
    const transport = await LocationsService.updateLocationProcessingInfo(
      this.selectedLocationDetails![paymentSystem].id,
      locationProcessingInfoAdapterOut(data),
    );
    if (!transport.success) {
      this.updateLocationLoading = false;
      this.updateLocationError = getErrorsFromResponse(transport);
      Toast.show(this.updateLocationError, {type: 'danger'});
      return;
    }

    this.selectedLocationDetails = {
      ...this.selectedLocationDetails!,
      [paymentSystem]: {...this.selectedLocationDetails![paymentSystem], ...data},
    };
    this.updateLocationLoading = false;
    Toast.show(MESSAGES.LOCATIONS.updateSuccess, {type: 'success'});
  };

  // UPDATE LOCATION PROCESSING INFO LOGO -----------------------------------------------------------------------------/
  @action
  updateLocationProcessingInfoLogo = async (paymentSystem: PaymentSystem, file: File | null): Promise<void> => {
    this.updateLocationStart();
    const transport = await LocationsService.updateLocationProcessingInfoLogo(
      this.selectedLocationDetails![paymentSystem].id,
      file,
    );
    if (!transport.success) {
      this.updateLocationLoading = false;
      this.updateLocationError = getErrorsFromResponse(transport);
      Toast.show(this.updateLocationError, {type: 'danger'});
      return;
    }

    this.selectedLocationDetails = {
      ...this.selectedLocationDetails!,
      [paymentSystem]: {
        ...this.selectedLocationDetails![paymentSystem],
        logo: transport.response.data.picture,
      },
    };
    this.updateLocationLoading = false;
    Toast.show(MESSAGES.LOCATIONS.updateSuccess, {type: 'success'});
  };

  // UPDATE LOCATION OPERATIONS ---------------------------------------------------------------------------------------/
  @action
  updateLocationOperations = async (operations: Partial<ILocationOperation>[]): Promise<void> => {
    this.updateLocationStart();
    const transport = await LocationsService.updateLocationOperations(operations);
    if (!transport.success) {
      this.updateLocationLoading = false;
      this.updateLocationError = getErrorsFromResponse(transport);
      Toast.show(this.updateLocationError, {type: 'danger'});
      return;
    }

    this.selectedLocationDetails = {
      ...this.selectedLocationDetails!,
      operations: this.selectedLocationDetails!.operations.map(operation => {
        const updated = operations.find(o => o.id === operation.id);
        if (updated) {
          return {
            ...operation,
            ...updated,
          };
        } else {
          return operation;
        }
      }),
    };
    this.updateLocationLoading = false;
    Toast.show(MESSAGES.LOCATIONS.updateSuccess, {type: 'success'});
  };

  // UPDATE LOCATION INTEGRATIONS -------------------------------------------------------------------------------------/
  @action
  updateLocationIntegrations = async (integrations: Partial<ILocationIntegration>[]): Promise<void> => {
    this.updateLocationStart();
    const transport = await LocationsService.updateLocationIntegrations(integrations);
    if (!transport.success) {
      this.updateLocationLoading = false;
      this.updateLocationError = getErrorsFromResponse(transport);
      Toast.show(this.updateLocationError, {type: 'danger'});
      return;
    }

    this.selectedLocationDetails = {
      ...this.selectedLocationDetails!,
      integrations: this.selectedLocationDetails!.integrations.map(integration => {
        const updated = integrations.find(i => i.id === integration.id);
        if (updated) {
          return {
            ...integration,
            ...updated,
          };
        } else {
          return integration;
        }
      }),
    };
    this.updateLocationLoading = false;
    Toast.show(MESSAGES.LOCATIONS.updateSuccess, {type: 'success'});
  };

  clearErrors = () => {
    this.getLocationsError = '';
    this.createLocationError = '';
    this.deleteLocationError = '';
    this.updateLocationError = '';
  };
}

const locationsStore = new LocationsStore();
export default locationsStore;
