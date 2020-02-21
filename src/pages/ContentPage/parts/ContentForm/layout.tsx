import React, {ChangeEvent} from 'react';
import styles from './styles.module.scss';
import {TFunction} from 'i18next';
import {Grid} from '@material-ui/core';
import ModuleLoader from 'components/ModuleLoader';
import Input from 'components/Input';
import SelectHOC from 'components/SelectHOC';
import Checkbox from 'components/Checkbox';
import TitlePanel from 'components/TitlePanel';
import ControlButton from 'components/ControlButton';
import Icon from 'components/Icon';
import DatePicker from 'components/DatePicker';
import MultiSelect from 'components/MultiSelect';
import ContentCard from 'components/ContentCard';
import WidgetBlock from 'components/WidgetBlock';
import BlockToggle from 'components/BlockToggle';
import Switcher from 'components/Switcher';
import moment from 'moment';

interface IMoreItemsResponse {
  hasMore: boolean;
  items: IOption[];
}

interface ICardContent {
  name: string;
  logo: string;
  rules: string;
  expires: string;
  offerCode: number;
  image: string;
}

interface ICardInfoBar {
  points: number;
  level: number;
  program: string;
  reward: string;
  next: string;
}

interface ICardMerchantData {
  title: string;
  name: string;
  address: string;
  phone: string;
  type: string;
  workTime: string;
}

interface ICardConfig {
  content: {
    isCustom: boolean;
    isFacebook: boolean;
    isTwitter: boolean;
    isInstagram: boolean;
  };
  integrations: {
    reservation: boolean;
    delivery: boolean;
    schedule: boolean;
  };
  isImageShow: boolean;
  isLogoShow: boolean;
}

interface IProps {
  t: TFunction;
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  checkboxFields: ICheckboxFieldsState;
  multiSelectFields: IMultiSelectsState;
  selectedContentItemDetails: IContentItemDetails;

  getContentLoading: boolean;

  updateContentLoading: boolean;
  deleteContentItemLoading: boolean;
  contentPublishLoading: boolean;
  isContentCardHovered: boolean;

  onChangeTextField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeSelectField: (name: string, value: IOption) => void;
  onChangeCheckboxField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeMultiSelect: (name: string, options: string[]) => void;
  onToggleContent: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleIntegrations: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleCardConfig: (e: ChangeEvent<HTMLInputElement>) => void;

  onUpdateContent: () => void;
  onDeleteContent: () => void;

  // image
  onUploadImage: () => void;
  onChangeImage: (imageUrl: string, image: File | null) => void;
  updateContentImageLoading: boolean;

  contentInitialGroups: IOption[];
  onPublishContent: (isPublished: boolean) => void;
  cardConfig: ICardConfig;
  cardContent: ICardContent;
  cardSocialData: string[];
  updateContentImageError: string;
  cardInfoBar: ICardInfoBar;
  cardMerchantData: ICardMerchantData;
  hasChanges: boolean;
  isImageUploaded: boolean;

  onLoadLocations: (search: string, loadedOptions: IOption[]) => Promise<ILoadOptionsResponse>;
  onLoadGroups: (loadedOptions: IOption[]) => Promise<IMoreItemsResponse>;
}

const createWidget = (date: string, title: string): JSX.Element => {
  const time = moment(date);
  return (
    <Grid item xs={12} md={3} key={title}>
      <WidgetBlock
        mainTitle={title}
        items={[
          {
            title: time.format('MMMM DD, YYYY'),
            icon: <Icon name="calendar" />,
            subTitle: time.format('dddd'),
          },
          {
            title: time.format('h:mm a'),
            icon: <Icon name="like" />, // TODO: update icon
          },
        ]}
      />
    </Grid>
  );
};

