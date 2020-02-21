import React, {ChangeEvent} from 'react';
import styles from 'pages/GroupsPage/parts/DemographicTab/styles.module.scss';
import {TFunction} from 'i18next';
import {Grid} from '@material-ui/core';
import Input from 'components/Input';
import Checkbox from 'components/Checkbox';
import SaveTabChangesModal from 'components/SaveTabChangesModal';
import TitlePanel from 'components/TitlePanel';
import GroupTabsSwitcher from 'pages/GroupsPage/parts/GroupTabsSwitcher';
import ControlButton from 'components/ControlButton';
import Icon from 'components/Icon';
import Radio from 'components/Radio';
import GENDER_TYPES from 'constants/genderTypes';
import RELATIONSHIP_TYPES from 'constants/relationshipTypes';
import CHILDREN_TYPES from 'constants/childrenTypes';
import HOME_TYPES from 'constants/homeTypes';
import {US_STATES_SHORT} from 'constants/usStates';
import SelectHOC from 'components/SelectHOC';
import MultiSelect from 'components/MultiSelect';
import EDUCATION_TYPES from 'constants/educationTypes';
import EMPLOYMENT_TYPES from 'constants/employmentTypes';
import ETHNIC_TYPES from 'constants/ethnicTypes';
import INCOME_TYPES from 'constants/groupsIncomeTypes';
import {bornYears} from 'constants/date';

const filters = [
  'Distance (miles)',
  'Gender',
  'Relationship',
  'Children',
  'Home',
  'Year Born',
  'Education',
  'Employment',
  'Ethic',
  'Income',
];

interface IProps {
  t: TFunction;

  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  checkboxFields: ICheckboxFieldsState;
  multiSelectFields: IMultiSelectFieldsState;

  onChangeTextField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeCheckboxField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSelectField: (name: string, value: IOption) => void;
  onChangeMultiselectField: (name: string, values: string[]) => void;

  onReset: () => void;
  onSave: () => void;

  selectedGroup: IGroup;
  hasChanges: boolean;
  updateGroupLoading: boolean;

  onRequestChangeTab: (tab: GroupTabType) => void;
  onChangeTabAnswer: (answer: ExitAnswer) => void;
  exitModalIsOpen: boolean;

  onLoadZipCodes: (oldItems: IOption[]) => Promise<ILoadOptionsResponse>;
}

