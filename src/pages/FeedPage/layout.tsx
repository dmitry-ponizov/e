import React, {ChangeEvent} from 'react';
import styles from 'pages/FeedPage/styles.module.scss';
import {TFunction} from 'i18next';
import StatisticsPanel from 'containers/StatisticsPanel';
import MediaQuery from 'react-responsive';
import Icon from 'components/Icon';
import MultiSelect from 'components/MultiSelect';
import RELATIONSHIP_TYPES from 'constants/relationshipTypes';
import Checkbox from 'components/Checkbox';
import ContentWrapper from 'components/ContentWrapper';
import MEDIA_BREAKPOINTS from 'constants/mediaBreakpoints';
import {Grid} from '@material-ui/core';
import NewDatePicker from 'components/NewDatePicker';
import config from 'constants/config';

interface IProps {
  t: TFunction;
  initiated: boolean;

  search: IFormFieldState;
  multiSelectFields: IMultiSelectFieldsState;
  checkboxFields: ICheckboxFieldsState;
  datePicker: IFormFieldState;

  handleSelectChange: (name: string, values: string[]) => void;
  handleCheckboxChange: (e: ChangeEvent) => void;
  handleSearchChange: (e: ChangeEvent) => void;
  handleDateChange: (name: string, value: string) => void;
}

const FeedPageLayout: React.FC<IProps> = ({
  t,
  search,
  multiSelectFields,
  checkboxFields,
  datePicker,
  handleSelectChange,
  handleCheckboxChange,
  handleSearchChange,
  handleDateChange,
}) => {
  return (
    <ContentWrapper title={t('Feed')}>
      <MediaQuery minDeviceWidth={MEDIA_BREAKPOINTS.md}>
        <StatisticsPanel
          items={[
            {value: 999, icon: 'cash', label: t('Spend')},
          {value: 999, icon: 'transaction', label: t('Transactions')},
          {value: 999, icon: 'ticket', label: t('Ave Ticket')},
          {value: 999, icon: 'view', label: t('Views')},
          {value: 999, icon: 'like', label: t('Likes')},
          {value: 999, icon: 'heart', label: t('Favorites')},
          {value: 999, icon: 'share', label: t('Shared')},
          {value: 999, icon: 'feedback', label: t('Feedback')},
          {value: 999, icon: 'lightning', label: t('Disputes')},
          {value: 999, icon: 'smile', label: t('NPS')},
          ]}
        />
      </MediaQuery>
      <Grid container>
        <Grid item xs={12} lg={3}>
          <div className={styles.criteriaBox}>
            <span className={styles.cbTitle}>{t('Include next criteria:')}</span>
            <div className={`${styles.checkboxRow}${checkboxFields.offer ? ' ' + styles.checkRowActive : ''}`}>
              <Checkbox
                containerClass={styles.checkbox}
                name={'offer'}
                onChange={handleCheckboxChange}
                label={t('Offer')}
                checked={checkboxFields.offer}
              />
            </div>
            <div className={`${styles.checkboxRow}${checkboxFields.reward ? ' ' + styles.checkRowActive : ''}`}>
              <Checkbox
                containerClass={styles.checkbox}
                name={'reward'}
                onChange={handleCheckboxChange}
                label={t('Reward')}
                checked={checkboxFields.reward}
              />
            </div>
            <div className={`${styles.checkboxRow}${checkboxFields.other ? ' ' + styles.checkRowActive : ''}`}>
              <Checkbox
                containerClass={styles.checkbox}
                name={'other'}
                onChange={handleCheckboxChange}
                label={t('Other')}
                checked={checkboxFields.other}
              />
            </div>
            <div className={styles.separator} />
            <div className={`${styles.checkboxRow}${checkboxFields.viewed ? ' ' + styles.checkRowActive : ''}`}>
              <Checkbox
                containerClass={styles.checkbox}
                name={'viewed'}
                onChange={handleCheckboxChange}
                label={t('Viewed')}
                checked={checkboxFields.viewed}
              />
            </div>
            <div className={`${styles.checkboxRow}${checkboxFields.liked ? ' ' + styles.checkRowActive : ''}`}>
              <Checkbox
                containerClass={styles.checkbox}
                name={'liked'}
                onChange={handleCheckboxChange}
                label={t('Liked')}
                checked={checkboxFields.liked}
              />
            </div>
            <div className={`${styles.checkboxRow}${checkboxFields.favorites ? ' ' + styles.checkRowActive : ''}`}>
              <Checkbox
                containerClass={styles.checkbox}
                name={'favorites'}
                onChange={handleCheckboxChange}
                label={t('Favorites')}
                checked={checkboxFields.favorites}
              />
            </div>
            <div className={`${styles.checkboxRow}${checkboxFields.shared ? ' ' + styles.checkRowActive : ''}`}>
              <Checkbox
                containerClass={styles.checkbox}
                name={'shared'}
                onChange={handleCheckboxChange}
                label={t('Shared')}
                checked={checkboxFields.shared}
              />
            </div>
            <div className={styles.separator} />
            <div className={`${styles.checkboxRow}${checkboxFields.feedToEmail ? ' ' + styles.checkRowActive : ''}`}>
              <Checkbox
                containerClass={styles.checkbox}
                name={'feedToEmail'}
                onChange={handleCheckboxChange}
                label={t('Would like a daily feed digest sent to your e-mail')}
                checked={checkboxFields.feedToEmail}
              />
            </div>
          </div>
        </Grid>
        <Grid item xs={12} lg={9}>
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
              <MultiSelect
                className={styles.multiSelect}
                selected={multiSelectFields.locations.values}
                innerLabel={`${t('Location')}:`}
                options={RELATIONSHIP_TYPES}
                onChange={handleSelectChange}
                t={t}
                name={'locations'}
              />
              <MultiSelect
                className={styles.multiSelect}
                selected={multiSelectFields.groups.values}
                innerLabel={`${t('Group')}:`}
                options={RELATIONSHIP_TYPES}
                onChange={handleSelectChange}
                t={t}
                name={'groups'}
              />
              <NewDatePicker
                t={t => t}
                name="datePicker"
                splitter={config.COMMON.dateSplitter}
                value={datePicker.value}
                onChange={handleDateChange}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
};

export default FeedPageLayout;
