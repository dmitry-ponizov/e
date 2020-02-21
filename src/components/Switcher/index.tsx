import React, {ChangeEvent} from 'react';
import styles from 'components/Switcher/styles.module.scss';

interface IProps {
  name: string;
  checked: boolean;
  onChange: (e: ChangeEvent) => void;
  className?: string;
}

const Switcher: React.FC<IProps> = ({onChange, className, name, children, checked}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }
  if (checked) {
    containerClasses += ` ${styles.checked}`;
  }

  return (
    <label className={containerClasses}>
      {children}
      <input name={name} type="checkbox" checked={checked} onChange={onChange} />
    </label>
  );
};

export default Switcher;
