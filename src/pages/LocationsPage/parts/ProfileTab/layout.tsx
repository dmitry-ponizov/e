import React, {ChangeEvent} from 'react';
import styles from 'pages/LocationsPage/parts/ProfileTab/styles.module.scss';
import {TFunction} from 'i18next';
import {Grid} from '@material-ui/core';
import Input from 'components/Input';
import SelectHOC from 'components/SelectHOC';
import SaveTabChangesModal from 'components/SaveTabChangesModal';
import TitlePanel from 'components/TitlePanel';
import LocationTabsSwitcher from 'pages/LocationsPage/parts/LocationTabsSwitcher';
import ControlButton from 'components/ControlButton';
import Icon from 'components/Icon';
import Radio from 'components/Radio';
import ENTITY_TYPES, {ENTITY_TYPES_VARIANTS} from 'constants/entityTypes';
import LOCATION_TYPES from 'constants/locationTypes';
import CHANNEL_TYPES from 'constants/channelTypes';
import TIMEZONES from 'constants/timeZones';
import NewDatePicker from 'components/NewDatePicker';

interface IProps {
  t: TFunction;

  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;

  onChangeTextField: (e: ChangeEvent) => void;
  onChangeSelect: (name: string, value: IOption) => void;
  onLoadCodes: (
    code: 'naics' | 'sic' | 'mcc',
  ) => (search: string, loadedOptions: IOption[]) => Promise<ILoadOptionsResponse>;

  onReset: () => void;
  onSave: () => void;

  selectedLocation: ILocation | null;
  hasChanges: boolean;
  updateLocationLoading: boolean;

  onRequestChangeTab: (tab: LocationTabType) => void;
  onChangeTabAnswer: (answer: ExitAnswer) => void;
  exitModalIsOpen: boolean;
  onChangeDate: (name: string, value: string) => void;
}

const ProfileTabLayout: React.FC<IProps> = ({
  t,
  textFields,
  selectFields,
  onChangeTextField,
  onChangeSelect,
  onLoadCodes,
  onReset,
  onSave,
  selectedLocation,
  hasChanges,
  updateLocationLoading,
  onRequestChangeTab,
  onChangeTabAnswer,
  exitModalIsOpen,
  onChangeDate,
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
      <LocationTabsSwitcher active="profile" onChange={onRequestChangeTab} />
      <div className={styles.tabContent}>
        <h2>{t('Profile')}</h2>
        <Grid container>
          <Grid item xs={12} md={10}>
            <SelectHOC
              label={t('NAICS Description')}
              error={selectFields.naics.error}
              zIndex={30}
              baseSelectProps={{
                name: 'naics',
                value: selectFields.naics.value || '',
                onChange: onChangeSelect,
              }}
              asyncSelectProps={{
                loadOptions: onLoadCodes('naics'),
                debounceTimeout: 500,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Input
              label={t('NAICS Code')}
              disabled
              name="naics"
              type="text"
              value={selectFields.naics.value ? selectFields.naics.value.value : ''}
              onChange={onChangeTextField}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={10}>
            <SelectHOC
              label={t('SIC Description')}
              error={selectFields.sic.error}
              zIndex={29}
              baseSelectProps={{
                name: 'sic',
                value: selectFields.sic.value || '',
                onChange: onChangeSelect,
              }}
              asyncSelectProps={{
                loadOptions: onLoadCodes('sic'),
                debounceTimeout: 500,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Input
              label={t('SIC Code')}
              disabled
              name="sic"
              type="text"
              value={selectFields.sic.value ? selectFields.sic.value.value : ''}
              onChange={onChangeTextField}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={10}>
            <SelectHOC
              label={t('MCC Description')}
              error={selectFields.mcc.error}
              zIndex={28}
              baseSelectProps={{
                name: 'mcc',
                value: selectFields.mcc.value || '',
                onChange: onChangeSelect,
              }}
              asyncSelectProps={{
                loadOptions: onLoadCodes('mcc'),
                debounceTimeout: 500,
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Input
              label={t('MCC Code')}
              disabled
              name="mcc"
              type="text"
              value={selectFields.mcc.value ? selectFields.mcc.value.value : ''}
              onChange={onChangeTextField}
            />
          </Grid>
        </Grid>
        <Input
          label={t('Your Description')}
          error={textFields.description.error}
          multiline
          placeholder={t('Description goes here.')}
          name="description"
          type="text"
          value={textFields.description.value}
          onChange={onChangeTextField}
        />
        <div className={styles.separator} />
        <Grid container>
          <Grid item xs={12} md={6}>
            <Radio
              name="entityTypeVariant"
              label={t('Entity Type')}
              selected={selectFields.entityTypeVariant.value!}
              options={ENTITY_TYPES_VARIANTS}
              onChange={onChangeSelect}
            />
            <SelectHOC
              zIndex={27}
              baseSelectProps={{
                name: 'entityType',
                value: selectFields.entityType.value,
                isDisabled: selectFields.entityTypeVariant.value!.value === ENTITY_TYPES_VARIANTS[0].value,
                options: ENTITY_TYPES,
                onChange: onChangeSelect,
              }}
            />
            <SelectHOC
              label={t('LocationType')}
              zIndex={26}
              baseSelectProps={{
                name: 'locationType',
                value: selectFields.locationType.value,
                options: LOCATION_TYPES,
                onChange: onChangeSelect,
              }}
            />
            <SelectHOC
              label={t('Channel Type')}
              zIndex={25}
              baseSelectProps={{
                name: 'channelType',
                value: selectFields.channelType.value,
                options: CHANNEL_TYPES,
                onChange: onChangeSelect,
              }}
            />
            <NewDatePicker
              t={t}
              label={t('Date Location Opened')}
              name="openedDate"
              value={textFields.openedDate.value}
              onChange={onChangeDate}
            />
            <Grid container>
              <Grid item xs={12} md={6}>
                <Input
                  label={t('Number of Employees')}
                  error={textFields.employees.error}
                  name="employees"
                  type="text"
                  value={textFields.employees.value}
                  onChange={onChangeTextField}
                />
              </Grid>
            </Grid>
            <SelectHOC
              label={t('Time Zone')}
              zIndex={24}
              baseSelectProps={{
                name: 'timeZone',
                value: selectFields.timeZone.value,
                options: TIMEZONES,
                onChange: onChangeSelect,
              }}
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default ProfileTabLayout;
