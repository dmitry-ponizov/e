import React, {ChangeEvent, SyntheticEvent} from 'react';
import styles from 'pages/AccountPage/styles.module.scss';
import {TFunction} from 'i18next';
import Input from 'components/Input';
import Button from 'components/Button';
import RadioTabs from 'components/RadioTabs';
import Label from 'components/Label';
import SelectHOC from 'components/SelectHOC';
import {Grid} from '@material-ui/core';
import ImageUploader from 'components/ImageUploader';
import ENTITY_TYPES from 'constants/entityTypes';
import PHONE_TYPES from 'constants/phoneTypes';
import Autocomplete from 'components/Autocomplete';
import {US_STATES_SHORT} from 'constants/usStates';
import ContentWrapper from 'components/ContentWrapper';

interface IProps {
  t: TFunction;

  suggestions: IAddressSuggestion[];
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;

  resetPasswordLoading: boolean;
  updateAccountLoading: boolean;

  onChangeTextField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSelect: (name: string, value: IOption) => void;
  onApplySuggestion: (suggestion?: IAddressSuggestion) => void;

  onResetPassword: () => void;
  onSubmit: (e: SyntheticEvent) => void;

  onChangeLogo: (url: string, file: File | null) => void;
  onUploadLogo: () => void;
  logoIsUploaded: boolean;
}

const AccountPageLayout: React.FunctionComponent<IProps> = ({
  textFields,
  selectFields,
  updateAccountLoading,
  resetPasswordLoading,
  onChangeSelect,
  onChangeTextField,
  onSubmit,
  t,
  onResetPassword,
  onChangeLogo,
  suggestions,
  onApplySuggestion,
  onUploadLogo,
  logoIsUploaded,
}) => {
  return (
    <ContentWrapper title={t('My Account')}>
      <div className={styles.heading}>
        <Button
          alt
          disabled={updateAccountLoading || resetPasswordLoading}
          loading={resetPasswordLoading}
          className={styles.headingBtn}
          onClick={onResetPassword}
        >
          Password reset
        </Button>
        <Button
          disabled={updateAccountLoading || resetPasswordLoading}
          loading={updateAccountLoading}
          className={styles.headingBtn}
          onClick={onSubmit}
        >
          Save changes
        </Button>
      </div>
      <Grid container alignItems="stretch">
        <Grid item xs={12} lg={6}>
          <div className={styles.box}>
            <h2 className={styles.subTitle}>{t('Business Information')}</h2>
            <ImageUploader
              className={styles.imageUploader}
              label={t('Business Logo')}
              t={t}
              error={textFields.logo.error}
              url={textFields.logo.value}
              onChange={onChangeLogo}
              onUpload={onUploadLogo}
              loading={updateAccountLoading || resetPasswordLoading}
              hasChanges={!logoIsUploaded}
            />
            <Input
              label={t('Business Legal Name')}
              error={textFields.businessLegalName.error}
              name="businessLegalName"
              type="text"
              value={textFields.businessLegalName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Business Working Name')}
              error={textFields.businessWorkingName.error}
              name="businessWorkingName"
              type="text"
              value={textFields.businessWorkingName.value}
              onChange={onChangeTextField}
            />
            <SelectHOC
              label={t('Entity Type')}
              error={selectFields.entityType.error}
              zIndex={10}
              baseSelectProps={{
                name: 'entityType',
                value: selectFields.entityType.value || '',
                options: ENTITY_TYPES,
                onChange: onChangeSelect,
              }}
            />
            <Input
              label={t('Job Title')}
              error={textFields.jobTitle.error}
              name="jobTitle"
              type="text"
              value={textFields.jobTitle.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('First Name')}
              error={textFields.businessFirstName.error}
              name="businessFirstName"
              type="text"
              value={textFields.businessFirstName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Last Name')}
              error={textFields.businessLastName.error}
              name="businessLastName"
              type="text"
              value={textFields.businessLastName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('E-mail')}
              error={textFields.businessEmail.error}
              name="businessEmail"
              type="text"
              value={textFields.businessEmail.value}
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
                  options={PHONE_TYPES}
                  selected={textFields.phoneType.value}
                  onChange={onChangeTextField}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
        <Grid item xs={12} lg={6} style={{display: 'flex', flexDirection: 'column', alignItems: 'stretch'}}>
          <div className={styles.box}>
            <h2 className={styles.subTitle}>{t('User Information')}</h2>
            <Input
              label={t('First Name')}
              error={textFields.userFirstName.error}
              name="userFirstName"
              type="text"
              value={textFields.userFirstName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Last Name')}
              error={textFields.userLastName.error}
              name="userLastName"
              type="text"
              value={textFields.userLastName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('E-mail')}
              error={textFields.userEmail.error}
              disabled
              name="userEmail"
              type="text"
              value={textFields.userEmail.value}
              onChange={onChangeTextField}
            />
          </div>
          <div className={`${styles.box} ${styles.boxLast}`}>
            <h2 className={styles.subTitle}>{t('Address Information')}</h2>
            <Autocomplete suggestions={suggestions} onApply={onApplySuggestion}>
              <Input
                label={t('Address 1')}
                error={textFields.address1.error}
                name="address1"
                type="text"
                value={textFields.address1.value}
                onChange={onChangeTextField}
              />
            </Autocomplete>
            <Input
              label={t('Address 2')}
              error={textFields.address2.error}
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
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Input
                  label={t('Zip')}
                  error={textFields.zipCode.error}
                  name="zipCode"
                  type="text"
                  value={textFields.zipCode.value}
                  onChange={onChangeTextField}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
};

export default AccountPageLayout;
