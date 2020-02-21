import React, {ChangeEvent} from 'react';
import styles from 'pages/_Extension/SettingsPage/styles.module.scss';
import {TFunction} from 'i18next';
import {Grid} from '@material-ui/core';
import Modal from 'components/Modal';
import Input from 'components/Input';
import Button from 'components/Button';
import RadioTabs from 'components/RadioTabs';
import Label from 'components/Label';
import PHONE_TYPES from 'constants/phoneTypes';
import Autocomplete from 'components/Autocomplete';
import SelectHOC from 'components/SelectHOC';
import {US_STATES_SHORT} from 'constants/usStates';
import Radio from 'components/Radio';
import GENDER_TYPES from 'constants/genderTypes';
import RELATIONSHIP_TYPES from 'constants/relationshipTypes';
import CHILDREN_TYPES from 'constants/childrenTypes';
import HOME_TYPES from 'constants/homeTypes';
import {bornYears} from 'constants/date';
import EDUCATION_TYPES from 'constants/educationTypes';
import EMPLOYMENT_TYPES from 'constants/employmentTypes';
import ETHNIC_TYPES from 'constants/ethnicTypes';
import INCOME_TYPES from 'constants/groupsIncomeTypes';
import ContentWrapper from 'components/ContentWrapper';

interface IProps {
  t: TFunction;

  suggestions: IAddressSuggestion[];
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;

  updateAccountLoading: boolean;

  onChangeTextField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSelect: (name: string, value: IOption) => void;
  onApplySuggestion: (suggestion?: IAddressSuggestion) => void;

  onSubmit: () => void;
  onPageClose: () => void;
}

const SettingsPageLayout: React.FC<IProps> = ({
  t,
  textFields,
  selectFields,
  suggestions,
  onApplySuggestion,
  onChangeTextField,
  onChangeSelect,
  onSubmit,
  updateAccountLoading,
  onPageClose,
}) => {
  return (
    <ContentWrapper dark onClose={onPageClose} title={t('Settings')}>
      <Grid container>
        <Grid item xs={12} md={6}>
          <div className={styles.box}>
            <h2 className={styles.subTitle}>{t('Contact')}</h2>
            <Input
              label={t('First Name')}
              error={textFields.firstName.error}
              name="firstName"
              type="text"
              value={textFields.firstName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Last Name')}
              error={textFields.lastName.error}
              name="lastName"
              type="text"
              value={textFields.lastName.value}
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
          <div className={`${styles.box} ${styles.boxLast}`}>
            <h2 className={styles.subTitle}>{t('Address')}</h2>
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
        <Grid item xs={12} md={6}>
          <h2 className={styles.subTitle}>{t('Address')}</h2>
          <Radio
            name="gender"
            selected={selectFields.gender.value}
            options={GENDER_TYPES}
            onChange={onChangeSelect}
            label={t('  ')}
          />
        </Grid>
      </Grid>
    </ContentWrapper>
  );
};

export default SettingsPageLayout;
