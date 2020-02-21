import React from 'react';
import styles from 'pages/RedemptionPage/styles.module.scss';
import {TFunction} from 'i18next';
import ContentWrapper from 'components/ContentWrapper';
import Icon from 'components/Icon';
import Button from 'components/Button';
import Link from 'components/Link';
import IconsList from 'components/IconsList';

interface IProps {
  t: TFunction;
}

const RedemptionPageLayout: React.FunctionComponent<IProps> = ({t}) => {
  return (
    <ContentWrapper title={t('Offers / Rewards Validation / Redemption')}>
      <div className={styles.paper}>
        <div className={styles.codeBox}>
          <Icon name="gift" className={styles.cbIcon} />
          <label className={styles.cbLabel}>{t('Offer / Reward Code')}</label>
          <input className={styles.cbInput} placeholder="000000011" />
          <Button onClick={() => {}} className={styles.btnGo}>
            {t('Go')}
            <Icon name="arrow-right" />
          </Button>
        </div>
        <div className={styles.rightBlock}>
          <div className={styles.rbHeading}>
            <span className={`${styles.hCode} ${styles.hCodeActive}`}>000000011</span>
            {/*<Button onClick={() => {}} className={styles.btnRedeem}>*/}
            {/*  <Icon name="percent" />*/}
            {/*  {t('Redeem')}*/}
            {/*</Button>*/}
            {/*<Button onClick={() => {}} className={`${styles.btnRedeem} ${styles.btnRedeemDisabled}`}>*/}
            {/*  <Icon name="percent" />*/}
            {/*  {t('Redeem')}*/}
            {/*</Button>*/}
            <Button onClick={() => {}} className={`${styles.btnRedeem} ${styles.btnRedeemActive}`}>
              <Icon name="percent" />
              {t('Redeem')}
            </Button>
          </div>
          <div className={styles.rewardCard}>
            <div className={styles.rcHolder}>
              <div className={styles.rcContent}>
                <span className={styles.rcHead}>Reward / Offer</span>
                <span className={styles.rcTitle}>10 % of Next Purchase</span>
                <span className={styles.dataLine}>
                  <strong>Expires:</strong> <span className={styles.dlActive}>Dec 31, 2019</span>
                </span>
                <span className={styles.dataLine}>
                  <strong>Offer Code:</strong> <span>000000011</span>
                </span>
                <span className={styles.dataLine}>
                  <strong>Redeemed:</strong> <span>Sep 4, 2019, 1:13 PM</span>
                </span>
              </div>
              <div className={styles.rcFooter}>
                <IconsList values={['0', '1', '2', '3', '4']} />
                <Link onClick={() => {}} className={styles.reportLink}>
                  Report Issue
                </Link>
              </div>
            </div>
            <div className={styles.imageHolder}>
              <Icon name="image" className={styles.imagePlaceholder} />
              <span className={styles.phText}>No image</span>
            </div>
          </div>
          <div className={styles.rewardCard}>
            <div className={styles.rcHolder}>
              <div className={styles.rcContent}>
                <span className={styles.rcHead}>50 % OFF Any Large Deep Dish</span>
                <p className={styles.desc}>
                  As Americans, we prefer things to be stuffed, like our bellies, our wallets, and out pizzas. Nancy’s
                  Pizza offers you the trifecta, because you can get your fill without slicing away at your wallet.
                </p>
                <div className={styles.twoColumns}>
                  <div className={styles.colLeft}>
                    <span className={styles.dataLine}>
                      <strong>Expires:</strong> <span>Dec 31, 2019</span>
                    </span>
                    <span className={styles.dataLine}>
                      <strong>Offer Code:</strong> <span>000000011</span>
                    </span>
                  </div>
                  <div className={styles.colRight}>
                    <IconsList values={['0', '1', '2', '3', '4']} />
                  </div>
                </div>
              </div>
              <div className={styles.rcFooter}>
                <Button className={styles.btnOrder}>
                  <Icon name="pin" />
                  Order Now
                </Button>
                <Link onClick={() => {}} className={styles.reportLink}>
                  Report Issue
                </Link>
              </div>
            </div>
            <div
              className={styles.imageHolder}
              style={{
                backgroundImage:
                  'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgEyO6_B3SZ8xJwTChOWW7euroAJ1nRMtg_W6VTHqNWoqt3lGnrA&s)',
              }}
            />
          </div>
          <div className={styles.noResults}>
            <Icon name="search" className={styles.nrIcon} />
            <span className={styles.nrMessage}>{t('Sorry, no results for "003406000"')}</span>
            <span className={styles.nrSub}>{t('Try enter another code')}</span>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default RedemptionPageLayout;
