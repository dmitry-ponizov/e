import React, {ChangeEvent} from 'react';
import styles from 'components/Checkbox/styles.module.scss';
import Icon from 'components/Icon';

interface IProps {
  name: string;
  label?: string;
  checked: boolean;
  alternate?: boolean;
  onChange: (e: ChangeEvent) => void;
  containerClass?: string;
  inputClass?: string;
  inputActiveClass?: string;
  labelClass?: string;
}

const Checkbox: React.FC<IProps> = ({
  alternate,
  containerClass,
  inputClass,
  labelClass,
  name,
  checked,
  onChange,
  label,
  inputActiveClass,
}) => {
  let containerClasses = styles.container;
  if (containerClass) {
    containerClasses += ` ${containerClass}`;
  }

  let fakeClasses = styles.fake;
  if (alternate) {
    fakeClasses += ` ${styles.alternate}`;
  }
  if (inputClass) {
    fakeClasses += ` ${inputClass}`;
  }
  if (checked) {
    fakeClasses += ` ${styles.active}`;
    if (inputActiveClass) {
      fakeClasses += ` ${inputActiveClass}`;
    }
  }

  let labelClasses = styles.label;
  if (labelClass) {
    labelClasses += ` ${labelClass}`;
  }

  return (
    <label className={containerClasses}>
      <input
        className={styles.input}
        name={name}
        checked={checked}
        type="checkbox"
        onChange={onChange}
      />
      <span className={fakeClasses}>
        <Icon className={styles.icon} name="check" />
      </span>
      {!!label && <span className={labelClasses}>{label}</span>}
    </label>
  );
};

export default Checkbox;
