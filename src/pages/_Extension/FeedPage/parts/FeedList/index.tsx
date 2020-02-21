import React, {ChangeEvent} from 'react';
import Icon from 'components/Icon';
import styles from 'pages/_Extension/FeedPage/parts/FeedList/styles.module.scss';
import NewDatePicker from 'components/NewDatePicker';
import ContentCard from 'components/ContentCard';
import {TFunction} from 'i18next';
import {ICardConfig, ICardContent, ICardMerchantData, ICardInfoBar} from '../../types';

interface IProps {
  search: IFormFieldState;
  datePicker: IFormFieldState;
  handleSearchChange: (e: ChangeEvent) => void;
  handleDateChange: (name: string, value: string) => void;
  t: TFunction;
  cardConfig: ICardConfig;
  cardContent: ICardContent;
  cardInfoBar: ICardInfoBar;
  cardSocialData: string[];
  cardMerchantData: ICardMerchantData;
}

const FeedList: React.FunctionComponent<IProps> = ({
  search,
  handleSearchChange,
  datePicker,
  handleDateChange,
  t,
  cardConfig,
  cardContent,
  cardInfoBar,
  cardSocialData,
  cardMerchantData,
}) => {
  return (
    <div className={styles.contentBox}>
      <div className={styles.contentHeader}>
        <div className={styles.search}>
          <Icon className={styles.searchIcon} name="search" />
          <input
            name="searchQuery"
            placeholder={t('Search')}
            value={search.value}
            type="search"
            className={styles.searchField}
            onChange={handleSearchChange}
          />
        </div>
        <NewDatePicker
          t={t => t}
          name="datePicker"
          splitter={' - '}
          value={datePicker.value}
          onChange={handleDateChange}
        />
      </div>
      <div className={styles.feedList}>
        <div className={styles.contentCard}>
          <ContentCard
            t={t}
            isImageShow={cardConfig.isImageShow}
            isLogoShow={cardConfig.isLogoShow}
            cardContent={cardContent}
            cardInfoBar={cardInfoBar}
            cardSocialData={cardSocialData}
            cardMerchantData={cardMerchantData}
          />
        </div>
        <div className={styles.contentCard}>
          <ContentCard
            t={t}
            isImageShow={cardConfig.isImageShow}
            isLogoShow={cardConfig.isLogoShow}
            cardContent={cardContent}
            cardInfoBar={cardInfoBar}
            cardSocialData={cardSocialData}
            cardMerchantData={cardMerchantData}
          />
        </div>
        <div className={styles.contentCard}>
          <ContentCard
            t={t}
            isImageShow={cardConfig.isImageShow}
            isLogoShow={cardConfig.isLogoShow}
            cardContent={cardContent}
            cardInfoBar={cardInfoBar}
            cardSocialData={cardSocialData}
            cardMerchantData={cardMerchantData}
          />
        </div>
      </div>
    </div>
  );
};

export default FeedList;
