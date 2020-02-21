import React from 'react';
import {TFunction} from 'i18next';
import ContentManager from './parts/ContentManager';
import DeleteContentModal from './parts/DeleteContentModal';
import ContentForm from './parts/ContentForm/container';
import AddContentModal from './parts/CreateContentModal';
import {Grid} from '@material-ui/core';
import ModuleLoader from 'components/ModuleLoader';
import ContentWrapper from 'components/ContentWrapper';
import StatisticsPanel from 'containers/StatisticsPanel';

interface IProps {
  t: TFunction;
  selectedContentItemDetails: IContentItemDetails | null;
  initiated: boolean;
  getContentLoading: boolean;
}

const ContentPageLayout: React.FunctionComponent<IProps> = ({
  t,
  getContentLoading,
  initiated,
  selectedContentItemDetails,
}) => {
  return (
    <ContentWrapper title={t('Content')}>
      <StatisticsPanel
        items={[
          {value: 109, icon: 'view', label: t('Views')},
          {value: 53, icon: 'like', label: t('Likes')},
          {value: 14, icon: 'heart', label: t('Favorites')},
          {value: 200, icon: 'share', label: t('Shared')},
        ]}
      />
      {initiated && selectedContentItemDetails ? (
        <Grid container>
          <AddContentModal />
          <DeleteContentModal />

          <Grid item xs={12} lg={3}>
            <ContentManager />
          </Grid>

          <Grid item xs={12} lg={9}>
            <ContentForm />
            {getContentLoading && <ModuleLoader />}
          </Grid>
        </Grid>
      ) : (
        <ModuleLoader />
      )}
    </ContentWrapper>
  );
};

export default ContentPageLayout;
