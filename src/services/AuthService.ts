import config from 'constants/config';
import {RequestMethod} from 'services/httpRequestMethods';
import transport, {ITransportResponse} from './transport';
import firebase from 'services/firebase';
import MESSAGES from 'constants/messages';
export interface ILoginRequestParams {
  email: string;
  password: string;
}

export interface ISignUpRequestParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUpdateAccountRequestParams {
  businessLegalName: string | null,
  businessWorkingName: string | null,
  entityType: string | null,
  title: string | null,
  businessFirstName: string | null,
  businessLastName: string | null,
  businessEmail: string | null,
  phone: string | null,
  phoneType: string | null,

  firstName: string | null,
  lastName: string | null,

  address1: string | null,
  address2: string | null,
  region: string | null,
  city: string | null,
  postalCode: string | null,
  latitude: string | null,
  longitude: string | null,
}

const AuthService = {
  login: async (params: ILoginRequestParams, autoLogin: boolean): Promise<string> => {
    const {email, password} = params;
    try {
      await firebase.setAutoLogin(autoLogin);
      await firebase.signIn(email, password);
    } catch (e) {
      switch (e.code) {
        case 'auth/user-not-found':
          return MESSAGES.userNotFound;
        case 'auth/wrong-password':
          return MESSAGES.incorrectPassword;
        default:
          return e.message
      }
    }
    return '';
  },

  logout: async (): Promise<string> => {
    try {
      await firebase.signOut();
    } catch (e) {
      return e.message;
    }
    return '';
  },

  signUp: async (params: ISignUpRequestParams): Promise<ITransportResponse> => {
    return await transport(`${config.API.URL}/account/account/merchant/sign-up`, {
      method: RequestMethod.POST,
      data: params,
    });
  },

  sendEmailVerification: async (): Promise<string> => {
    const user = firebase.auth!.currentUser;
    if (!user) {
      return 'USER_ERROR';
    }
    try {
      await user.sendEmailVerification();
      return '';
    } catch (e) {
      return e.message;
    }
  },

  resetPassword: async (email: string): Promise<string> => {
    try {
      await firebase.resetPassword(email);
    } catch (e) {
      return e.message;
    }
    return '';
  },

  getAccount: async (): Promise<ITransportResponse> => {
    return transport(`${config.API.URL}/account/account/profile`, {
      method: RequestMethod.GET,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
    });
  },

  updateAccount: async (id: string, data: Partial<IAccount>): Promise<ITransportResponse> => {

    return transport(`${config.API.URL}/account/rest/merchant-profiles/${id}`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
      },
      data,
    });
  },

  updateAccountLogo: async (id: string, logo: File | null): Promise<ITransportResponse> => {
    const formData = new FormData();
    formData.append('picture', logo || '');

    return transport(`${config.API.URL}/account/rest/merchant-profiles/${id}/file`, {
      method: RequestMethod.PATCH,
      headers: {
        Authorization: `Bearer ${await firebase.getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    });
  },
};

export default AuthService;
