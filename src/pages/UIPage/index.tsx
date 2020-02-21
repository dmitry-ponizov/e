import React, {useState} from 'react';
import styles from 'pages/UIPage/styles.module.scss';
import {TFunction} from 'i18next';
import enhance from 'helpers/enhance';
import {withTranslation} from 'react-i18next';
import {Grid} from '@material-ui/core';
import ContentWrapper from 'components/ContentWrapper';
import UIComponents from 'pages/UIPage/components';
import TitlePanel from 'components/TitlePanel';

interface IProps {
  t: TFunction;
}

const UIPageBase: React.FC<IProps> = ({t}) => {
  const [activeTab, setActiveTab] = useState<string>(Object.keys(UIComponents)[0]);

  // const [toggle, setToggle] = useState<boolean>(false);

  return (
    <ContentWrapper title={t('UI')}>
      <Grid container>
        <Grid item xs={12} md={3}>
          <div className={styles.tabsList}>
            {Object.keys(UIComponents).map(key => {
              let tabClasses = styles.tab;
              if (activeTab === key) {
                tabClasses += ` ${styles.activeTab}`;
              }
              return (
                <div className={tabClasses} key={key} onClick={() => setActiveTab(key)}>
                  {key}
                </div>
              );
            })}
          </div>
        </Grid>
        <Grid item xs={12} md={9}>
          <TitlePanel title={activeTab} />
          <div className={styles.tabContent}>
            <div className={styles.description}>
              {UIComponents[activeTab].props.map(prop => {
                const split = prop.split(':');
                return (
                  <div key={prop} className={styles.prop}>
                    <strong>{split[0]}</strong>
                    {split[1] && (
                      <>
                        :<em>{prop.slice(split[0].length + 1)}</em>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            {UIComponents[activeTab].render()}
          </div>
        </Grid>
      </Grid>
    </ContentWrapper>
  );
};

const UIPage = enhance(UIPageBase, [withTranslation()]);
export default UIPage;
