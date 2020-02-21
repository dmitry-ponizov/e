import React, {useState} from 'react';
import styles from 'components/NewDatePicker/styles.module.scss';
import DayPicker, {DateUtils} from 'react-day-picker';
import {TFunction} from 'i18next';
import Icon, {IconName} from 'components/Icon';
import 'components/NewDatePicker/styles.scss';
import Label from 'components/Label';
import Button from 'components/Button';
import moment from 'moment';
import {getStringFromValues, getValuesFromString} from 'helpers/convertDate';

interface IProps {
  className?: string;
  label?: string;
  name: string;
  innerLabel?: string;
  splitter?: string;
  openerIcon?: IconName;
  value: string;
  error?: string;
  onChange: (name: string, value: string) => void;
  t: TFunction;
}

const changeMonth = (date: Date, change: number): Date => {
  const momentDate = moment(date);
  change > 0 ? momentDate.add(change, 'month') : momentDate.subtract(-change, 'month');
  return momentDate.toDate();
};

const NewDatePicker: React.FC<IProps> = ({
  value,
  onChange,
  className,
  label,
  innerLabel,
  openerIcon,
  name,
  t,
}) => {
  const [values, setValues] = useState<Date[]>(getValuesFromString(value));
  const [month, setMonth] = useState<Date>(values[0] || new Date());
  const [active, setActive] = useState<boolean>(false);

  const readableValue = getStringFromValues(values);

  const handleDayClick = day => {
    if (values.length > 1) {
      if (!values.length) {
        setValues([day]);
      } else if (values.length === 1) {
        setValues([values[0], day]);
      } else {
        const range = DateUtils.addDayToRange(day, {
          from: values[0],
          to: values[1],
        });
        setValues([range.from, range.to]);
      }
    } else {
      setValues([day]);
      onChange(name, getStringFromValues([day]));
      setActive(false);
    }
  };

  const modifiers = values.length > 1 ? {start: values[0], end: values[1]} : undefined;

  let containerClasses = styles.container;
  if (active) {
    containerClasses += ` ${styles.containerActive}`;
  }
  if (!label) {
    containerClasses += ` ${styles.containerNoLabel}`;
  }
  if (values.length === 1) {
    containerClasses += ` datepicker-single`;
  }

  let wrapperClasses = styles.wrapper;
  if (className) {
    wrapperClasses += ` ${className}`;
  }
  if (active) {
    wrapperClasses += ` ${styles.wrapperActive}`;
  }

  let iconClasses = styles.openerIcon;
  if (!openerIcon) {
    iconClasses += ` ${styles.openerIconDefault}`;
  }

  return (
    <div className={wrapperClasses}>
      {label && <Label className={styles.label}>{label}</Label>}

      <div className={containerClasses}>
        {active && (
          <>
            <div className={styles.overlay} onClick={() => setActive(false)} />
            <div className={styles.drop}>
              <div className={styles.dpHeading}>
                <span className={styles.dpTitle}>{moment(month).format('MMMM YYYY')}</span>
                <div className={styles.headRight}>
                  <div className={styles.monthBtn} onClick={() => setMonth(changeMonth(month, -1))}>
                    <Icon name="angle-left" />
                  </div>
                  <div className={styles.monthBtn} onClick={() => setMonth(changeMonth(month, +1))}>
                    <Icon name="angle-right" />
                  </div>
                </div>
              </div>
              <div className={styles.pickerHolder}>
                <DayPicker
                  selectedDays={values.length === 1 ? values : [{from: values[0], to: values[1]}]}
                  modifiers={modifiers}
                  onDayClick={handleDayClick}
                  month={month}
                  captionElement={() => null}
                />
              </div>
              {values.length > 1 && (
                <div className={styles.actions}>
                  <Button alt className={styles.resetBtn} onClick={() => setValues(getValuesFromString(value))}>
                    {t('Reset')}
                  </Button>
                  <Button
                    className={styles.applyBtn}
                    onClick={() => {
                      onChange(name, readableValue);
                      setActive(false);
                    }}
                  >
                    {t('Apply')}
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        <div
          className={styles.opener}
          onClick={() => {
            if (active) {
              setActive(false);
            } else {
              setValues(getValuesFromString(value));
              setMonth(values[0] || new Date());
              setActive(true);
            }
          }}
        >
          {!!innerLabel && <span className={styles.innerLabel}>{innerLabel}</span>}
          <span className={styles.openerValue}>{active ? readableValue : value}</span>
          <Icon name={openerIcon || 'arrow-down'} className={iconClasses} />
        </div>
      </div>
    </div>
  );
};

export default NewDatePicker;
