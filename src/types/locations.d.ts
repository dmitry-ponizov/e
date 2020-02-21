interface ILocation {
  id: string;
  name: string;
}

interface ILocationDetails {
  id: string;
  name: string;
  contact: ILocationContact;
  profile: ILocationProfile;
  operations: ILocationOperation[];
  integrations: ILocationIntegration[];
  vm: ILocationProcessingInfo;
  ae: ILocationProcessingInfo;
  dc: ILocationProcessingInfo;
}

interface ILocationContact {
  id: string;
  locationId: string;

  logo: string | null;
  businessName: string | null;
  firstName: string | null;
  lastName: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  phoneType: string | null;

  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  latitude: string | null;
  longitude: string | null;
}

interface ILocationProfile {
  id: string;
  locationId: string;

  naics: string | null;
  sic: string | null;
  mcc: string | null;
  description: string | null;
  entityType: string | null;
  channelType: string | null;
  locationType: string | null;
  locationOpenedAt: string | null;
  numberOfEmployees: number | null;
  timeZone: number | null;
}

interface ILocationProcessingInfo {
  id: string;
  locationId: string;
  paymentSystem: string;

  merchantId: string | null;
  acquirer: string | null;
  frontEndProcessor: string | null;
  backEndProcessor: string | null;
  logo: string | null;

  name: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
}

interface ILocationOperation {
  id: string;
  locationId: string;
  dayOfWeek: string;
  startTime: string | null;
  endTime: string | null;
  isClosed: boolean;
}

interface ILocationIntegration {
  id: string;
  value: string | null;
  socialChannel: string;
}

type LocationTabType =
  | 'contact'
  | 'profile'
  | 'operation'
  | 'integrations'
  | 'visa-mastercard'
  | 'american-express'
  | 'discover';

type PaymentSystem = 'vm' | 'ae' | 'dc';
