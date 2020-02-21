import React from 'react';
import styles from 'components/ContentCard/styles.module.scss';
import {TFunction} from 'i18next';
import Link from 'components/Link';
import Icon from 'components/Icon';
import IconsList from 'components/IconsList';
import Button from 'components/Button';
import ImageUploader from 'components/ImageUploader';

interface ICardContent {
  name: string;
  logo: string;
  rules: string;
  expires: string;
  offerCode: number;
  image?: string;
}

interface ICardInfoBar {
  points: number;
  level: number;
  program: string;
  reward: string;
  next: string;
}

interface ICardMerchantData {
  title: string;
  name: string;
  address: string;
  phone: string;
  type: string;
  workTime: string;
}

interface IProps {
  t: TFunction;
  isLogoShow: boolean;
  isImageShow: boolean;
  cardContent: ICardContent;
  cardInfoBar: ICardInfoBar;
  cardSocialData: string[];
  cardMerchantData: ICardMerchantData;
  className?: string;

  // image upload
  isImageUploaded?: boolean;
  updateContentImageError?: string;
  updateContentImageLoading?: boolean;
  onChangeImage?: (imageUrl: string, image: File | null) => void;
  onUploadImage?: () => void;
}

const ContentCard: React.FC<IProps> = ({
  className,
  t,
  cardContent,
  isLogoShow,
  isImageShow,
  cardSocialData,
  cardMerchantData,
  onChangeImage,
  onUploadImage,
  isImageUploaded,
  updateContentImageError,
  updateContentImageLoading,
}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }

  return (
    <div className={containerClasses}>
      <div className={styles.containerHolder}>
        {isLogoShow && (
          <div className={styles.logoCol}>
            <div className={styles.logoColHolder}>
              <div className={styles.logo}>
                <div
                  className={styles.logoImage}
                  style={{backgroundImage: 'url(https://i.ibb.co/4Sj6vpn/logo-2x.jpg)'}}
                />
              </div>
            </div>
            <div className={styles.pointsBlock}>
              <div className={styles.points}>Points</div>
              <div className={styles.pointsAmount}>475</div>
            </div>
            <span className={styles.logoColBtn}>{t('Feedback')}</span>
            <span className={styles.logoColBtn}>{t('Dispute')}</span>
          </div>
        )}

        <div className={!isLogoShow && isImageShow ? styles.mainInfoFixedWidth : styles.mainInfoCol}>
          <span className={styles.locationName}>{cardMerchantData.title}</span>
          <span className={styles.infoItem}>
            <Icon name="pin" />
            {`${cardMerchantData.address} `}
            <Link className={styles.infoItemLink}>{t('View map')} →</Link>
          </span>
          <div className={styles.pointsContactBlock}>
            {!isLogoShow && (
              <div className={styles.pointsWithoutLogo}>
                <div className={styles.pointsBlock}>
                  <div className={styles.points}>Points</div>
                  <div className={styles.pointsAmount}>475</div>
                </div>
                <span className={styles.logoColBtn}>{t('Feedback')}</span>
                <span className={styles.logoColBtn}>{t('Dispute')}</span>
              </div>
            )}
            <div>
              <span className={styles.infoItem}>
                <Icon name="pin" />
                {cardMerchantData.phone}
              </span>
              <span className={styles.infoItem}>
                <Icon name="pin" />
                {cardMerchantData.type}
              </span>
              <span className={styles.infoItem}>
                <Icon name="pin" />
                Open Today <br />
                {cardMerchantData.workTime}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.contentCol}>
          <span className={styles.title}>{cardContent.name}</span>
          <div className={styles.rules}>{cardContent.rules}</div>
          <div className={styles.contentRow}>
            <div className={styles.contentItems}>
              <span className={styles.contentItem}>
                <strong>{t('Expires')}: </strong>
                {cardContent.expires}
              </span>
            </div>
            <span className={styles.contentItem}>
              <strong>{t('Offer Code')}: </strong>
              {cardContent.offerCode}
            </span>
          </div>
          <div className={styles.iconsList}>
            <IconsList values={cardSocialData} />
          </div>
          <div className={styles.contentActions}>
            <Button onClick={() => {}} className={styles.btnOrder}>
              <Icon name="pin" />
              {t('Order Now')}
            </Button>
            <Link className={styles.reportLink}>{t('Report Issue')}</Link>
          </div>
        </div>
        {isImageShow && (
          <div className={styles.imageCol}>
            <div className={styles.image} style={{backgroundImage: `url(${cardContent.image}`}}>
              <div className={styles.changeImageBtnWrapper}>
                <ImageUploader
                  t={t}
                  alt
                  url={cardContent.image || ''}
                  onUpload={onUploadImage!}
                  onChange={onChangeImage!}
                  error={updateContentImageError!}
                  loading={updateContentImageLoading!}
                  hasChanges={!isImageUploaded}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
