import React, {ChangeEvent} from 'react';
import styles from 'pages/LocationsPage/parts/ProcessingInfoTab/styles.module.scss';
import {TFunction} from 'i18next';
import {Grid} from '@material-ui/core';
import Input from 'components/Input';
import ImageUploader from 'components/ImageUploader';
import SelectHOC from 'components/SelectHOC';
import {US_STATES_SHORT} from 'constants/usStates';
import SaveTabChangesModal from 'components/SaveTabChangesModal';
import TitlePanel from 'components/TitlePanel';
import LocationTabsSwitcher from 'pages/LocationsPage/parts/LocationTabsSwitcher';
import ControlButton from 'components/ControlButton';
import Icon from 'components/Icon';

interface IProps {
  t: TFunction;
  paymentSystem: PaymentSystem;

  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;

  onChangeTextField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeLogo: (url: string, file: File | null) => void;
  onChangeSelect: (name: string, value: IOption) => void;
  onUploadLogo: () => void;

  onReset: () => void;
  onSave: () => void;

  selectedLocation: ILocation | null;
  hasChanges: boolean;
  logoIsUploaded: boolean;
  updateLocationLoading: boolean;

  onRequestChangeTab: (tab: LocationTabType) => void;
  onChangeTabAnswer: (answer: ExitAnswer) => void;
  exitModalIsOpen: boolean;
}

const titleMap = {
  vm: {
    title: 'Visa / Mastercard Processing Information',
    tab: 'visa-mastercard',
  },
  ae: {
    title: 'American Express Processing Information',
    tab: 'american-express',
  },
  dc: {
    title: 'Discover Processing Information',
    tab: 'discover',
  },
};

const ProcessingInfoTabLayout: React.FC<IProps> = ({
  t,
  paymentSystem,
  textFields,
  selectFields,
  onChangeTextField,
  onChangeSelect,
  onReset,
  onSave,
  selectedLocation,
  hasChanges,
  updateLocationLoading,
  onRequestChangeTab,
  onChangeTabAnswer,
  exitModalIsOpen,
  onChangeLogo,
  logoIsUploaded,
  onUploadLogo,
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
      <LocationTabsSwitcher active={titleMap[paymentSystem].tab as LocationTabType} onChange={onRequestChangeTab} />
      <div className={styles.tabContent}>
        <h2>{t(titleMap[paymentSystem].title)}</h2>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Input
              label={t('Merchant ID')}
              error={textFields.merchantId.error}
              disabled
              name="merchantId"
              type="text"
              value={textFields.merchantId.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Acquirer')}
              error={textFields.acquirer.error}
              disabled
              name="acquirer"
              type="text"
              value={textFields.acquirer.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Front End Processor')}
              error={textFields.frontEndProcessor.error}
              disabled
              name="frontEndProcessor"
              type="text"
              value={textFields.frontEndProcessor.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Back End Processor')}
              error={textFields.backEndProcessor.error}
              disabled
              name="backEndProcessor"
              type="text"
              value={textFields.backEndProcessor.value}
              onChange={onChangeTextField}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ImageUploader
              className={styles.imageUploader}
              label={t('Merchant Statement')}
              t={t}
              error={textFields.logo.error}
              url={textFields.logo.value}
              onChange={onChangeLogo}
              onUpload={onUploadLogo}
              loading={updateLocationLoading}
              hasChanges={!logoIsUploaded}
            />
          </Grid>
        </Grid>
        <div className={styles.separator} />
        <Grid container>
          <Grid item xs={12} md={6}>
            <Input
              label={t('Name')}
              error={textFields.name.error}
              disabled
              name="name"
              type="text"
              value={textFields.name.value}
              onChange={onChangeTextField}
            />
            <Grid container>
              <Grid item xs={12} md={8}>
                <Input
                  label={t('City')}
                  error={textFields.city.error}
                  disabled
                  name="city"
                  type="text"
                  value={textFields.city.value}
                  onChange={onChangeTextField}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <SelectHOC
                  label={t('State')}
                  error={selectFields.state.error}
                  baseSelectProps={{
                    name: 'state',
                    isDisabled: true,
                    value: selectFields.state.value || '',
                    options: US_STATES_SHORT,
                    onChange: onChangeSelect,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} md={3}>
                <Input
                  label={t('Zip')}
                  error={textFields.zipCode.error}
                  disabled
                  name="zipCode"
                  type="text"
                  value={textFields.zipCode.value}
                  onChange={onChangeTextField}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Input
                  label={t('Country')}
                  error={textFields.country.error}
                  name="country"
                  type="text"
                  disabled
                  value={textFields.country.value}
                  onChange={onChangeTextField}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ProcessingInfoTabLayout;
