import React, {ChangeEvent, SyntheticEvent} from 'react';
import styles from 'pages/SignUpPage/styles.module.scss';
import {TFunction} from 'i18next';
import Input from 'components/Input';
import Button from 'components/Button';
import {History} from 'history';
import ROUTES from 'router/routes';
import Link from 'components/Link';
import MessageBox from 'components/MessageBox';

interface IProps {
  history: History;
  t: TFunction;
  textFields: ITextFieldsState;
  initiated: boolean;
  isRegistered: boolean;
  signUpLoading: boolean;
  signUpError: string;
  onChangeTextField: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: SyntheticEvent) => void;
}

const SignUpPageLayout: React.FunctionComponent<IProps> = ({
  textFields,
  isRegistered,
  initiated,
  history,
  signUpLoading,
  signUpError,
  onChangeTextField,
  onSubmit,
  t,
}) => {
  let containerClasses = styles.container;
  if (initiated) {
    containerClasses += ` ${styles.containerInit}`;
  }
  return (
    <div className={containerClasses}>
      <div className={styles.leftCol}>
        <div className={styles.leftColHolder}>
          <img className={styles.logo} src={require('assets/images/logo-engage-white.svg')} alt="Engage" />
        </div>
        <strong className={styles.introText}>
          {t(
            'Engage solved the problem by using patented technology to create a entirely new communication channel designed specifically for commerce that allows any form of content and two-way communication to be embedded into a any card transaction without need to collect any personal information whatsoever.',
          )}
        </strong>
      </div>
      <form className={styles.box} onSubmit={onSubmit}>
        <h1 className={styles.title}>{t('Sign Up')}</h1>
        {!isRegistered ? (
          <>
            <Input
              label={t('First Name')}
              error={textFields.firstName.error}
              name="firstName"
              type="text"
              value={textFields.firstName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Last Name')}
              error={textFields.lastName.error}
              name="lastName"
              type="text"
              value={textFields.lastName.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('E-mail')}
              error={textFields.email.error}
              name="email"
              type="text"
              value={textFields.email.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Password')}
              error={textFields.password.error}
              name="password"
              type="password"
              value={textFields.password.value}
              onChange={onChangeTextField}
            />
            <Input
              label={t('Confirm Password')}
              error={textFields.confirmPassword.error}
              name="confirmPassword"
              type="password"
              value={textFields.confirmPassword.value}
              onChange={onChangeTextField}
            />
            <div className={styles.bottomRow}>
              <Button className={styles.btnSubmit} disabled={signUpLoading} loading={signUpLoading} onClick={onSubmit}>
                Register
              </Button>
              <span className={styles.loginText}>
                {t('Do you have an account?')} <Link onClick={() => history.push(ROUTES.LOGIN)}>{t('Log In')}</Link>
              </span>
            </div>
            {!!signUpError && (
              <MessageBox className={styles.message} type="danger">
                {signUpError}
              </MessageBox>
            )}
          </>
        ) : (
          <>
            <MessageBox className={styles.successMessage} type="success">
              Your account has been successfully created. The verification email was sent to {textFields.email.value}.
            </MessageBox>
            <Button className={styles.btnSubmit} onClick={() => history.push(ROUTES.LOGIN)}>
              Login
            </Button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignUpPageLayout;
