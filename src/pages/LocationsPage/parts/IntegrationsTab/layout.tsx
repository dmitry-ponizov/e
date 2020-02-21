import React, {ChangeEvent} from 'react';
import styles from 'pages/LocationsPage/parts/ContactTab/styles.module.scss';
import {TFunction} from 'i18next';
import {Grid} from '@material-ui/core';
import Input from 'components/Input';
import SaveTabChangesModal from 'components/SaveTabChangesModal';
import TitlePanel from 'components/TitlePanel';
import LocationTabsSwitcher from 'pages/LocationsPage/parts/LocationTabsSwitcher';
import ControlButton from 'components/ControlButton';
import Icon from 'components/Icon';

const integrationsMap = {
  facebook: {
    title: 'Facebook Profile (URL)',
    placeholder: 'https://www.facebook.com/username',
  },
  instagram: {
    title: 'Instagram Profile (URL)',
    placeholder: 'https://instagram.com/username',
  },
  twitter: {
    title: 'Twitter Profile (URL)',
    placeholder: 'https://twitter.com/username',
  },
  reservation: {
    title: 'Reservation Profile (URL)',
    placeholder: 'https://opentable.com/username',
  },
  ordering: {
    title: 'Ordering Profile (URL)',
    placeholder: 'https://www.doordash.com/store/username',
  },
  scheduling: {
    title: 'Scheduling Profile (URL)',
    placeholder: 'https://www.schedulicity.com/scheduling/username',
  },
  unknown: {
    title: 'Unknown Profile',
    placeholder: '',
  },
};

interface IIntegrationState extends ILocationIntegration {
  value: string;
  error: string;
}

interface IProps {
  t: TFunction;

  textFields: IIntegrationState[];

  onChangeTextField: (e: ChangeEvent<HTMLInputElement>) => void;

  onReset: () => void;
  onSave: () => void;

  selectedLocation: ILocation | null;
  hasChanges: boolean;
  updateLocationLoading: boolean;

  onRequestChangeTab: (tab: LocationTabType) => void;
  onChangeTabAnswer: (answer: ExitAnswer) => void;
  exitModalIsOpen: boolean;
}

const ContactTabLayout: React.FC<IProps> = ({
  t,
  textFields,
  onChangeTextField,
  onReset,
  onSave,
  selectedLocation,
  hasChanges,
  updateLocationLoading,
  onRequestChangeTab,
  onChangeTabAnswer,
  exitModalIsOpen,
}) => {
  return (
    <>
      <SaveTabChangesModal t={t} visible={exitModalIsOpen} onAnswer={onChangeTabAnswer} />
      {selectedLocation && (
        <TitlePanel
          title={selectedLocation.name}
          actions={
            <>
              {hasChanges && (
                <ControlButton onClick={onReset}>
                  <Icon name="reset" style={{fontSize: 18}} />
                  {t('Reset')}
                </ControlButton>
              )}
              <ControlButton
                alt
                onClick={onSave}
                loading={updateLocationLoading}
                disabled={!hasChanges || updateLocationLoading}
              >
                <Icon name="save" />
                {t('Save')}
              </ControlButton>
            </>
          }
        />
      )}
      <LocationTabsSwitcher active="integrations" onChange={onRequestChangeTab} />
      <div className={styles.tabContent}>
        <h2>{t('Integrations')}</h2>
        <Grid container>
          <Grid item xs={12} md={6}>
            {textFields.map((integration, index) => {
              const integrationData = integrationsMap[integration.socialChannel] || integrationsMap.unknown;

              return (
                <Input
                  key={integration.id}
                  label={t(integrationData.title)}
                  error={integration.error}
                  placeholder={t(integrationData.placeholder)}
                  name={`${index}`}
                  type="text"
                  value={integration.value}
                  onChange={onChangeTextField}
                />
              );
            })}
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ContactTabLayout;
