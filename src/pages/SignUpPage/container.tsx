import React, {ChangeEvent, SyntheticEvent} from 'react';
import validateField from 'helpers/validator';
import {ISignUpRequestParams} from 'services/AuthService';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import SignUpPageLayout from 'pages/SignUpPage/layout';
import VP from 'constants/validationPatterns';
import {withTranslation, WithTranslation} from 'react-i18next';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';

interface IInjectedProps {
  signUp: (params: ISignUpRequestParams) => Promise<void>;
  signUpLoading: boolean;
  signUpError: string;
  cleanErrors: () => void;
}

interface IState {
  textFields: ITextFieldsState;
  initiated: boolean;
  isRegistered: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    signUp: rootStore.authStore.signUp,
    signUpLoading: rootStore.authStore.signUpLoading,
    signUpError: rootStore.authStore.signUpError,
    cleanErrors: rootStore.authStore.cleanErrors,
  }),
)
@observer
class SignUpPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  state: IState = {
    textFields: {
      firstName: {
        value: '',
        error: '',
      },
      lastName: {
        value: '',
        error: '',
      },
      email: {
        value: '',
        error: '',
      },
      password: {
        value: '',
        error: '',
      },
      confirmPassword: {
        value: '',
        error: '',
      },
    },
    isRegistered: false,
    initiated: false,
  };

  componentDidMount() {
    setTimeout(() => this.setState({initiated: true}), 0);
  }

  componentWillUnmount(): void {
    this.props.cleanErrors();
  }

  isValid = (): boolean => {
    const {textFields} = this.state;
    const {firstName, lastName, email, password, confirmPassword} = textFields;

    const firstNameError = validateField(VP.signUp.firstName, firstName.value);
    const lastNameError = validateField(VP.signUp.lastName, lastName.value);
    const emailError = validateField(VP.signUp.email, email.value);
    const passwordError = validateField(VP.signUp.password, password.value);
    const confirmPasswordError = validateField(VP.signUp.confirmPassword(password.value), confirmPassword.value);

    this.setState({
      textFields: {
        ...textFields,
        firstName: {
          value: firstName.value,
          error: firstNameError,
        },
        lastName: {
          value: lastName.value,
          error: lastNameError,
        },
        email: {
          value: email.value,
          error: emailError,
        },
        password: {
          value: password.value,
          error: passwordError,
        },
        confirmPassword: {
          value: confirmPassword.value,
          error: confirmPasswordError,
        },
      },
    });

    return !(firstNameError || lastNameError || emailError || passwordError || confirmPasswordError);
  };

  handleChangeTextField = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    const {textFields} = this.state;

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

  handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isValid()) return;

    const {firstName, lastName, email, password} = this.state.textFields;

    const {signUp} = this.props;
    await signUp({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
    });

    if (this.props.signUpError) return;
    this.setState({isRegistered: true});
  };

  render() {
    return (
      <SignUpPageLayout
        t={this.props.t}
        history={this.props.history}
        initiated={this.state.initiated}
        textFields={this.state.textFields}
        signUpLoading={this.props.signUpLoading}
        signUpError={this.props.signUpError}
        isRegistered={this.state.isRegistered}
        onChangeTextField={this.handleChangeTextField}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const SignUpPage = enhance(SignUpPageContainer, [withRouter, withTranslation()]);
export default SignUpPage;
