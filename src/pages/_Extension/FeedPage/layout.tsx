import React, {ChangeEvent} from 'react';
// import styles from 'pages/Customer/FeedPage/styles.module.scss';
import {TFunction} from 'i18next';
import FeedPageSideBar from './parts/SideBar';
import {Grid} from '@material-ui/core';
import FeedList from './parts/FeedList/index';
import ContentWrapper from 'components/ContentWrapper';

interface IProps {
  t: TFunction;
  search: IFormFieldState;
  checkboxFields: ICheckboxFieldsState;
  datePicker: IFormFieldState;
  handleSelectChange: (name: string, values: string[]) => void;
  handleCheckboxChange: (e: ChangeEvent) => void;
  handleSearchChange: (e: ChangeEvent) => void;
  handleDateChange: (name: string, value: string) => void;
  handleClosePage: () => void;
}

const FeedCustomerPageLayout: React.FunctionComponent<IProps> = ({
  t,
  checkboxFields,
  handleCheckboxChange,
  search,
  handleSearchChange,
  handleDateChange,
  datePicker,
  handleClosePage,
}) => {
  return (
    <ContentWrapper dark title={t('Feed')} onClose={handleClosePage}>
      <Grid container>
        <Grid item xs={12} lg={3}>
          <FeedPageSideBar t={t} checkboxFields={checkboxFields} handleCheckboxChange={handleCheckboxChange} />
        </Grid>

        <Grid item xs={12} lg={9}>
          <FeedList
            search={search}
            handleSearchChange={handleSearchChange}
            datePicker={datePicker}
            handleDateChange={handleDateChange}
            t={t}
            cardConfig={{
              content: {
                isCustom: true,
                isFacebook: false,
                isTwitter: false,
                isInstagramm: false,
              },
              integrations: {
                reservation: true,
                delivery: false,
                schedule: false,
              },
              isImageShow: true,
              isLogoShow: true,
            }}
            cardContent={{
              name: '50 % OFF Any Large Deep Dish',
              logo: 'some path',
              rules:
                'As Americans, we prefer things to be stuffed, like our bellies and out pizzas. Nancy’s Pizza offers you the trifecta, because you can get your fill without slicing.',
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
            cardMerchantData={{
              title: 'Nancy’s Pizza',
              name: 'Continent',
              address: '123 Providencia Street Anywhere, GA 00000',
              phone: '+1 888 452 1505',
              type: 'Restaurant',
              workTime: '9: 00 AM – 9:00 PM',
            }}
            cardSocialData={['49', '9', '13', '7']}
          />
        </Grid>
      </Grid>
    </ContentWrapper>
  );
};

export default FeedCustomerPageLayout;
