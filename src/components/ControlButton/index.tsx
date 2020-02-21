import React from 'react';
import styles from 'components/ControlButton/styles.module.scss';

interface IProps {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  alt?: boolean;
  onClick?: () => void;
}

const ControlButton: React.FC<IProps> = ({className, onClick, children, alt, disabled, loading}) => {
  let buttonClasses = styles.button;
  if (className) {
    buttonClasses += ` ${className}`;
  }
  if (alt) {
    buttonClasses += ` ${styles.alt}`;
  }
  let onClickProp;
  if (onClick) {
    onClickProp = {
      onClick,
    };
  }

  return (
    <button {...onClickProp} className={buttonClasses} disabled={disabled}>
      {children}
      {loading && (
        <span className={styles.loading}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              r="35"
              strokeDasharray="164.93361431346415 56.97787143782138"
              transform="rotate(239.413 50 50)"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="1s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              />
            </circle>
          </svg>
        </span>
      )}
    </button>
  );
};

export default ControlButton;
