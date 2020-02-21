import {action, observable} from 'mobx';
import AuthService, {ILoginRequestParams, ISignUpRequestParams} from 'services/AuthService';
import {User} from 'firebase';
import getErrorsFromResponse from 'helpers/getErrorsFromResponse';
import {accountAdapterIn, accountAdapterOut} from 'helpers/adapters/account';
import Toast from 'components/Toast';
import MESSAGES from 'constants/messages';

export class AuthStore {
  @observable
  isAuth = false;
  @observable
  ignoreListener = false;
  @observable
  account: IAccount | null = null;

  // LOGOUT -----------------------------------------------------------------------------------------------------------/
  @action
  logout = async (): Promise<void> => {
    await AuthService.logout();
    this.isAuth = false;
  };

  // LOGIN ------------------------------------------------------------------------------------------------------------/
  @observable
  loginLoading = false;
  @observable
  loginError = '';
  @action
  loginStart = () => {
    this.loginLoading = true;
    this.loginError = '';
  };
  @action
  preLogin = async (params: ILoginRequestParams, autoLogin: boolean): Promise<void> => {
    this.loginStart();
    const message = await AuthService.login(params, autoLogin);
    if (message) {
      this.loginLoading = false;
      this.loginError = message;
    }
  };
  @action
  login = async (user: User, role: UserRole): Promise<string> => {
    const accountTransport = await AuthService.getAccount();
    if (!accountTransport.success) {
      this.logout();
      this.loginLoading = false;
      return (this.loginError = accountTransport.message);
    }
    // set state
    this.isAuth = true;
    this.loginLoading = false;
    this.account = accountAdapterIn(user, accountTransport, role);
    console.log(`%c LOGGED AS: ${this.account.role}`, 'color: green; font-size: 20px;');
    return '';
  };

  // SIGN UP ----------------------------------------------------------------------------------------------------------/
  @observable
  signUpLoading = false;
  @observable
  signUpError = '';
  @action
  singUpStart = () => {
    this.signUpLoading = true;
    this.signUpError = '';
    this.ignoreListener = true;
  };
  @action
  signUp = async (params: ISignUpRequestParams): Promise<void> => {
    this.singUpStart();

    const signUpTransport = await AuthService.signUp(params);
    if (!signUpTransport.success) {
      this.signUpLoading = false;
      this.ignoreListener = false;
      this.signUpError = signUpTransport.message;
      return;
    }

    const loginMessage = await AuthService.login({email: params.email, password: params.password}, false);
    if (loginMessage) {
      this.signUpLoading = false;
      this.ignoreListener = false;
      this.signUpError = loginMessage;
      return;
    }

    const sendEmailMessage = await AuthService.sendEmailVerification();
    if (sendEmailMessage) {
      this.signUpLoading = false;
      this.ignoreListener = false;
      this.signUpError = sendEmailMessage;
      return;
    }

    await AuthService.logout();

    this.signUpLoading = false;
    this.ignoreListener = false;
    this.signUpError = '';
  };

  // RESET PASSWORD ---------------------------------------------------------------------------------------------------/
  @observable
  resetPasswordLoading = false;
  @observable
  resetPasswordError = '';
  @action
  resetPasswordStart = () => {
    this.resetPasswordLoading = true;
    this.resetPasswordError = '';
  };
  @action
  resetPassword = async (email: string): Promise<void> => {
    this.resetPasswordStart();

    this.resetPasswordError = await AuthService.resetPassword(email);
    this.resetPasswordLoading = false;
  };

  // UPDATE ACCOUNT ---------------------------------------------------------------------------------------------------/
  @observable
  updateAccountLoading = false;
  @observable
  updateAccountError = '';
  @action
  updateAccountStart = () => {
    this.updateAccountLoading = true;
    this.updateAccountError = '';
  };
  @action
  updateAccount = async (id: string, account: Partial<IAccount>): Promise<void> => {
    this.updateAccountStart();
    const transport = await AuthService.updateAccount(id, accountAdapterOut(account));
    if (!transport.success) {
      this.updateAccountLoading = false;
      this.updateAccountError = getErrorsFromResponse(transport);
      Toast.show(this.updateAccountError, {type: 'danger'});
      return;
    }
    this.account = {
      ...this.account!,
      ...account,
    };
    this.updateAccountLoading = false;
    Toast.show(MESSAGES.ACCOUNT.updateSuccess, {type: 'success'});
  };

  // UPDATE ACCOUNT LOGO ----------------------------------------------------------------------------------------------/
  @action
  updateAccountLogo = async (id: string, file: File | null): Promise<void> => {
    this.updateAccountStart();
    const transport = await AuthService.updateAccountLogo(id, file);

    if (!transport.success) {
      this.updateAccountLoading = false;
      this.updateAccountError = getErrorsFromResponse(transport);
      Toast.show(this.updateAccountError, {type: 'danger'});
      return;
    }
    this.account = {
      ...this.account!,
      logo: transport.response.data.picture,
    };
    this.updateAccountLoading = false;
    Toast.show(MESSAGES.ACCOUNT.updateSuccess, {type: 'success'});
  };

  cleanErrors = () => {
    this.loginError = '';
    this.resetPasswordError = '';
    this.signUpError = '';
    this.updateAccountError = '';
  };
}

const authStore = new AuthStore();
export default authStore;
