import {User} from 'firebase';
import {ITransportResponse} from 'services/transport';
import {IUpdateAccountRequestParams} from 'services/AuthService';

export const accountAdapterIn = (user: User, transport: ITransportResponse, role: UserRole): IAccount => {
  const account = transport.response.data;
  return {
      id: account.id,
      businessId: account.businessId,
      role,

      logo: account.picture,
      businessLegalName: account.businessLegalName,
      businessWorkingName: account.businessWorkingName,
      entityType: account.entityType,
      title: account.title,
      businessFirstName: account.businessFirstName,
      businessLastName: account.businessLastName,
      businessEmail: account.businessEmail,
      phone: account.phone,
      phoneType: account.phoneType,

      firstName: account.firstName,
      lastName: account.lastName,
      email: user.email!,

      address1: account.address1,
      address2: account.address2,
      state: account.region,
      city: account.city,
      zipCode: account.postalCode,
      latitude: account.latitude,
      longitude: account.longitude,
    }
};

export const accountAdapterOut = (account: Partial<IAccount>): IUpdateAccountRequestParams => {
  return {
      businessLegalName: account.businessLegalName || null,
      businessWorkingName: account.businessWorkingName || null,
      entityType: account.entityType || null,
      title: account.title || null,
      businessFirstName: account.businessFirstName || null,
      businessLastName: account.businessLastName || null,
      businessEmail: account.businessEmail || null,
      phone: account.phone || null,
      phoneType: account.phoneType || null,

      firstName: account.firstName || null,
      lastName: account.lastName || null,

      address1: account.address1 || null,
      address2: account.address2 || null,
      region: account.state || null,
      city: account.city || null,
      postalCode: account.zipCode || null,
      latitude: account.latitude || null,
      longitude: account.longitude || null,
    }
};
