import {ITransportResponse} from 'services/transport';

export const groupsGetAdapterIn = (transport: ITransportResponse): IGroup[] => {
  return transport.response.data.data.map(group => {
    return {
      id: group.id,
      name: group.name,
      businessId: group.businessId,
      priority: group.priority,
      customers: '',
    };
  });
};

export const groupsUpdateAdapterIn = (transport: ITransportResponse): IGroup => {
  const {id, name, businessId, priority} = transport.response.data;
  return {
    id,
    name,
    businessId,
    priority,
    customers: '',
  };
};

export const groupsFiltersAdapterIn = (transport: ITransportResponse): IGroupField[] => {
  return transport.response.data.filters.map(filter => {
    return {
      name: filter.field,
      conditions: filter.conditions,
    };
  });
};

export const groupsCreateAdapterIn = (transport: ITransportResponse): IGroup => {
  const {id, name, businessId, priority} = transport.response.data;
  return {
    id,
    name,
    businessId,
    priority,
    customers: '',
  };
};

export const groupsUpdateAdapterOut = (filters: IGroupField[]): IGroupUpdateRequestData => {
  return {
    filters: filters.map(filter => {
      return {
        field: filter.name,
        conditions: filter.conditions,
      };
    }),
  };
};
