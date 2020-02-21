import React from 'react';
import {TFunction} from 'i18next';
import StatisticsPanel from 'containers/StatisticsPanel';
import RewardsManager from 'pages/RewardsPage/parts/RewardsManager';
import {Grid} from '@material-ui/core';
import ModuleLoader from 'components/ModuleLoader';
import RewardContent from './parts/RewardContent/container';
import CreateRewardModal from './parts/CreateRewardModal';
import DeleteRewardModal from './parts/DeleteRewardModal';
import ContentWrapper from 'components/ContentWrapper';

interface IProps {
  t: TFunction;
  selectedRewardDetails: IRewardDetails | null;
  selectRewardLoading: boolean;
  initiated: boolean;
}


const RewardsPageLayout: React.FC<IProps> = ({
  t,
  selectedRewardDetails,
  selectRewardLoading,
  initiated
}) => {
  return (
    <ContentWrapper title={t('Rewards')}>
      <CreateRewardModal />
      <DeleteRewardModal />
      <StatisticsPanel
        items={[
          {value:109, icon: 'view', label: t('Views')},
          {value:53, icon: 'like', label: t('Likes')},
          {value:14, icon: 'heart', label: t('Favorites')}
        ]}
      />
      {initiated ? (
        <Grid container>
          <Grid item xs={12} lg={3}>
            <RewardsManager />
          </Grid>
          <Grid item xs={12} lg={9}>
            {selectedRewardDetails && <RewardContent />}
            {selectRewardLoading && <ModuleLoader />}
          </Grid>
        </Grid>
      ) : (
        <ModuleLoader />
      )}
    </ContentWrapper>
  );
};

export default RewardsPageLayout;