const ContentPageLayout: React.FunctionComponent<IProps> = ({
  t,
  textFields,
  checkboxFields,
  selectFields,
  onDeleteContent,
  onUpdateContent,
  multiSelectFields,
  onChangeCheckboxField,
  onChangeSelectField,
  onChangeMultiSelect,
  cardConfig,
  cardContent,
  getContentLoading,
  onChangeTextField,
  onToggleContent,
  onToggleIntegrations,
  onToggleCardConfig,
  cardSocialData,
  cardInfoBar,
  cardMerchantData,
  onLoadLocations,
  onUploadImage,
  onChangeImage,
  updateContentImageLoading,
  onLoadGroups,
  isImageUploaded,
  onPublishContent,
  contentInitialGroups,
  selectedContentItemDetails,
  updateContentLoading,
  deleteContentItemLoading,
  contentPublishLoading,
  hasChanges,
  updateContentImageError,
}) => {
  const widgets: JSX.Element[] = [];

  const {/* publishStart, publishStop,  */ isPublish, name} = selectedContentItemDetails;
  // let isStarted = false;
  // if (publishStart && publishStop) {
  //   isStarted = moment(publishStart).isAfter(moment(publishStop));
  //   if (isStarted) {
  //     widgets.push(createWidget(publishStart, t('Publishing Start')))
  //   } else {
  //     widgets.push(createWidget(publishStop, t('Publishing Stop')))
  //   }
  // } else {
  //   if (publishStart) {
  //     widgets.push(createWidget(publishStart, t('Publishing Start')));
  //     isStarted = true;
  //   }
  //   if (publishStop) widgets.push(createWidget(publishStop, t('Publishing Stop')));
  // }

  const isLoading = updateContentLoading || deleteContentItemLoading || contentPublishLoading;

  return (
    <Grid container>
      <Grid container>
        <Grid item xs={12} lg={9}>
          <TitlePanel
            title={name}
            actions={
              <>
                <ControlButton onClick={onDeleteContent} loading={deleteContentItemLoading} disabled={isLoading}>
                  <Icon name="delete" />
                  {t('Delete')}
                </ControlButton>

                <ControlButton
                  onClick={() => onPublishContent(false)}
                  loading={contentPublishLoading}
                  disabled={!isPublish || isLoading}
                >
                  <Icon name="stop" />
                  {t('Stop')}
                </ControlButton>

                <ControlButton
                  alt
                  onClick={onUpdateContent}
                  loading={updateContentLoading}
                  disabled={!hasChanges || isLoading}
                >
                  <Icon name="save" />
                  {t('Save')}
                </ControlButton>

                <ControlButton
                  onClick={() => onPublishContent(true)}
                  loading={contentPublishLoading}
                  disabled={isPublish || isLoading}
                >
                  <Icon name="play" />
                  {t('Start')}
                </ControlButton>
              </>
            }
          />
          <div className={styles.box}>
            <Grid item xs={12} md={6}>
              <Input
                name="name"
                type="text"
                error={textFields.name.error}
                label={t('Name')}
                value={textFields.name.value}
                onChange={onChangeTextField}
              />
              <SelectHOC
                label={t('Location')}
                error={selectFields.location.error}
                zIndex={10}
                baseSelectProps={{
                  name: 'location',
                  value: selectFields.location.value,
                  onChange: onChangeSelectField,
                }}
                asyncSelectProps={{
                  loadOptions: onLoadLocations,
                  debounceTimeout: 500,
                }}
              />
              <MultiSelect
                t={t}
                label={t('Group')}
                description={`${t('Select groups')}:`}
                name={'groups'}
                selected={multiSelectFields.groups.values}
                options={contentInitialGroups}
                onChange={onChangeMultiSelect}
                // getItemsAsync={onLoadGroups}
              />
            </Grid>
            <Grid container>
              <Grid item xs={12} md={3}>
                <Checkbox
                  containerClass={styles.checkbox}
                  alternate
                  name="isOfferInclude"
                  label={t('Includes Offer')}
                  checked={checkboxFields.isOfferInclude}
                  onChange={onChangeCheckboxField}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Checkbox
                  containerClass={styles.checkbox}
                  alternate
                  name="isSharingAllowed"
                  label={t('Is sharing allowed')}
                  checked={checkboxFields.isSharingAllowed}
                  onChange={onChangeCheckboxField}
                />
              </Grid>
            </Grid>

            <Input
              label={t('Rules & Conditions')}
              error={textFields.rules.error}
              multiline
              placeholder={''}
              name="rules"
              type="text"
              value={textFields.rules.value}
              onChange={onChangeTextField}
            />

            <Grid container>
              <Grid item xs={3}>
                <DatePicker
                  label={t('Expiration Date')}
                  error={textFields.expirationDate.error}
                  name="expirationDate"
                  type="text"
                  value={moment(textFields.expirationDate.value).format('MMM DD, YYYY')}
                  onChange={onChangeTextField}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item xs={12} md={2}>
                <BlockToggle
                  title={t('Logo')}
                  content={
                    <Switcher onChange={onToggleContent} name="isLogoShow" checked={cardConfig.isLogoShow}>
                      <Icon name="image" />
                    </Switcher>
                  }
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <BlockToggle
                  title={t('Content')}
                  content={
                    <>
                      <Switcher onChange={onToggleContent} name="isCustom" checked={cardConfig.content.isCustom}>
                        <Icon name="pencil" />
                      </Switcher>
                      <div key="-OR-">{'-OR'}</div>
                      <Switcher onChange={onToggleContent} checked={cardConfig.content.isFacebook} name="isFacebook">
                        <Icon name="play" />
                      </Switcher>
                      <Switcher onChange={onToggleContent} name="isTwitter" checked={cardConfig.content.isTwitter}>
                        <Icon name="stop" />
                      </Switcher>
                      <Switcher onChange={onToggleContent} name="isInstagram" checked={cardConfig.content.isInstagram}>
                        <Icon name="delete" />
                      </Switcher>
                    </>
                  }
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <BlockToggle
                  title={t('Integrations')}
                  content={
                    <>
                      <Switcher
                        onChange={onToggleIntegrations}
                        name="reservation"
                        checked={cardConfig.integrations.reservation}
                      >
                        <Icon name="play" />
                      </Switcher>
                      <Switcher
                        onChange={onToggleIntegrations}
                        checked={cardConfig.integrations.delivery}
                        name="delivery"
                      >
                        <Icon name="stop" />
                      </Switcher>
                      <Switcher
                        onChange={onToggleIntegrations}
                        name="schedule"
                        checked={cardConfig.integrations.schedule}
                      >
                        <Icon name="delete" />
                      </Switcher>
                    </>
                  }
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <BlockToggle
                  title={t('Image')}
                  content={
                    <Switcher onChange={onToggleCardConfig} checked={cardConfig.isImageShow} name="isImageShow">
                      <Icon name="image" />
                    </Switcher>
                  }
                />
              </Grid>

              <Grid container>
                <ContentCard
                  t={t}
                  isImageShow={cardConfig.isImageShow}
                  isLogoShow={cardConfig.isLogoShow}
                  cardContent={cardContent}
                  cardInfoBar={cardInfoBar}
                  cardSocialData={cardSocialData}
                  cardMerchantData={cardMerchantData}
                  onChangeImage={onChangeImage}
                  onUploadImage={onUploadImage}
                  isImageUploaded={isImageUploaded}
                  updateContentImageError={updateContentImageError}
                  updateContentImageLoading={updateContentImageLoading}
                />
              </Grid>
            </Grid>

            <Grid container>
              <Grid item md={3}>
                <WidgetBlock
                  mainTitle={'Publishing Start'}
                  items={[
                    {title: 'December 08, 2019', icon: <Icon name="calendar" />, subTitle: 'Monday'},
                    {
                      title: '4:37 PM ET',
                      icon: <Icon name="like" />, //<===Change to correct!!!
                    },
                  ]}
                />
              </Grid>
              <Grid item md={3}>
                <WidgetBlock
                  mainTitle={'Publishing Stop'}
                  items={[
                    {title: 'August 28, 2020', icon: <Icon name="calendar" />, subTitle: 'Friday'},
                    {
                      title: '10:37 PM ET',
                      icon: <Icon name="like" />, //<===Change to correct!!!
                    },
                  ]}
                />
              </Grid>
            </Grid>
          </div>

          {getContentLoading && <ModuleLoader />}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContentPageLayout;
