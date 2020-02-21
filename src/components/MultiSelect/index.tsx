import React, {useEffect, useRef, useState} from 'react';
import styles from 'components/MultiSelect/styles.module.scss';
import Icon, {IconName} from 'components/Icon';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';
import {TFunction} from 'i18next';
import Label from 'components/Label';

interface IProps {
  className?: string;
  label?: string;
  innerLabel?: string;
  description?: string;
  openerIcon?: IconName;
  flatOpener?: boolean;
  selected: string[];
  options: IOption[];
  onChange: (name: string, options: string[]) => void;
  name: string;
  disabled?: boolean;
  getItemsAsync?: (oldItems: IOption[]) => Promise<ILoadOptionsResponse>;
  t: TFunction;
}

const Loader = () => {
  return (
    <svg className={styles.loader} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 100 100">
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
  );
};

interface ILoadingSync {
  [key: string]: boolean;
}
const loadingSync: ILoadingSync = {};

const MultiSelect: React.FC<IProps> = ({
  label,
  innerLabel,
  openerIcon,
  description,
  flatOpener,
  className,
  selected,
  onChange,
  options,
  name,
  getItemsAsync,
  t,
  disabled,
}) => {
  const listOuter = useRef<HTMLDivElement>(null);
  const listInner = useRef<HTMLDivElement>(null);

  const [active, setActive] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selected);

  const [initiated, setInitiated] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [asyncOptions, setAsyncOptions] = useState<IOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      delete loadingSync[name];
    };
  }, [name]);

  const getMoreOptions = async () => {
    if (!getItemsAsync) return;

    loadingSync[name] = true;
    setLoading(true);
    const response = await getItemsAsync(asyncOptions);
    setInitiated(true);
    setLoading(false);
    loadingSync[name] = false;
    setHasMore(response.hasMore);
    setAsyncOptions([...asyncOptions, ...response.options]);
  };

  const handleOpenerClick = async () => {
    if (disabled) return;
    // close
    if (active) {
      setActive(false);
      return;
    }

    // open
    setActive(true);
    // reset temp selected on open
    setTempSelected(selected);

    // request options on first open
    if (getItemsAsync && !initiated && !loading) {
      if (!initiated && !loading) {
        getMoreOptions();
      }
    }
  };

  const handleScrollOptions = () => {
    const innerHeight = listInner.current!.offsetHeight;
    const outerHeight = listOuter.current!.offsetHeight;
    const scroll = listOuter.current!.scrollTop;
    if (!hasMore || loadingSync[name] || innerHeight - outerHeight - scroll > 32) return;

    getMoreOptions();
  };

  const onOptionClick = value => {
    if (tempSelected.indexOf(value) > -1) {
      // remove from selected
      setTempSelected(tempSelected.filter(option => option !== value));
    } else {
      // add to selected
      setTempSelected([...tempSelected, value]);
    }
  };

  const renderReadableValue = (selected: string[]): string => {
    if (!selected.length) {
      return 'Select...';
    }
    return `${selected.length} of ${options.length || '...'}`;
  };

  const renderOption = (option: IOption, checked: boolean) => {
    let optionClasses = `${styles.option}`;
    if (checked) {
      optionClasses += ` ${styles.checkedOption}`;
    }
    return (
      <div className={optionClasses} key={option.value} onChange={() => onOptionClick(option.value)}>
        <Checkbox name={option.value} label={option.label} checked={checked} onChange={() => {}} />
      </div>
    );
  };

  let containerClasses = styles.container;
  if (active) {
    containerClasses += ` ${styles.containerActive}`;
  }
  if (!label) {
    containerClasses += ` ${styles.containerNoLabel}`;
  }

  let wrapperClasses = styles.wrapper;
  if (className) {
    wrapperClasses += ` ${className}`;
  }
  if (active) {
    wrapperClasses += ` ${styles.wrapperActive}`;
  }

  let iconClasses = styles.openerIcon;
  if (!openerIcon) {
    iconClasses += ` ${styles.openerIconDefault}`;
  }

  let openerClasses = styles.opener;
  if (flatOpener) {
    openerClasses += ` ${styles.openerFlat}`;
  }
  if (disabled) {
    openerClasses += ` ${styles.openerDisabled}`
  }

  return (
    <div className={wrapperClasses}>
      {label && <Label className={styles.label}>{label}</Label>}

      <div className={containerClasses}>
        {active && (
          <>
            <div className={styles.overlay} onClick={() => setActive(false)} />
            <div className={styles.drop}>
              {!!description && <span className={styles.description}>{description}</span>}
              <div className={styles.optionsList} onScroll={handleScrollOptions} ref={listOuter}>
                <div className={styles.optionsListInner} ref={listInner}>
                  {/*{renderOption({value: 'all', label: 'All'}, tempSelected.length === options.length)}*/}
                  {[...options, ...asyncOptions].map(option =>
                    renderOption(option, tempSelected.indexOf(option.value) > -1),
                  )}
                </div>
              </div>
              <div className={styles.actions}>
                <Button alt className={styles.resetBtn} onClick={() => setTempSelected(selected)}>
                  {t('Reset')}
                </Button>
                <Button
                  className={styles.applyBtn}
                  onClick={() => {
                    setActive(false);
                    onChange(name, tempSelected);
                  }}
                >
                  {t('Apply')}
                </Button>
              </div>
            </div>
          </>
        )}

        <div className={openerClasses} onClick={handleOpenerClick}>
          {!!innerLabel && <span className={styles.innerLabel}>{innerLabel}</span>}
          <span className={styles.openerValue}>{renderReadableValue(active ? tempSelected : selected)}</span>
          {loading && <Loader />}
          <Icon name={openerIcon || 'arrow-down'} className={iconClasses} />
        </div>
      </div>
    </div>
  );
};

export default MultiSelect;
