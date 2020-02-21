import React, {useState} from 'react';
import styles from 'components/AccountMenu/styles.module.scss';
import Icon from 'components/Icon';

interface IProps {
  name: string;
  image: string;
  content: (closeMenu: () => void) => JSX.Element;
}

const AccountMenu: React.FC<IProps> = ({name, image, content}) => {
  const [active, setActive] = useState(false);
  let containerClasses = styles.container;
  if (active) {
    containerClasses += ` ${styles.menuActive}`;
  }

  return (
    <div className={containerClasses}>
      <div className={styles.opener} onClick={() => setActive(!active)}>
        <div
          className={styles.image}
          style={{backgroundImage: image ? `url(${image}) no-repeat 50% 50% / cover` : '#6acbf4'}}
        >
          {image ? '' : name[0].toUpperCase()}
        </div>
        <span className={styles.intro}>Hi, {name}</span>
        <Icon className={styles.openerIcon} name="arrow-down" />
      </div>
      <div className={styles.overlay} onClick={() => setActive(false)} />
      <div className={styles.menu}>{content(() => setActive(false))}</div>
    </div>
  );
};

export default AccountMenu;
