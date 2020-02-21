import React from 'react';
import MediaQuery from 'react-responsive';
import {TFunction} from 'i18next';
import StatisticsPanel from 'containers/StatisticsPanel';
import LocationsManager from 'pages/LocationsPage/parts/LocationsManager';
import {Grid} from '@material-ui/core';
import DeleteLocationModal from 'pages/LocationsPage/parts/DeleteLocationModal';
import AddLocationModal from 'pages/LocationsPage/parts/CreateLocationModal';
import ModuleLoader from 'components/ModuleLoader';
import ProcessingInfoTab from 'pages/LocationsPage/parts/ProcessingInfoTab/container';
import ContactTab from 'pages/LocationsPage/parts/ContactTab/container';
import ProfileTab from 'pages/LocationsPage/parts/ProfileTab/container';
import OperationTab from 'pages/LocationsPage/parts/OperationTab/container';
import IntegrationsTab from 'pages/LocationsPage/parts/IntegrationsTab/container';
import MEDIA_BREAKPOINTS from 'constants/mediaBreakpoints';
import ContentWrapper from 'components/ContentWrapper';

interface IProps {
  t: TFunction;
  activeLocationTab: LocationTabType;
  selectedLocationDetails: ILocationDetails | null;
  selectLocationLoading: boolean;
  initiated: boolean;
}

const LocationsPageLayout: React.FunctionComponent<IProps> = ({
  t,
  activeLocationTab,
  selectLocationLoading,
  initiated,
  selectedLocationDetails,
}) => {
  return (
    <ContentWrapper title={t('Locations')}>
      <AddLocationModal />
      <DeleteLocationModal />
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
      {initiated ? (
        <Grid container>
          <Grid item xs={12} lg={3}>
            <LocationsManager />
          </Grid>
          <Grid item xs={12} lg={9}>
            {selectedLocationDetails && (
              <>
                {activeLocationTab === 'contact' && <ContactTab />}
                {activeLocationTab === 'profile' && <ProfileTab />}
                {activeLocationTab === 'operation' && <OperationTab />}
                {activeLocationTab === 'integrations' && <IntegrationsTab />}
                {activeLocationTab === 'visa-mastercard' && <ProcessingInfoTab paymentSystem="vm" />}
                {activeLocationTab === 'american-express' && <ProcessingInfoTab paymentSystem="ae" />}
                {activeLocationTab === 'discover' && <ProcessingInfoTab paymentSystem="dc" />}
              </>
            )}
            {selectLocationLoading && <ModuleLoader />}
          </Grid>
        </Grid>
      ) : (
        <ModuleLoader />
      )}
    </ContentWrapper>
  );
};

export default LocationsPageLayout;
