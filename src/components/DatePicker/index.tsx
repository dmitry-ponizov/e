import React, {ChangeEvent, useState} from 'react';
import styles from 'components/DatePicker/styles.module.scss';
import DayPicker from 'react-day-picker';
import Input, {IInputProps} from 'components/Input';
import SelectHOC from 'components/SelectHOC';
import {fromMonth, months, toMonth, years} from 'constants/date';
import moment from 'moment';
import {Grid} from '@material-ui/core';
import Icon from 'components/Icon';
import 'components/DatePicker/styles.scss';

const YearMonthSelects = ({date, onChange}) => {
  const handleChange = (fieldName, option) => {
    onChange(fieldName, option);
  };

  return (
    <Grid container>
      <Grid item xs={12} md={8}>
        <SelectHOC
          containerClass={styles.select}
          baseSelectProps={{
            name: 'month',
            options: months,
            onChange: handleChange,
            value: months.find(month => month.value === `${date.getMonth()}`) || '',
          }}
        />
      </Grid>
      <Grid item xs={12} md={4}>
        <SelectHOC
          containerClass={styles.select}
          baseSelectProps={{
            name: 'year',
            options: years,
            onChange: handleChange,
            value: years.find(year => year.value === `${date.getFullYear()}`) || '',
          }}
        />
      </Grid>
    </Grid>
  );
};

const DatePicker: React.FC<IInputProps> = props => {
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [date, setDate] = useState(moment(props.value).toDate() || new Date());

  const dateValue = moment(props.value);

  const handleYearMonthChange = (fieldName, option) => {
    const newDate = new Date(date.getTime());
    if (fieldName === 'month') {
      newDate.setMonth(parseInt(option.value));
    } else {
      newDate.setFullYear(parseInt(option.value));
    }
    setDate(newDate);
  };

  const handleDayClick = (day: Date) => {
    setDate(day);
    setShowDatepicker(false);
    props.onChange({
      target: {
        name: props.name,
        value: moment(day).format('MMM DD, YYYY'),
      },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className={styles.inputHolder}>
      <Input {...props} value={dateValue.format('MMM DD, YYYY')} />
      <div className={styles.opener} onClick={() => setShowDatepicker(true)}>
        <Icon name="calendar" />
      </div>
      {showDatepicker && (
        <>
          <div className={styles.overlay} onClick={() => setShowDatepicker(false)} />
          <DayPicker
            className={styles.datepicker}
            selectedDays={dateValue.toDate()}
            onDayClick={handleDayClick}
            fromMonth={fromMonth}
            toMonth={toMonth}
            month={date}
            captionElement={({date}) => (
              <YearMonthSelects date={date} onChange={handleYearMonthChange} />
            )}
          />
        </>
      )}
    </div>
  );
};

export default DatePicker;
