import React, {ChangeEvent} from 'react';
import styles from 'pages/LocationsPage/parts/ContactTab/styles.module.scss';
import {TFunction} from 'i18next';
import {Grid} from '@material-ui/core';
import Input from 'components/Input';
import Label from 'components/Label';
import RadioTabs from 'components/RadioTabs';
import ImageUploader from 'components/ImageUploader';
import Checkbox from 'components/Checkbox';
import SelectHOC from 'components/SelectHOC';
import {US_STATES_SHORT} from 'constants/usStates';
import SaveTabChangesModal from 'components/SaveTabChangesModal';
import TitlePanel from 'components/TitlePanel';
import LocationTabsSwitcher from 'pages/LocationsPage/parts/LocationTabsSwitcher';
import ControlButton from 'components/ControlButton';
import Icon from 'components/Icon';
import PHONE_TYPES from 'constants/phoneTypes';
import Autocomplete from 'components/Autocomplete';

interface IProps {
  t: TFunction;

  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  sameAsAccount: boolean;
  suggestions: IAddressSuggestion[];

  onChangeTextField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeLogo: (url: string, file: File | null) => void;
  onChangeCheckbox: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSelect: (name: string, value: IOption) => void;
  onApplySuggestion: (suggestion?: IAddressSuggestion) => void;

  onReset: () => void;
  onSave: () => void;
  onUploadLogo: () => void;

  selectedLocation: ILocation | null;
  hasChanges: boolean;
  updateLocationLoading: boolean;
  logoIsUploaded: boolean;

  onRequestChangeTab: (tab: LocationTabType) => void;
  onChangeTabAnswer: (answer: ExitAnswer) => void;
  exitModalIsOpen: boolean;
}

const ContactTabLayout: React.FC<IProps> = ({
  t,
  textFields,
  selectFields,
  sameAsAccount,
  onChangeTextField,
  onChangeCheckbox,
  onChangeSelect,
  onReset,
  onSave,
  selectedLocation,
  hasChanges,
  updateLocationLoading,
  onRequestChangeTab,
  onChangeTabAnswer,
  exitModalIsOpen,
  onApplySuggestion,
  onChangeLogo,
  suggestions,
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
      <LocationTabsSwitcher active="contact" onChange={onRequestChangeTab} />
      <div className={styles.tabContent}>
        <h2 className={styles.title}>{t('Contact Information')}</h2>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Checkbox
              containerClass={styles.checkbox}
              name="sameAsAccount"
              checked={sameAsAccount}
              label={t('Same as account')}
              onChange={onChangeCheckbox}
            />
            <Input
              label={t('Business Name Used At Location')}
              error={textFields.businessName.error}
              disabled={sameAsAccount}
              name="businessName"
              type="text"
              value={textFields.businessName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('First Name')}
              error={textFields.firstName.error}
              disabled={sameAsAccount}
              name="firstName"
              type="text"
              value={textFields.firstName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Last Name')}
              error={textFields.lastName.error}
              disabled={sameAsAccount}
              name="lastName"
              type="text"
              value={textFields.lastName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Job Title')}
              error={textFields.title.error}
              disabled={sameAsAccount}
              name="title"
              type="text"
              value={textFields.title.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('E-mail')}
              error={textFields.email.error}
              disabled={sameAsAccount}
              name="email"
              type="email"
              value={textFields.email.value}
              onChange={onChangeTextField}
            />
            <Grid container>
              <Grid item xs={12} md={5}>
                <Input
                  label={t('Phone')}
                  error={textFields.phone.error}
                  name="phone"
                  type="tel"
                  value={textFields.phone.value}
                  onChange={onChangeTextField}
                  mask="\+9 999 999 9999"
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <Label>{t('Phone Type')}</Label>
                <RadioTabs
                  name="phoneType"
                  disabled={sameAsAccount}
                  options={PHONE_TYPES}
                  selected={textFields.phoneType.value}
                  onChange={onChangeTextField}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <ImageUploader
              hasChanges={!logoIsUploaded}
              onUpload={onUploadLogo}
              label={t('Logo')}
              t={t}
              error={textFields.logo.error}
              url={textFields.logo.value}
              onChange={onChangeLogo}
              loading={updateLocationLoading}
              disabled={sameAsAccount}
            />
          </Grid>
        </Grid>
        <div className={styles.separator} />
        <Grid container>
          <Grid item xs={12} md={6}>
            <Autocomplete suggestions={suggestions} onApply={onApplySuggestion}>
              <Input
                label={t('Address 1')}
                error={textFields.address1.error}
                disabled={sameAsAccount}
                name="address1"
                type="text"
                value={textFields.address1.value}
                onChange={onChangeTextField}
              />
            </Autocomplete>
            <Input
              label={t('Address 2')}
              error={textFields.address2.error}
              disabled={sameAsAccount}
              name="address2"
              type="text"
              value={textFields.address2.value}
              onChange={onChangeTextField}
            />
            <Grid container>
              <Grid item xs={12} md={6}>
                <Input
                  label={t('City')}
                  error={textFields.city.error}
                  disabled={sameAsAccount}
                  name="city"
                  type="text"
                  value={textFields.city.value}
                  onChange={onChangeTextField}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <SelectHOC
                  label={t('State')}
                  error={selectFields.state.error}
                  baseSelectProps={{
                    name: 'state',
                    value: selectFields.state.value || '',
                    options: US_STATES_SHORT,
                    onChange: onChangeSelect,
                    isDisabled: sameAsAccount,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Input
                  label={t('Zip')}
                  error={textFields.zipCode.error}
                  disabled={sameAsAccount}
                  name="zipCode"
                  type="text"
                  value={textFields.zipCode.value}
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

export default ContactTabLayout;
