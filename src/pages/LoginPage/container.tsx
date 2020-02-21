import React, {ChangeEvent, SyntheticEvent} from 'react';
import {withTranslation, WithTranslation} from 'react-i18next';
import {inject, observer} from 'mobx-react';
import validateField from 'helpers/validator';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import config from 'constants/config';
import LoginPageLayout from 'pages/LoginPage/layout';
import VP from 'constants/validationPatterns';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';
import {ILoginRequestParams} from 'services/AuthService';

interface IInjectedProps {
  loginLoading: boolean;
  loginError: string;
  preLogin: (params: ILoginRequestParams, autoLogin: boolean) => Promise<void>;
  cleanErrors: () => void;
}

interface IState {
  textFields: ITextFieldsState;
  remember: boolean;
  formMessage: string;
  loading: boolean;
  initiated: boolean;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  loginError: rootStore.authStore.loginError,
  loginLoading: rootStore.authStore.loginLoading,
  preLogin: rootStore.authStore.preLogin,
  cleanErrors: rootStore.authStore.cleanErrors,
}))
@observer
class LoginPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  state: IState = {
    textFields: {
      email: {
        value: config.TEST_USER.email,
        error: '',
      },
      password: {
        value: config.TEST_USER.password,
        error: '',
      },
    },
    remember: true,
    initiated: false,
    formMessage: '',
    loading: false,
  };

  componentDidMount() {
    setTimeout(() => this.setState({initiated: true}), 0);
  }

  componentWillUnmount(): void {
    this.props.cleanErrors();
  }

  isValid = () => {
    const {textFields} = this.state;
    const {email, password} = textFields;

    const emailError = validateField(VP.login.email, email.value);
    const passwordError = validateField(VP.login.password, password.value);

    this.setState({
      formMessage: '',
      textFields: {
        ...textFields,
        email: {
          value: email.value,
          error: emailError,
        },
        password: {
          value: password.value,
          error: passwordError,
        },
      },
    });

    return !(emailError || passwordError);
  };

  handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    const {textFields} = this.state;
    const {name, value} = e.target;

    this.setState({
      textFields: {
        ...textFields,
        [name]: {
          value: value,
          error: '',
        },
      },
    });
  };

  handleChangeRemember = () => {
    this.setState({
      remember: !this.state.remember,
    });
  };

  handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isValid()) return;

    this.props.preLogin(
      {
        email: this.state.textFields.email.value,
        password: this.state.textFields.password.value,
      },
      this.state.remember,
    );
  };

  render() {
    return (
      <LoginPageLayout
        t={this.props.t}
        initiated={this.state.initiated}
        history={this.props.history}
        email={this.state.textFields.email}
        password={this.state.textFields.password}
        remember={this.state.remember}
        loginLoading={this.props.loginLoading}
        loginError={this.props.loginError}
        onChangeField={this.handleChangeField}
        onChangeRemember={this.handleChangeRemember}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const LoginPage = enhance(LoginPageContainer, [withRouter, withTranslation()]);
export default LoginPage;
