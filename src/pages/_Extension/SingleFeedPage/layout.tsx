import * as React from 'react';
import ContentCard from 'components/ContentCard';
import { TFunction } from 'i18next';
import styles from 'pages/_Extension/SingleFeedPage/styles.module.scss';

interface ISingleFeedPageLayoutProps {
  t: TFunction;
}

const SingleFeedPageLayout: React.FunctionComponent<ISingleFeedPageLayoutProps> = ({t}) => {
  return (
    <div className={styles.container}>
      <ContentCard
        t={t}
        isImageShow={true}
        isLogoShow={true}
        cardContent={{
          name: '50 % OFF Any Large Deep Dish',
          logo: 'some path',
          rules: 'As Americans, we prefer things to be stuffed, like our bellies and out pizzas. Nancy’s Pizza offers you the trifecta, because you can get your fill without slicing.',
          expires: 'Sep 9, 2019',
          offerCode: 30040678,
        }}
        cardInfoBar={{
          points: 234,
          program: '$ 5.00 = 1 point',
          level: 555,
          reward: '10 % of next visit',
          next: '$ 15.00',
        }}
        cardSocialData={['49', '9', '13', '7']}
        cardMerchantData={{
          title: 'Nancy’s Pizza',
          name: 'Continent',
          address: '123 Providencia Street Anywhere, GA 00000',
          phone: '+1 888 452 1505',
          type: 'Restaurant',
          workTime: '9: 00 AM – 9:00 PM',
        }}
      />
    </div>);
};

export default SingleFeedPageLayout;
