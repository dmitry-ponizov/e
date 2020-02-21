import React, {ChangeEvent, SyntheticEvent} from 'react';
import styles from './styles.module.scss';
import Input from 'components/Input';
import Button from 'components/Button';
import {TFunction} from 'i18next';
import {History} from 'history';
import ROUTES from 'router/routes';
import Link from 'components/Link';
import MessageBox from '../../components/MessageBox';

interface IProps {
  email: IFormFieldState;
  step: string;
  resetPasswordError: string;
  onChangeField: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
  resetPasswordLoading: boolean;
  history: History;
  initiated: boolean;
  t: TFunction;
}

const ForgotPageLayout: React.FunctionComponent<IProps> = ({
  email,
  step,
  resetPasswordError,
  onChangeField,
  onSubmit,
  resetPasswordLoading,
  history,
  initiated,
  t,
}) => {
  let containerClasses = styles.container;
  if (initiated) {
    containerClasses += ` ${styles.containerInit}`;
  }

  return (
    <div className={containerClasses}>
      <div className={styles.leftCol}>
        <strong className={styles.introText}>
          {t(
            'Engage solved the problem by using patented technology to create a entirely new communication channel designed specifically for commerce that allows any form of content and two-way communication to be embedded into a any card transaction without need to collect any personal information whatsoever.',
          )}
        </strong>
      </div>
      <form className={styles.box} onSubmit={onSubmit}>
        <img className={styles.logo} src={require('assets/images/logo-engage-color.svg')} alt="Engage" />
        {step === '1' && (
          <>
            <Link onClick={() => history.push(ROUTES.LOGIN)} className={styles.back}>
              {t('< Back to Log in')}
            </Link>
            <h1 className={styles.title}>{t('Forgot Password?')}</h1>
            <span className={styles.text}>{t('Enter an e-mail and we’ll send you a link to reset your password')}</span>
            <Input
              label="E-mail"
              placeholder={t('example@mail.com')}
              error={email.error}
              name="email"
              type="text"
              value={email.value}
              onChange={onChangeField}
            />
            <Button className={styles.btn} disabled={resetPasswordLoading} loading={resetPasswordLoading} onClick={onSubmit}>
              {t('Reset')}
            </Button>
            {resetPasswordError && (
              <MessageBox type="danger" className={styles.message}>
                {resetPasswordError}
              </MessageBox>
            )}
          </>
        )}
        {step === '2' && (
          <>
            <h1 className={styles.title}>{t('Recovering password')}</h1>
            <MessageBox className={styles.text}>
              {t('An email has been sent to')} {email.value} <br />
              {t('Please check your inbox.')}
            </MessageBox>
            <Button className={styles.btn} onClick={() => history.push(ROUTES.LOGIN)}>
              {t('Login')}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default ForgotPageLayout;
