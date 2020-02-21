import React from 'react';
import styles from 'components/Radio/styles.module.scss';
import Label from 'components/Label';

interface IProps {
  name: string;
  label?: string;
  selected: IOption | null;
  options: IOption[];
  onChange: (name: string, value: IOption) => void;
  className?: string;
}

const Radio: React.FC<IProps> = ({className, name, onChange, options, selected, label}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }

  return (
    <div className={containerClasses}>
      {!!label && <Label>{label}</Label>}
      {options.map(option => (
        <label
          key={option.value}
          className={`${styles.item}${selected && selected.value === option.value ? ' ' + styles.active : ''}`}
        >
          <input
            className={styles.input}
            name={name}
            checked={!!selected && selected.value === option.value}
            type="radio"
            onChange={() => onChange(name, option)}
          />
          <span className={styles.fake} />
          <span className={styles.label}>{option.label}</span>
        </label>
      ))}
    </div>
  );
};

export default Radio;
