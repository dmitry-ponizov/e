import React from 'react';
import styles from 'components/ModuleLoader/styles.module.scss';

const ModuleLoader = () => {
  return (
    <div className={styles.loader}>
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 100 100">
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
    </div>
  );
};

export default ModuleLoader;