const DemographicTabLayout: React.FC<IProps> = ({
  t,
  textFields,
  selectFields,
  checkboxFields,
  multiSelectFields,
  onChangeTextField,
  onChangeCheckboxField,
  onChangeMultiselectField,
  onChangeSelectField,
  onReset,
  onSave,
  selectedGroup,
  hasChanges,
  updateGroupLoading,
  onRequestChangeTab,
  onChangeTabAnswer,
  exitModalIsOpen,
  onLoadZipCodes,
}) => {
  return (
    <>
      <SaveTabChangesModal t={t} visible={exitModalIsOpen} onAnswer={onChangeTabAnswer} />
      <TitlePanel
        title={selectedGroup.name}
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
              loading={updateGroupLoading}
              disabled={!hasChanges || updateGroupLoading}
            >
              <Icon name="save" />
              {t('Save')}
            </ControlButton>
          </>
        }
      />
      <GroupTabsSwitcher active="demographic" onChange={onRequestChangeTab} />
      <div className={styles.tabContent}>
        <h2 className={styles.title}>{t('Demographic')}</h2>
        {selectedGroup.priority === 0 ? (
          filters.map(filterName => {
            return (
              <div className={styles.dtRow} key={filterName}>
                <strong>{t(filterName)}</strong>
                <span>{t('All')}</span>
              </div>
            );
          })
        ) : (
          <>
            <Grid container>
              <Grid item xs={12} md={4}>
                <Checkbox
                  containerClass={styles.checkbox}
                  name="distance"
                  checked={checkboxFields.distance}
                  label={t('Distance (miles)')}
                  onChange={onChangeCheckboxField}
                />
                <Grid container>
                  <Grid item xs={12} md={6}>
                    <Input
                      label={t('From')}
                      error={textFields.distanceFrom.error}
                      disabled={!checkboxFields.distance}
                      name="distanceFrom"
                      type="text"
                      value={textFields.distanceFrom.value}
                      onChange={onChangeTextField}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Input
                      label={t('To')}
                      error={textFields.distanceTo.error}
                      disabled={!checkboxFields.distance}
                      name="distanceTo"
                      type="text"
                      value={textFields.distanceTo.value}
                      onChange={onChangeTextField}
                    />
                  </Grid>
                </Grid>
                <MultiSelect
                  t={t}
                  name={'region'}
                  label={t('States')}
                  description={'Select...'}
                  selected={multiSelectFields.region.values}
                  options={US_STATES_SHORT}
                  onChange={onChangeMultiselectField}
                />
                <MultiSelect
                  t={t}
                  name={'postalCode'}
                  label={t('Zip codes')}
                  selected={multiSelectFields.postalCode.values}
                  options={[]}
                  disabled={!multiSelectFields.region.values.length}
                  onChange={onChangeMultiselectField}
                  getItemsAsync={onLoadZipCodes}
                />
              </Grid>
            </Grid>

            <div className={styles.separator} />
            <Radio
              name="gender"
              label={t('Gender')}
              selected={selectFields.gender.value!}
              options={GENDER_TYPES}
              onChange={onChangeSelectField}
            />
            <Radio
              name="relationship"
              label={t('Relationship')}
              selected={selectFields.relationship.value!}
              options={RELATIONSHIP_TYPES}
              onChange={onChangeSelectField}
            />
            <Radio
              name="children"
              label={t('Children')}
              selected={selectFields.children.value!}
              options={CHILDREN_TYPES}
              onChange={onChangeSelectField}
            />
            <Radio
              name="home"
              label={t('Home')}
              selected={selectFields.home.value!}
              options={HOME_TYPES}
              onChange={onChangeSelectField}
            />
            <div className={styles.separator} />
            <Grid container>
              <Grid item xs={12} md={3}>
                <SelectHOC
                  label={t('Year Born')}
                  error={selectFields.yearOfBirth.error}
                  zIndex={31}
                  baseSelectProps={{
                    name: 'yearOfBirth',
                    value: selectFields.yearOfBirth.value || '',
                    options: bornYears,
                    onChange: onChangeSelectField,
                  }}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12} md={6}>
                <SelectHOC
                  label={t('Education (Highest Level)')}
                  error={selectFields.education.error}
                  zIndex={30}
                  baseSelectProps={{
                    name: 'education',
                    value: selectFields.education.value || '',
                    options: EDUCATION_TYPES,
                    onChange: onChangeSelectField,
                  }}
                />
                <SelectHOC
                  label={t('Employment')}
                  error={selectFields.employment.error}
                  zIndex={29}
                  baseSelectProps={{
                    name: 'employment',
                    value: selectFields.employment.value || '',
                    options: EMPLOYMENT_TYPES,
                    onChange: onChangeSelectField,
                  }}
                />
                <SelectHOC
                  label={t('Ethic')}
                  error={selectFields.ethnic.error}
                  zIndex={28}
                  baseSelectProps={{
                    name: 'ethnic',
                    value: selectFields.ethnic.value || '',
                    options: ETHNIC_TYPES,
                    onChange: onChangeSelectField,
                  }}
                />
                <SelectHOC
                  label={t('Income')}
                  error={selectFields.income.error}
                  zIndex={27}
                  baseSelectProps={{
                    name: 'income',
                    value: selectFields.income.value || '',
                    options: INCOME_TYPES,
                    onChange: onChangeSelectField,
                  }}
                />
              </Grid>
            </Grid>
          </>
        )}
      </div>
    </>
  );
};

export default DemographicTabLayout;
