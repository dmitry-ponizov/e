import React from 'react';
import Select, {components, StylesConfig} from 'react-select';
import {SelectComponentsProps} from 'react-select/base';
import Icon from 'components/Icon';
import styles from 'components/SelectHOC/styles.module.scss';
import Label from 'components/Label';
import AsyncPaginate, {AsyncPaginateProps} from 'react-select-async-paginate';

interface IProps {
  async?: boolean;
  label?: string;
  error?: string;
  zIndex?: number;
  containerClass?: string;
  baseSelectProps: SelectComponentsProps & {name: string};
  asyncSelectProps?: AsyncPaginateProps<IOption>;
}

const getSelectStyles = (hasLabel: boolean) => ({
  container: (styles, state) => ({
    ...styles,
    zIndex: state.isFocused ? 999 : 'auto',
    pointerEvents: 'auto',
    cursor: state.isDisabled ? 'no-drop' : 'auto',
    font: '16px/20px Open Sans, Arial, Helvetica, sans-serif',
  }),
  control: (styles, state) => ({
    ...styles,
    position: 'relative',
    zIndex: 2,
    cursor: state.isDisabled ? 'no-drop' : 'pointer',
    minHeight: 30,
    borderColor: state.isFocused ? '#0f6da6' : '#d6dce5',
    backgroundColor: state.isDisabled ? '#d6dce5' : '#fff',
    borderRadius: 2,
    boxShadow: 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#0f6da6' : '#d6dce5',
    },
    '&>div:first-of-type': {
      paddingTop: 0,
      paddingBottom: 0,
    },
  }),
  singleValue: styles => ({
    ...styles,
    color: '#333f50',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: (styles, state) => ({
    position: 'absolute',
    top: hasLabel ? -32 : -8,
    left: -8,
    width: 'calc(100% + 16px)',
    overflow: 'hidden',
    border: '1px solid rgba(15,109,166,0.1)',
    borderRadius: 2,
    backgroundColor: '#fff',
    boxShadow: '0 8px 20px 0 rgba(15,109,166,0.12)',
    padding: '0 4px 8px 8px',
    paddingTop: hasLabel ? 74 : 50,
  }),
  menuList: styles => ({
    ...styles,
    padding: '0 4px 0 0',
    maxHeight: 160,
    '&::-webkit-scrollbar': {
      width: 5,
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(106,203,244,0.2)',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#6acbf4',
      borderRadius: 3,
    },
  }),
  option: (styles, state) => {
    return {
      display: 'flex',
      minHeight: 32,
      alignItems: 'center',
      cursor: 'pointer',
      padding: '4px 12px',
      background: state.isSelected ? 'rgba(106,203,244,0.2)' : 'transparent',
      color: state.isSelected ? '#0f6da6' : '#333f50',
      transition: 'all 0.3s ease',
      '&:hover': {
        background: state.isSelected ? 'rgba(106,203,244,0.2)' : '#f4f8fb',
      },
      '&>i': {
        display: state.isSelected ? 'block' : 'none',
      },
    };
  },
});

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator
      {...props}
      getStyles={() => ({
        width: 30,
        height: 30,
        paddingTop: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      })}
    >
      <Icon name="arrow-down" className={styles.icon} />
    </components.DropdownIndicator>
  );
};

const Option = props => {
  return (
    <components.Option {...props}>
      {props.children}
      <Icon className={`${styles.icon} ${styles.optionIcon}`} name="check" />
    </components.Option>
  );
};

const SelectHOC: React.FC<IProps> = ({label, error, baseSelectProps, asyncSelectProps, containerClass}) => {
  const props = {
    components: {DropdownIndicator, Option},
    styles: getSelectStyles(!!label) as StylesConfig,
    ...baseSelectProps,
    onChange: (option: IOption) => baseSelectProps.onChange(baseSelectProps.name, option),
  };

  let containerClasses = styles.container;
  if (containerClass) {
    containerClasses += ` ${containerClass}`;
  }

  return (
    <div className={containerClasses}>
      {!!label && <Label className={styles.label}>{label}</Label>}
      {asyncSelectProps ? <AsyncPaginate {...props} {...asyncSelectProps} /> : <Select {...props} />}
      {!!error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default SelectHOC;
