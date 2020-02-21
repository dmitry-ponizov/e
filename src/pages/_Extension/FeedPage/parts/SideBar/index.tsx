import React, {ChangeEvent} from 'react';
import {TFunction} from 'i18next';
import styles from 'pages/_Extension/FeedPage/parts/SideBar/styles.module.scss';
import Checkbox from 'components/Checkbox';

interface IProps {
  t: TFunction;
  checkboxFields: ICheckboxFieldsState;
  handleCheckboxChange: (e: ChangeEvent) => void;
}

const FeedPageSideBar: React.FunctionComponent<IProps> = ({t, checkboxFields, handleCheckboxChange}) => {
  return (
    <div className={styles.criteriaBox}>
      <div className={styles.cbTitle}>Include next criteria</div>
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
  );
};

export default FeedPageSideBar;
