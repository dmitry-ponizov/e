import {ITransportResponse} from 'services/transport';
import {
  IUpdateLocationContactRequestData,
  IUpdateLocationProcessingInfoRequestData,
  IUpdateLocationProfileRequestData,
} from 'services/LocationsService';
import config from 'constants/config';
import moment from 'moment';

export const locationContactAdapterIn = (transport: ITransportResponse): ILocationContact => {
  const contact = transport.response.data.data[0];
  return {
    id: contact.id,
    locationId: contact.businessId,

    logo: contact.picture,
    businessName: contact.businessName,
    firstName: contact.firstName,
    lastName: contact.lastName,
    title: contact.title,
    email: contact.businessEmail,
    phone: contact.phone,
    phoneType: contact.phoneType,

    address1: contact.address1,
    address2: contact.address2,
    city: contact.city,
    state: contact.region,
    zipCode: contact.postalCode,
    latitude: contact.latitude,
    longitude: contact.longitude,
  };
};

export const locationContactAdapterOut = (contact: Partial<ILocationContact>): IUpdateLocationContactRequestData => {
  return {
    businessName: contact.businessName || null,
    firstName: contact.firstName || null,
    lastName: contact.lastName || null,
    title: contact.title || null,
    businessEmail: contact.email || null,
    phone: contact.phone || null,
    phoneType: contact.phoneType || null,

    address1: contact.address1 || null,
    address2: contact.address2 || null,
    city: contact.city || null,
    region: contact.state || null,
    postalCode: contact.zipCode || null,
    latitude: contact.latitude || null,
    longitude: contact.longitude || null,
  };
};

export const locationProfileAdapterIn = (transport: ITransportResponse): ILocationProfile => {
  const profile = transport.response.data.data[0];
  return {
    id: profile.id,
    locationId: profile.locationId,
    naics: profile.naicsCode,
    sic: profile.sicCode,
    mcc: profile.mccCode,
    description: profile.description,
    entityType: profile.entityType,
    channelType: profile.channelType,
    locationType: profile.locationType,
    locationOpenedAt: profile.locationOpenedAt,
    numberOfEmployees: profile.numberOfEmployees,
    timeZone: profile.timeZone,
  };
};

export const locationProfileAdapterOut = (profile: Partial<ILocationProfile>): IUpdateLocationProfileRequestData => {
  return {
    naicsCode: profile.naics,
    sicCode: profile.sic,
    mccCode: profile.mcc,
    description: profile.description,
    entityType: profile.entityType,
    channelType: profile.channelType,
    locationType: profile.locationType,
    locationOpenedAt: profile.locationOpenedAt
      ? moment(profile.locationOpenedAt, config.COMMON.dateFormat).format('YYYY-MM-DD') + 'T00:00:00.000Z'
      : null,
    numberOfEmployees: profile.numberOfEmployees,
    timeZone: profile.timeZone,
  };
};

export const locationProcessingInfoAdapterIn = (
  transport: ITransportResponse,
  paymentSystem,
): ILocationProcessingInfo => {
  const processingInfo = transport.response.data.data.find(info => info.paymentSystem === paymentSystem);
  return {
    id: processingInfo.id,
    locationId: processingInfo.locationId,
    paymentSystem: processingInfo.paymentSystem,

    merchantId: processingInfo.merchantId,
    acquirer: processingInfo.acquirer,
    frontEndProcessor: processingInfo.frontEndProcessor,
    backEndProcessor: processingInfo.backEndProcessor,

    name: processingInfo.name,
    city: processingInfo.city,
    state: processingInfo.region,
    zipCode: processingInfo.postalCode,

    logo: processingInfo.picture,
  };
};

export const locationProcessingInfoAdapterOut = (
  processingInfo: Partial<ILocationProcessingInfo>,
): IUpdateLocationProcessingInfoRequestData => {
  return {
    frontEndProcessor: processingInfo.frontEndProcessor || null,
    backEndProcessor: processingInfo.backEndProcessor || null,
    name: processingInfo.name || null,
    city: processingInfo.city || null,
    region: processingInfo.state || null,
    postalCode: processingInfo.zipCode || null,
  };
};
