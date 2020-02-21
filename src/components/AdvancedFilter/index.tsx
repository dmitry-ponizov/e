import React, {useState} from 'react';
import styles from 'components/AdvancedFilter/styles.module.scss';
import Icon, {IconName} from 'components/Icon';
import FILTER_OPERATORS from 'constants/filterOperators';
import {TFunction} from 'i18next';

interface IProps {
  className?: string;
  t: TFunction;
  operator: IOption;
  values: string[];
  onChange: (operator: IOption, values: string[], name: string) => void;
  name: string;
}

const AdvancedFilter: React.FC<IProps> = ({operator, values, name, onChange, t, className}) => {
  const [showSelector, setShowSelector] = useState(false);

  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }
  if (operator.value === 'range') {
    containerClasses += ` ${styles.rangeOperator}`;
  }

  return (
    <div className={containerClasses}>
      <div className={styles.operatorOpener} onClick={() => setShowSelector(!showSelector)}>
        <Icon name={operator.value as IconName} />
      </div>

      <div className={styles.inputs}>
        <label className={styles.inputWrapper}>
          <input
            className={styles.input}
            type="text"
            value={values[0]}
            onChange={e => onChange(operator, [e.target.value, values[1]], name)}
          />
          <Icon className={styles.inputIcon} name="pencil" />
        </label>
        {operator.value === 'range' && (
          <label className={styles.inputWrapper}>
            <input
              className={styles.input}
              type="text"
              value={values[1]}
              onChange={e => onChange(operator, [values[0], e.target.value], name)}
            />
            <Icon className={styles.inputIcon} name="pencil" />
          </label>
        )}
      </div>

      {showSelector && (
        <>
          <div className={styles.overlay} onClick={() => setShowSelector(false)} />
          <div className={styles.drop}>
            <span className={styles.dropTitle}>{t('Select options for row')}:</span>
            {FILTER_OPERATORS.map(option => {
              let optionClasses = styles.operatorOption;
              if (operator.value === option.value) {
                optionClasses += ` ${styles.optionChecked}`;
              }
              return (
                <div className={optionClasses} key={option.value} onClick={() => {
                  onChange(option, [...values], name);
                  setShowSelector(false);
                }}>
                  <Icon className={styles.optionIcon} name={option.value as IconName} />
                  <span className={styles.optionLabel}>{option.label}</span>
                  {operator.value === option.value && <Icon className={styles.checkedIcon} name="check" />}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedFilter;
