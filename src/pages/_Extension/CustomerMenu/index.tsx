import React from 'react';
import {inject, observer} from 'mobx-react';
import enhance from 'helpers/enhance';
import {IExtensionRootStore} from 'stores';
import styles from 'pages/_Extension/CustomerMenu/styles.module.scss';
import {withTranslation, WithTranslation} from 'react-i18next';
import Icon, {IconName} from 'components/Icon';
import {ExtensionRoute} from 'constants/extensionRoutes';

interface IInjectedProps {
  activeRoute: ExtensionRoute | null;
  setRoute: (route: ExtensionRoute | null) => void;
}

@inject(
  (rootStore: IExtensionRootStore): IInjectedProps => ({
    activeRoute: rootStore.simpleRouterStore.activeRoute,
    setRoute: rootStore.simpleRouterStore.setRoute,
  }),
)
@observer
class CustomerMenuBase extends React.Component<IInjectedProps & WithTranslation> {
  render() {
    const {t, activeRoute, setRoute} = this.props;

    const renderItem = (
      itemRoute: ExtensionRoute,
      icon: JSX.Element,
      text: string,
    ) => {
      return (
        <div
          className={`${styles.menuItem}${activeRoute === itemRoute ? ' ' + styles.menuItemActive : ''}`}
          onClick={() => setRoute(itemRoute)}
        >
          {icon}
          {text}
        </div>
      );
    };

    return (
      <div className={styles.menu}>
        <div className={styles.container}>
          {renderItem(
            ExtensionRoute.INSIGHTS,
            <Icon name={'grid'} />,
            t('Insights')
          )}
          {renderItem(
            ExtensionRoute.FEED,
            <Icon name={'feed'} />,
            t('Feed')
          )}
          {renderItem(
            ExtensionRoute.MESSAGES,
            <Icon name={'message'} style={{fontSize: 16}} />,
            t('Messages')
          )}
          {renderItem(
            ExtensionRoute.MERCHANTS,
            <Icon name={'customers'} />,
            t('Merchants')
          )}
          {renderItem(
            ExtensionRoute.SETTINGS,
            <Icon name={'settings'} />,
            t('Settings')
          )}
          <div className={styles.statusIcon}>
            <Icon name="cloud" className={styles.iconCloud} />
            <Icon name="check" className={styles.iconCheck} />
          </div>
        </div>
      </div>
    );
  }
}

const CustomerMenu = enhance(CustomerMenuBase, [withTranslation()]);
export default CustomerMenu;
