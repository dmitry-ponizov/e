import React from 'react';
import styles from './styles.module.scss';
import {TFunction} from 'i18next';
import StatisticsPanel from 'containers/StatisticsPanel';
import GroupsManager from 'pages/GroupsPage/parts/GroupsManager';
import {Grid} from '@material-ui/core';
import DeleteGroupModal from 'pages/GroupsPage/parts/DeleteGroupModal';
import AddGroupModal from 'pages/GroupsPage/parts/CreateGroupModal';
import ModuleLoader from 'components/ModuleLoader';
import DemographicTab from 'pages/GroupsPage/parts/DemographicTab/container';
import BehavioralTab from 'pages/GroupsPage/parts/BehavioralTab/container';
import ContentWrapper from 'components/ContentWrapper';
import Button from 'components/Button';
import Icon from 'components/Icon';

interface IProps {
  t: TFunction;
  activeGroupTab: GroupTabType;
  selectGroupLoading: boolean;
  selectedGroupDetails: IGroupDetails | null;
  initiated: boolean;
  lastTimeRefreshed: string;
  onRefreshGroups: () => void;
}

const GroupsPageLayout: React.FunctionComponent<IProps> = ({
  t,
  activeGroupTab,
  selectGroupLoading,
  initiated,
  selectedGroupDetails,
  onRefreshGroups,
  lastTimeRefreshed,
}) => {
  return (
    <ContentWrapper title={t('Groups')}>
      <AddGroupModal />
      <DeleteGroupModal />
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
      {initiated ? (
        <Grid container>
          <Grid item xs={12} lg={3}>
            <GroupsManager />
            <Button onClick={onRefreshGroups} className={styles.refreshBtn}>
              <Icon name="refresh" />
              {t('Refresh group')}
            </Button>
            <div className={styles.lastRefreshed}>
              <Icon name={'check'} />
              <div className={styles.lrContent}>
                {`${t('Last Refreshed')}: `}
                <span className={styles.value}>{lastTimeRefreshed}</span>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} lg={9}>
            {selectedGroupDetails && (
              <>
                {activeGroupTab === 'demographic' && <DemographicTab />}
                {activeGroupTab === 'behavioral' && <BehavioralTab />}
              </>
            )}
            {selectGroupLoading && <ModuleLoader />}
          </Grid>
        </Grid>
      ) : (
        <ModuleLoader />
      )}
    </ContentWrapper>
  );
};

export default GroupsPageLayout;
