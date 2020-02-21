import * as React from 'react';
import styles from 'pages/_Extension/FeedPage/parts/CloseButton/styles.module.scss';
import Icon from '../../../../../components/Icon/index';


interface ICloseButtonProps {
    title: string
}

const CloseButton: React.FunctionComponent<ICloseButtonProps> = ({ title }) => {
  const clickHandler = () => {
    window.parent.postMessage({name :"close_iframe", type: "_ENGAGE_"}, "*");
  }
  return <div className={styles.container}>
    <div className={styles.circle} onClick={clickHandler} >
      <Icon className={styles.closeIcon} name="close" />
    </div>
    <div className={styles.title} >{title}</div>
    </div>;
};

export default CloseButton;
