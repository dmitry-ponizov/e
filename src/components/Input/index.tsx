import React, {ChangeEvent, useState} from 'react';
import styles from 'components/Input/styles.module.scss';
import Icon from 'components/Icon';
import InputMask from 'react-input-mask';

export interface IInputProps {
  name: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  containerClassName?: string;
  placeholder?: string;
  type: string;
  value: string;
  mask?: string;
  onChange: (e: ChangeEvent) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

const Input: React.FC<IInputProps> = ({
  name,
  label,
  error,
  disabled,
  multiline,
  containerClassName,
  placeholder,
  type,
  value,
  mask,
  onChange,
  onFocus,
  onBlur,
}) => {
  const [focused, setFocused] = useState(false);

  let containerClasses = styles.container;
  if (containerClassName) {
    containerClasses += ` ${containerClassName}`;
  }
  if (focused) {
    containerClasses += ` ${styles.focused}`;
  }
  if (error) {
    containerClasses += ` ${styles.containerError}`;
  }

  let inputClasses = styles.input;
  if (error) {
    inputClasses += ` ${styles.inputError}`;
  }
  if (multiline) {
    inputClasses += ` ${styles.multiline}`;
  }

  const formattedProps = {
    disabled,
    name,
    placeholder,
    className: inputClasses,
    value: value,
    onChange,
  };

  const handlerProps = {
    onFocus: () => {
      setFocused(true);
      if (onFocus) onFocus();
    },
    onBlur: () => {
      setFocused(false);
      if (onBlur) onBlur();
    },
  };

  const input = multiline ? (
    <textarea {...formattedProps} {...handlerProps} />
  ) : (
    <input {...formattedProps} {...handlerProps} type={type} />
  );

  return (
    <label className={containerClasses}>
      {!!label && <span className={styles.label}>{label}</span>}
      <div className={styles.inputHolder}>
        {!!mask ? (
          <InputMask mask={mask} value={value} onChange={onChange} {...handlerProps}>
            {props => {
              const mergedProps = {...formattedProps, ...props};
              return <input {...mergedProps} />;
            }}
          </InputMask>
        ) : (
          input
        )}
        {!!error && <Icon name="warning" className={styles.icon} />}
      </div>
      {!!error && <span className={styles.error}>{error}</span>}
    </label>
  );
};

export default Input;
