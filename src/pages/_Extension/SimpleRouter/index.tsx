import React from 'react';
import {inject} from 'mobx-react';
import {IExtensionRootStore} from 'stores';
import {ExtensionRoute} from 'constants/extensionRoutes';
import ExtensionPageModal from 'components/ExtensionPageModal';
import CustomerFeedPage from 'pages/_Extension/FeedPage/container';
import CustomerMerchantPage from 'pages/_Extension/MerchantPage/container';
import MessagesPage from 'pages/MessagesPage/container';
import SettingsPage from 'pages/_Extension/SettingsPage/container';

interface IInjectedProps {
  activeRoute?: ExtensionRoute | null;
}

@inject(
  (rootStore: IExtensionRootStore): IInjectedProps => ({
    activeRoute: rootStore.simpleRouterStore.activeRoute,
  }),
)
class SimpleRouter extends React.Component<IInjectedProps> {
  render() {
    const {activeRoute} = this.props;
    let page;

    switch (activeRoute) {
      case ExtensionRoute.INSIGHTS:
        page = <div>Insights</div>;
        break;
      case ExtensionRoute.FEED:
        page = <CustomerFeedPage />;
        break;
      case ExtensionRoute.MERCHANTS:
        page = <CustomerMerchantPage />;
        break;
      case ExtensionRoute.MESSAGES:
        page = <MessagesPage />;
        break;
      case ExtensionRoute.SETTINGS:
        page = <SettingsPage />;
        break;
      default:
        page = null;
    }

    return !!page && <ExtensionPageModal>{page}</ExtensionPageModal>;
  }
}

export default SimpleRouter;
