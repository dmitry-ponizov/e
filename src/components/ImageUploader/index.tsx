import React, {ChangeEvent} from 'react';
import styles from 'components/ImageUploader/styles.module.scss';
import Icon, {IconName} from 'components/Icon';
import {TFunction} from 'i18next';
import Button from 'components/Button';
import Link from 'components/Link';
import Label from 'components/Label';
import Tooltip from 'components/Tooltip';

interface IProps {
  t: TFunction;
  label?: string;
  error?: string;
  className?: string;
  url: string;
  onChange: (url: string, file: File | null) => void;
  onUpload: () => void;
  hasChanges?: boolean;
  loading?: boolean;
  disabled?: boolean;
  alt?: boolean;
}

const ImageUploader: React.FC<IProps> = ({
  t,
  className,
  url,
  onChange,
  label,
  error,
  hasChanges,
  onUpload,
  loading,
  disabled,
  alt,
}) => {
  let wrapClasses = styles.wrap;
  if (className) {
    wrapClasses += ` ${className}`;
  }
  if (disabled) {
    wrapClasses += ` ${styles.inputDisabled}`;
  }
  let saveClasses = styles.save;
  if (loading) {
    saveClasses += ` ${styles.disabled}`;
  }

  const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) {
      return onChange('', null);
    }
    const file = e.target.files[0];
    onChange(URL.createObjectURL(file), file);
  };

  const iconStyles = {color: '#fff', fontSize: ' 32px'};

  return (
    <div className={wrapClasses}>
      {alt ? (
        <div className={styles.container}>
          <div className={styles.altIcons}>
            <Tooltip dark={true} content={t('Change image')}>
              <input className={styles.input} disabled={disabled} type="file" onChange={handleChangeImage} />
              <Icon name={'pencil'} style={iconStyles} />
            </Tooltip>

            {url && (
              <Tooltip dark={true} content={t('Delete image')}>
                <span onClick={() => onChange('', null)}>
                  <Icon name={'delete'} style={iconStyles} />
                </span>
              </Tooltip>
            )}

            {hasChanges && (
              <Tooltip dark={true} content={t('Save image')}>
                <span onClick={onUpload}>
                  <Icon name={'save'} style={iconStyles} />
                </span>
              </Tooltip>
            )}
          </div>
        </div>
      ) : (
        <>
          {!!label && <Label>{label}</Label>}
          <div className={styles.container}>
            {url ? (
              <div className={styles.preview}>
                <img className={styles.image} src={url} alt="Logo" />
                {!disabled && (
                  <Link className={styles.close} onClick={() => onChange('', null)}>
                    <Icon name="close" />
                  </Link>
                )}
              </div>
            ) : (
              <>
                <Icon className={styles.addIcon} name="add-image" />
                <span className={styles.title}>{t('Drag files to upload')}</span>
                <span className={styles.requirements}>{t('Formats: jpg, png (10 Mb max)')}</span>
                <span className={styles.or}>{t('– OR –')}</span>
                <Button className={styles.btnUpload}>{t('Upload image')}</Button>
                <input className={styles.input} disabled={disabled} type="file" onChange={handleChangeImage} />
              </>
            )}
            {hasChanges && (
              <Link className={saveClasses} onClick={onUpload}>
                {t('Save')}
              </Link>
            )}
          </div>
        </>
      )}
      {!!error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

export default ImageUploader;
