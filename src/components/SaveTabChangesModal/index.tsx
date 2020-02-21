import React from 'react';
import styles from 'components/SaveTabChangesModal/styles.module.scss';
import {TFunction} from 'i18next';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Link from 'components/Link';

interface IProps {
  t: TFunction;
  visible: boolean;
  onAnswer: (answer: ExitAnswer) => void;
}

const SaveTabChangesModal: React.FC<IProps> = ({t, visible, onAnswer}) => {
  return (
    <Modal className={styles.box} visible={visible} onClose={() => onAnswer('cancel')}>
      <div className={styles.topCircle}>!</div>
      <span className={styles.title}>{t('Leave without saving?')}</span>
      <span className={styles.sub}>{t('Your changes will be lost if you don’t save them')}</span>
      <Button className={styles.btn} onClick={() => onAnswer('save-continue')}>
        {t('Save and continue')}
      </Button>
      <Link className={styles.link} onClick={() => onAnswer('continue')}>
        Don’t save
      </Link>
    </Modal>
  );
};

export default SaveTabChangesModal;
