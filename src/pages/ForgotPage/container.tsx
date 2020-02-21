import React, {ChangeEvent, SyntheticEvent} from 'react';
import validateField from 'helpers/validator';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import ForgotPageLayout from 'pages/ForgotPage/layout';
import VP from 'constants/validationPatterns';
import {WithTranslation, withTranslation} from 'react-i18next';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';

interface IInjectedProps {
  resetPassword: (email: string) => Promise<void>;
  resetPasswordLoading: boolean;
  resetPasswordError: string;
  cleanErrors: () => void;
}

interface IState {
  email: IFormFieldState;
  step: '1' | '2';
  initiated: boolean;
}

@inject(
  (rootStore: IRootStore): IInjectedProps => ({
    resetPasswordError: rootStore.authStore.resetPasswordError,
    resetPasswordLoading: rootStore.authStore.resetPasswordLoading,
    resetPassword: rootStore.authStore.resetPassword,
    cleanErrors: rootStore.authStore.cleanErrors,
  }),
)
@observer
class ForgotPageContainer extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation> {
  state: IState = {
    email: {
      value: '',
      error: '',
    },
    step: '1',
    initiated: false,
  };

  componentDidMount() {
    setTimeout(() => this.setState({initiated: true}), 0);
  }

  componentWillUnmount(): void {
    this.props.cleanErrors();
  }

  isValid = (): boolean => {
    const emailError = validateField(VP.forgotPassword.email, this.state.email.value);

    this.setState({
      formMessage: '',
      email: {
        value: this.state.email.value,
        error: emailError,
      },
    });

    return !emailError;
  };

  handleChangeField = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    this.setState({
      [name]: {
        value: value,
        error: this.state[name].error,
      },
    });
  };

  handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!this.isValid()) return;

    await this.props.resetPassword(this.state.email.value);
    if (this.props.resetPasswordError) return;

    this.setState({step: '2'});
  };

  render() {
    return (
      <ForgotPageLayout
        t={this.props.t}
        history={this.props.history}
        email={this.state.email}
        resetPasswordError={this.props.resetPasswordError}
        step={this.state.step}
        resetPasswordLoading={this.props.resetPasswordLoading}
        initiated={this.state.initiated}
        onChangeField={this.handleChangeField}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

const ForgotPage = enhance(ForgotPageContainer, [withRouter, withTranslation()]);
export default ForgotPage;
