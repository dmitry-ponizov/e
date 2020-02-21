import React from 'react';
import styles from 'components/Autocomplete/styles.module.scss';

interface ISuggestion {
  text: string;
  [key: string]: any;
}

interface IProps {
  className?: string;
  suggestions: ISuggestion[];
  onApply: (value?: ISuggestion) => void;
}

const Autocomplete: React.FC<IProps> = ({className, suggestions, children, onApply}) => {
  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }

  return (
    <div className={containerClasses}>
      {children}
      {!!suggestions.length && (
        <>
          <div
            className={styles.overlay}
            onClick={e => {
              e.stopPropagation();
              e.preventDefault();
              onApply();
            }}
          />
          <div className={styles.list}>
            <div className={styles.scrollable}>
              {suggestions.map((suggestion, i) => {
                return (
                  <div
                    key={i}
                    className={styles.suggestion}
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();
                      onApply(suggestion);
                    }}
                  >
                    {suggestion.text}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Autocomplete;
