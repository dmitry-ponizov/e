import React, {ChangeEvent, SyntheticEvent} from 'react';
import styles from 'pages/LoginPage/styles.module.scss';
import {TFunction} from 'i18next';
import Input from 'components/Input';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import {History} from 'history';
import ROUTES from 'router/routes';
import Link from 'components/Link';
import MessageBox from 'components/MessageBox';

interface IProps {
  t: TFunction;
  email: IFormFieldState;
  password: IFormFieldState;
  remember: boolean;
  loginLoading: boolean;
  initiated: boolean;
  history: History;
  loginError: string;
  onChangeField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeRemember: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

const LoginPageLayout: React.FunctionComponent<IProps> = ({
  email,
  password,
  remember,
  loginError,
  onChangeField,
  onChangeRemember,
  onSubmit,
  loginLoading,
  history,
  initiated,
  t,
}) => {
  const boxClasses = styles.box;
  let containerClasses = styles.container;
  if (initiated) {
    containerClasses += ` ${styles.containerInit}`;
  }

  return (
    <div className={containerClasses}>
      <form className={boxClasses} onSubmit={onSubmit}>
        <img className={styles.logo} src={require('assets/images/logo-engage-color.svg')} alt="Engage" />
        <strong className={styles.title}>{t('Welcome Back!')}</strong>
        <Input
          label="E-mail"
          error={email.error}
          name="email"
          placeholder="example@mail.com"
          type="text"
          value={email.value}
          onChange={onChangeField}
        />
        <Input
          label="Password"
          error={password.error}
          name="password"
          placeholder="********"
          type="password"
          value={password.value}
          onChange={onChangeField}
        />
        <div className={styles.linkHolder}>
          <Checkbox
            alternate
            name="remember"
            label={t('Remember me')}
            checked={remember}
            onChange={onChangeRemember}
            containerClass={styles.remember}
          />
          <Link className={styles.forgotLink} onClick={() => history.push(ROUTES.FORGOT_PASSWORD)}>
            {t('Forgot Password?')}
          </Link>
        </div>
        <Button disabled={loginLoading} loading={loginLoading} className={styles.btnLogin}>
          {t('Log In')}
        </Button>
        <span className={styles.signUpText}>
          {t('Don’t have an account?')} <Link onClick={() => history.push(ROUTES.SIGN_UP)}>{t('Sign Up')}</Link>
        </span>
        {!!loginError && (
          <MessageBox className={styles.message} type="danger">
            {loginError}
          </MessageBox>
        )}
      </form>
    </div>
  );
};

export default LoginPageLayout;
