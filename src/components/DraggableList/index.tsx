import React, {FC, useState} from 'react';
import styles from 'components/DraggableList/styles.module.scss';
import Button from 'components/Button';
import Icon from 'components/Icon';
import {TFunction} from 'i18next';
import {ReactSortable} from 'react-sortablejs-typescript';

interface ISortableItem {
  id: string;
  label: string;
  isActive: boolean;
}

interface IProps {
  t: TFunction;
  items: ISortableItem[];
  defaultItems: ISortableItem[];
  onChange: (items: ISortableItem[]) => void;
  label?: string;
}

const ignoredItemClass = 'ignore-drag';

export const DraggableList: FC<IProps> = ({items, label, onChange, t, defaultItems}) => {
  const [isOpened, setOpen] = useState(false);
  const [tempItems, setTempItems] = useState(items);

  const handleReset = () => {
    setTempItems([...defaultItems]);
  };

  const handleApply = () => {
    setOpen(false);
    onChange([...tempItems]);
  };

  const handleVisibilityChange = id => {
    setTempItems(
      tempItems.map(el => {
        if (el.id === id) {
          return {...el, isActive: !el.isActive};
        }
        return el;
      }),
    );
  };

  const numbersList: JSX.Element[] = [];
  const itemsList: JSX.Element[] = [];
  tempItems.forEach((item, i) => {
    numbersList.push(
      <div className={styles.number} key={item.id}>
        {i + 1}
      </div>,
    );

    let itemClasses = styles.item;
    if (i === 0) {
      itemClasses += ` ${ignoredItemClass}`;
    }
    if (!item.isActive) {
      itemClasses += ` disabled`;
    }
    let btnClasses = styles.visibilityBtn;
    if (item.isActive) {
      btnClasses += ` ${styles.visibilityBtnActive}`;
    }
    itemsList.push(
      <div className={itemClasses} key={item.id}>
        <Icon name="move" className={styles.moveIcon} />
        <span className={styles.itemLabel}>{item.label}</span>
        <div
          onClick={() => handleVisibilityChange(item.id)}
          onMouseDown={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className={btnClasses}
        >
          <Icon name={item.isActive ? 'visible' : 'invisible'} />
        </div>
      </div>,
    );
  });

  const isDefault = !tempItems.some((item, i) => tempItems[i].id !== defaultItems[i].id);

  return (
    <div className={styles.container}>
      <div className={styles.opener} onClick={() => setOpen(true)}>
        {!!label && <span className={styles.label}>{label}</span>}
        <span className={styles.value}>{isDefault ? t('Default') : t('Custom')}</span>
        <Icon className={styles.icon} name="columns" />
      </div>
      {isOpened && <div className={styles.overlay} onClick={() => setOpen(false)} />}
      {isOpened && (
        <div className={styles.drop}>
          <div className={styles.opener} onClick={() => setOpen(false)}>
            {!!label && <span className={styles.label}>{label}</span>}
            <span className={styles.value}>{isDefault ? t('Default') : t('Custom')}</span>
            <Icon className={styles.icon} name="columns" />
          </div>
          <span className={styles.title}>
            {t('Determine the column order')}
            <Icon name="pin" className={styles.infoIcon} />
            {t('and their visibility')}
            <Icon name="pin" className={styles.infoIcon} />
            {t('in the data grid')}:
          </span>
          <div className={styles.holder}>
            <div className={styles.numbers}>{numbersList}</div>
            <ReactSortable
              list={tempItems}
              setList={setTempItems}
              className={styles.list}
              filter={`.${ignoredItemClass}`}
            >
              {itemsList}
            </ReactSortable>
          </div>
          <div className={styles.actions}>
            <Button onClick={handleReset} alt className={styles.btnReset}>
              {t('Reset to default')}
            </Button>
            <Button onClick={handleApply} className={styles.btnApply}>
              {t('Apply')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
