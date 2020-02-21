import React, {useState} from 'react';
import styles from 'containers/Header/styles.module.scss';
import Icon from 'components/Icon';
import ROUTES from 'router/routes';
import {RouteComponentProps, withRouter} from 'react-router';
import {useTranslation} from 'react-i18next';
import Link from 'components/Link';
import enhance from 'helpers/enhance';
import PageContainer from 'components/PageContainer';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import MediaQuery from 'react-responsive';
import MEDIA_BREAKPOINTS from 'constants/mediaBreakpoints';
import AccountMenu from 'components/AccountMenu';

interface IProps {
  logout: () => Promise<void>;
  account: IAccount;
}

const getNavLinkClasses = (currentRoute: string, linkRoute: string): string => {
  let classes = styles.navLink;
  if (currentRoute === linkRoute) {
    classes += ` ${styles.active}`;
  }
  return classes;
};

const HeaderBase: React.FC<IProps & RouteComponentProps> = ({location, history, logout, account}) => {
  const [active, setActive] = useState<boolean>(false);
  const {t} = useTranslation();
  const route = location.pathname;

  const handleMenuItemClick = route => () => {
    history.push(route);
    setActive(false);
  };

  const headerLinks = (
    <>
      <Link className={styles.menuLink} onClick={handleMenuItemClick(ROUTES.REDEMPTION)}>
        <Icon className={styles.linkIcon} name="bar-code" />
        {t('Validation')}
      </Link>
    </>
  );

  const accountLinks = (
    <>
      <Link className={getNavLinkClasses(route, ROUTES.ACCOUNT)} onClick={handleMenuItemClick(ROUTES.ACCOUNT)}>
        <Icon className={styles.linkIcon} name="account" />
        {t('My Account')}
      </Link>
      <Link className={styles.navLink} onClick={logout}>
        <Icon className={styles.linkIcon} name="exit" />
        {t('Log Out')}
      </Link>
    </>
  );

  const navigationLinks = (
    <>
      <Link className={getNavLinkClasses(route, ROUTES.LOGIN)} onClick={handleMenuItemClick(ROUTES.LOGIN)}>
        <Icon className={styles.linkIcon} name="grid" />
        {t('Insights')}
      </Link>
      <Link className={getNavLinkClasses(route, ROUTES.FEED)} onClick={handleMenuItemClick(ROUTES.FEED)}>
        <Icon className={styles.linkIcon} name="feed" />
        {t('Feed')}
      </Link>
      <Link className={getNavLinkClasses(route, ROUTES.MESSAGES)} onClick={handleMenuItemClick(ROUTES.MESSAGES)}>
        <Icon className={styles.linkIcon} name="message" style={{fontSize: 16}} />
        {t('Messages')}
      </Link>
      <Link className={getNavLinkClasses(route, ROUTES.CONTENT)} onClick={handleMenuItemClick(ROUTES.CONTENT)}>
        <Icon className={styles.linkIcon} name="pencil" />
        {t('Content')}
      </Link>
      <Link className={getNavLinkClasses(route, ROUTES.REWARDS)} onClick={handleMenuItemClick(ROUTES.REWARDS)}>
        <Icon className={styles.linkIcon} name="star" />
        {t('Rewards')}
      </Link>
      <Link className={getNavLinkClasses(route, ROUTES.CUSTOMERS)} onClick={handleMenuItemClick(ROUTES.CUSTOMERS)}>
        <Icon className={styles.linkIcon} name="customers" />
        {t('Customers')}
      </Link>
      <Link className={getNavLinkClasses(route, ROUTES.GROUPS)} onClick={handleMenuItemClick(ROUTES.GROUPS)}>
        <Icon className={styles.linkIcon} name="groups" />
        {t('Groups')}
      </Link>
      <Link className={getNavLinkClasses(route, ROUTES.LOCATIONS)} onClick={handleMenuItemClick(ROUTES.LOCATIONS)}>
        <Icon className={styles.linkIcon} name="pin" />
        {t('Locations')}
      </Link>
    </>
  );

  let menuContainerClasses = styles.menuContainer;
  if (active) {
    menuContainerClasses += ` ${styles.menuActive}`;
  }

  return (
    <header className={styles.header}>
      <PageContainer className={styles.panel}>
        <img className={styles.logo} src={require('assets/images/logo-engage-color.svg')} alt="Engage" />
        <div className={styles.right}>
          <MediaQuery minDeviceWidth={MEDIA_BREAKPOINTS.md}>
            {headerLinks}
            <div className={styles.separator} />
            <AccountMenu
              name={account.firstName || ''}
              image={account.logo || ''}
              content={callback => (
                <>
                  <div
                    className={styles.accountItem}
                    onClick={() => {
                      history.push(ROUTES.ACCOUNT);
                      callback();
                    }}
                  >
                    <Icon name="account" className={styles.aiIcon} />
                    <span>{t('My Account')}</span>
                  </div>
                  <div
                    className={styles.accountItem}
                    onClick={() => {
                      logout();
                      callback();
                    }}
                  >
                    <Icon name="exit" className={styles.aiIcon} />
                    <span>{t('Log Out')}</span>
                  </div>
                </>
              )}
            />
          </MediaQuery>
          <MediaQuery maxDeviceWidth={MEDIA_BREAKPOINTS.md - 1}>
            <div className={menuContainerClasses}>
              <div className={styles.opener} onClick={() => setActive(!active)}>
                <span />
              </div>
              <div className={styles.overlay} onClick={() => setActive(false)} />
              <div className={styles.menu}>
                <div className={styles.menuClose}  onClick={() => setActive(false)} />
                {navigationLinks}
                <div className={styles.menuSeparator} />
                {accountLinks}
                <div className={styles.menuSeparator} />
                {headerLinks}
              </div>
            </div>
          </MediaQuery>
        </div>
      </PageContainer>
      <MediaQuery minDeviceWidth={MEDIA_BREAKPOINTS.md}>
        <nav className={styles.navigation}>
          <PageContainer className={styles.bar}>{navigationLinks}</PageContainer>
        </nav>
      </MediaQuery>
    </header>
  );
};

const Header = enhance(HeaderBase, [
  inject((rootStore: IRootStore) => ({
    account: rootStore.authStore.account!,
    logout: rootStore.authStore.logout,
  })),
  observer,
  withRouter,
]);
export default Header;
