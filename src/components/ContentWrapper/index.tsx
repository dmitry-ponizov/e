import React from 'react';
import styles from 'components/ContentWrapper/styles.module.scss';
import PageContainer from 'components/PageContainer';
import Icon from 'components/Icon';

interface IProps {
  title?: string;
  sub?: string;
  dark?: boolean;
  onClose?: () => void;
}

const ContentWrapper: React.FC<IProps> = ({title, sub, children, onClose, dark}) => {
  let fullStyles = styles.full;
  if (dark) {
    fullStyles += ` ${styles.dark}`;
  }

  return (
    <div className={fullStyles}>
      <PageContainer>
        <div className={styles.heading}>
          {onClose && (
            <div className={styles.close} onClick={onClose}>
              <Icon name="close" />
            </div>
          )}
          {!!title && (
            <h1 className={styles.title}>
              {title}
              {!!sub && <span>{sub}</span>}
            </h1>
          )}
        </div>
        {children}
      </PageContainer>
    </div>
  );
};

export default ContentWrapper;
