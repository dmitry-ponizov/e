import React from 'react';
import styles from 'pages/LocationsPage/parts/OperationTab/styles.module.scss';
import {TFunction} from 'i18next';
import Checkbox from 'components/Checkbox';
import SelectHOC from 'components/SelectHOC';
import SaveTabChangesModal from 'components/SaveTabChangesModal';
import TitlePanel from 'components/TitlePanel';
import LocationTabsSwitcher from 'pages/LocationsPage/parts/LocationTabsSwitcher';
import ControlButton from 'components/ControlButton';
import Icon from 'components/Icon';
import {IOperationState} from 'pages/LocationsPage/parts/OperationTab/container';
import HOURS from 'constants/hours';

interface IProps {
  t: TFunction;

  operations: IOperationState[];

  onChangeOperation: (operationIndex: number, type: 'startTime' | 'endTime', value: IOption) => void;
  onChangeClose: (operationIndex: number) => void;

  onReset: () => void;
  onSave: () => void;

  selectedLocation: ILocation | null;
  hasChanges: boolean;
  updateLocationLoading: boolean;

  onRequestChangeTab: (tab: LocationTabType) => void;
  onChangeTabAnswer: (answer: ExitAnswer) => void;
  exitModalIsOpen: boolean;
}

const OperationTabLayout: React.FC<IProps> = ({
  t,
  operations,
  onChangeOperation,
  onChangeClose,
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
      <LocationTabsSwitcher active="operation" onChange={onRequestChangeTab} />
      <div className={styles.tabContent}>
        <h2>{t('Operation')}</h2>
        <div className={styles.heading}>
          <span className={styles.title}>Start Time</span>
          <span className={`${styles.title} ${styles.title2}`}>End Time</span>
        </div>

        {operations.map((operation, i) => (
          <div key={operation.dayOfWeek} className={styles.row}>
            <span className={styles.weekDay}>{operation.dayOfWeek}</span>
            <SelectHOC
              zIndex={30 - i}
              containerClass={styles.select}
              baseSelectProps={{
                name: `${operation.dayOfWeek}-start`,
                value: operation.startTime.value,
                options: HOURS,
                onChange: (name, option) => onChangeOperation(i, 'startTime', option),
              }}
            />
            <div className={styles.divider} />
            <SelectHOC
              zIndex={30 - i}
              containerClass={styles.select}
              baseSelectProps={{
                name: `${operation.dayOfWeek}-end`,
                value: operation.endTime.value,
                options: HOURS,
                onChange: (name, option) => onChangeOperation(i, 'endTime', option),
              }}
            />
            <Checkbox
              alternate
              containerClass={styles.checkbox}
              name={`${operation.dayOfWeek}-isClosed`}
              label={t('Operation closed')}
              checked={operation.isClosed}
              onChange={() => onChangeClose(i)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default OperationTabLayout;
