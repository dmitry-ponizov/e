interface IAccount {
  id: string;
  businessId: string;
  role: UserRole;

  logo: string | null;
  businessLegalName: string | null;
  businessWorkingName: string | null;
  entityType: string | null;
  title: string | null;
  businessFirstName: string | null;
  businessLastName: string | null;
  businessEmail: string | null;
  phone: string | null;
  phoneType: string | null;

  firstName: string | null;
  lastName: string | null;
  email: string;

  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  latitude: string | null;
  longitude: string | null;
}

type UserRole = 'MERCHANT' | 'CUSTOMER';
