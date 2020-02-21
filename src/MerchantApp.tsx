import React from 'react';
import {Redirect, RouteComponentProps, Switch} from 'react-router';
import {Route, withRouter} from 'react-router-dom';
import ROUTES, {CUSTOMER_ROUTES, MERCHANT_ROUTES, PRIVATE_ROUTES} from 'router/routes';
import UIPage from 'pages/UIPage';
import Header from 'containers/Header';
import 'firebase/auth';
import enhance from 'helpers/enhance';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import firebase from 'services/firebase';
import AppLoader from 'components/AppLoader';
import {Unsubscribe, User} from 'firebase';
import Toast from 'components/Toast';
import {WithTranslation, withTranslation} from 'react-i18next';
import GroupsPage from 'pages/GroupsPage/container';
import CustomersPage from 'pages/CustomersPage/container';
import ContentPage from 'pages/ContentPage/container';
import FeedPage from 'pages/FeedPage/container';
import RedemptionPage from 'pages/RedemptionPage/container';
import MessagesPage from 'pages/MessagesPage/container';
import LocationsPage from 'pages/LocationsPage/container';
import RewardsPage from './pages/RewardsPage/container';
import AccountPage from 'pages/AccountPage/container';
import LoginPage from 'pages/LoginPage/container';
import SignUpPage from 'pages/SignUpPage/container';
import ForgotPage from 'pages/ForgotPage/container';
import Intercom from 'libs/intercom';
import CustomerMerchantPage from 'pages/_Extension/MerchantPage/container';
import SettingsContainer from 'pages/_Extension/SettingsPage/container';
import CustomerFeedPage from 'pages/_Extension/FeedPage/container';
import CustomerFeedSinglePage from './pages/_Extension/SingleFeedPage/container';

interface IInjectedProps {
  ignoreListener: boolean;
  account: IAccount;
  isAuth: boolean;
  login: (user: User, role: UserRole) => Promise<string>;
  logout: () => void;
}

@inject((rootStore: IRootStore): IInjectedProps => ({
  account: rootStore.authStore.account!,
  isAuth: rootStore.authStore.isAuth,
  login: rootStore.authStore.login,
  logout: rootStore.authStore.logout,
  ignoreListener: rootStore.authStore.ignoreListener,
}))
@observer
class MerchantAppBase extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation> {
  firebaseAuthStateListener: Unsubscribe | null = null;

  state = {
    initiated: false,
  };

  intercomInitiated = false;

  componentDidMount() {
    this.firebaseAuthStateListener = firebase.auth!.onAuthStateChanged(async user => {
      if (this.props.ignoreListener) return;

      if (user) {
        console.log(user);
        const getIdTokenResponse = await user.getIdTokenResult();
        const { role } = getIdTokenResponse.claims;
        const message = await this.props.login(user, role);
        if (!message && (this.props.location.pathname === '/' || this.props.location.pathname === ROUTES.LOGIN)) {
          this.props.history.push(role === 'MERCHANT' ? ROUTES.ACCOUNT : ROUTES.CUSTOMER_SETTINGS);
        }
      } else {
        await this.props.logout();
        this.props.history.push(ROUTES.LOGIN);
      }

      if (this.state.initiated) return;
      this.setState({initiated: true});
    });
  }

  componentDidUpdate() {
    if (!this.intercomInitiated && this.props.account && this.props.account.role === 'MERCHANT') {
      Intercom.init();
    }
  }

  render() {
    const {location, isAuth, t} = this.props;
    const {initiated} = this.state;
    const hasMerchantAccess = this.props.account && this.props.account.role === 'MERCHANT';
    const hasCustomerAccess = this.props.account && this.props.account.role === 'CUSTOMER';
    const isPrivateRoute = PRIVATE_ROUTES.some(route => location.pathname.indexOf(route) > -1);
    const isMerchantRoute = MERCHANT_ROUTES.some(route => location.pathname.indexOf(route) > -1);
    const isCustomerRoute = CUSTOMER_ROUTES.some(route => location.pathname.indexOf(route) > -1);

    if (!initiated) {
      return <AppLoader text={t('Initializing...')} />;
    }

    if (
      (initiated && isPrivateRoute && !isAuth) ||
      (isMerchantRoute && !hasMerchantAccess) ||
      (isCustomerRoute && !hasCustomerAccess)
    ) {
      return <Redirect to={ROUTES.LOGIN} />;
    }

    return (
      <>
        {isPrivateRoute && isMerchantRoute && <Header />}
        <Switch>
          <Route exact path={'/'} component={LoginPage} />
          <Route path={ROUTES.LOGIN} component={LoginPage} />
          <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPage} />
          <Route path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route path={ROUTES.LOCATIONS} component={LocationsPage} />
          <Route path={ROUTES.REWARDS} component={RewardsPage} />
          <Route path={ROUTES.GROUPS} component={GroupsPage} />
          <Route path={ROUTES.CUSTOMERS} component={CustomersPage} />
          <Route path={ROUTES.CONTENT} component={ContentPage} />
          <Route path={ROUTES.FEED} component={FeedPage} />
          <Route path={ROUTES.REDEMPTION} component={RedemptionPage} />
          <Route path={ROUTES.MESSAGES} component={MessagesPage} />

          {process.env.NODE_ENV === 'development' && <Route path={ROUTES.UI} component={UIPage} />}

          <Route path={ROUTES.CUSTOMER_MESSAGES} component={MessagesPage} />
          <Route path={ROUTES.CUSTOMER_MERCHANTS} component={CustomerMerchantPage} />
          <Route path={ROUTES.CUSTOMER_SETTINGS} component={SettingsContainer} />
          <Route path={ROUTES.CUSTOMER_FEED} component={CustomerFeedPage} />`
          <Route path={`${ROUTES.CUSTOMER_FEED_SINGLE}/:id`} component={CustomerFeedSinglePage} />`
        </Switch>

        <Toast />
      </>
    );
  }
}

const MerchantApp = enhance(MerchantAppBase, [withRouter, withTranslation()]);

export default MerchantApp;
