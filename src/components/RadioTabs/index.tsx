import React, {ChangeEvent} from 'react';
import styles from './styles.module.scss';

interface IProps {
  className?: string;
  alt?: boolean;
  onChange: (e: ChangeEvent) => void;
  disabled?: boolean;
  selected: string;
  options: IOption[];
  name: string;
}

const RadioTabs: React.FunctionComponent<IProps> = ({options, selected, onChange, name, disabled, className, alt}) => {
  let containerClasses = styles.container;
  if (disabled) {
    containerClasses += ` ${styles.disabled}`;
  }
  if (className) {
    containerClasses += ` ${className}`;
  }
  if (alt) {
    containerClasses += ` ${styles.alt}`;
  }

  return (
    <div className={containerClasses}>
      {options.map(option => {
        let optionClasses = styles.option;
        if (option.value === selected) {
          optionClasses += ` ${styles.active}`;
        }
        return (
          <label key={option.value} className={optionClasses}>
            <input
              className={styles.input}
              disabled={disabled}
              name={name}
              type="radio"
              value={option.value}
              checked={option.value === selected}
              onChange={onChange}
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
};

export default RadioTabs;
