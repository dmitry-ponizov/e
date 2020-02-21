import React from 'react';
import styles from 'containers/StatisticsPanel/styles.module.scss';
import Icon, {IconName} from 'components/Icon';
import {withTranslation, WithTranslation} from 'react-i18next';
import {inject, observer} from 'mobx-react';
import enhance from 'helpers/enhance';
import {IRootStore} from 'stores';

interface IItem {
  value: number;
  icon: IconName;
  label: string;
}
interface IProps {
  items: IItem[];
}

const renderItem = (item: IItem, t, count: number): JSX.Element => (
  <div className={styles.item} key={count}>
    <div className={styles.box}>
      <span className={styles.value}>{item.value}</span>
      <Icon className={styles.icon} name={item.icon} />
    </div>
    <span className={styles.label}>{t(item.label)}</span>
  </div>
);

const StatisticsPanelBase: React.FC<IProps & WithTranslation> = ({t, items}) => {
  return <div className={styles.container}>{items.map((item, index) => renderItem(item, t, index))}</div>;
};

const StatisticsPanel = enhance(StatisticsPanelBase, [
  inject((rootStore: IRootStore) => {
    //TODO: connect
  }),
  observer,
  withTranslation(),
]);
export default StatisticsPanel;
