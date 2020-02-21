import React, {ChangeEvent} from 'react';
import styles from 'pages/RewardsPage/parts/RewardContent/styles.module.scss';
import {TFunction} from 'i18next';
import {Grid} from '@material-ui/core';
import Input from 'components/Input';
import SelectHOC from 'components/SelectHOC';
import Icon from 'components/Icon';
import WidgetBlock from 'components/WidgetBlock';
import ImageUploader from 'components/ImageUploader';
import ControlButton from 'components/ControlButton';
import TitlePanel from 'components/TitlePanel';
import MultiSelect from 'components/MultiSelect';
import moment from 'moment';

interface IProps {
  t: TFunction;
  textFields: ITextFieldsState;
  selectFields: ISelectFieldsState;
  multiSelectFields: IMultiSelectFieldsState;
  selectedRewardDetails: IRewardDetails;
  rewardInitialGroups: IOption[];
  onChangeTextField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeNumberField: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeMultiselect: (name: string, options: string[]) => void;
  onChangeSelect: (name: string, value: IOption) => void;
  onSaveReward: () => void;
  onDeleteReward: () => void;
  onPublishReward: (type: string) => void;
  onUploadLogo: () => void;
  onChangeLogo: (url: string, file: File | null) => void;
  logoIsUploaded: boolean;
  updateRewardLoading: boolean;
  deleteRewardLoading: boolean;
  hasChanges: boolean;
  stopPublishRewardLoading: boolean;
  startPublishRewardLoading: boolean;
  onLoadGroups: (options: IOption[]) => Promise<ILoadOptionsResponse>;
  onLoadLocations: (search: string, loadedOptions: IOption[]) => Promise<ILoadOptionsResponse>;
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

const RewardContentLayout: React.FC<IProps> = ({
  t,
  textFields,
  selectFields,
  multiSelectFields,
  onChangeTextField,
  onChangeNumberField,
  onChangeMultiselect,
  onChangeSelect,
  onLoadLocations,
  onLoadGroups,
  onUploadLogo,
  onChangeLogo,
  onSaveReward,
  onDeleteReward,
  onPublishReward,
  updateRewardLoading,
  hasChanges,
  selectedRewardDetails,
  logoIsUploaded,
  startPublishRewardLoading,
  stopPublishRewardLoading,
  rewardInitialGroups,
  deleteRewardLoading,
}) => {
  const widgets: JSX.Element[] = [];

  const {publishStart, publishStop, name, isActive} = selectedRewardDetails;
  let isStarted = false;
  if (publishStart && publishStop) {
    isStarted = moment(publishStart).isAfter(moment(publishStop));
    if (isStarted) {
      widgets.push(createWidget(publishStart, t('Publishing Start')))
    } else {
      widgets.push(createWidget(publishStop, t('Publishing Stop')))
    }
  } else {
    if (publishStart) {
      widgets.push(createWidget(publishStart, t('Publishing Start')));
    }
    if (publishStop) widgets.push(createWidget(publishStop, t('Publishing Stop')));
  }

  const isLoading = updateRewardLoading || deleteRewardLoading || startPublishRewardLoading || stopPublishRewardLoading;

  return (
    <>
      <TitlePanel
        title={name}
        actions={
          <>
            <ControlButton onClick={onDeleteReward} loading={deleteRewardLoading} disabled={isLoading}>
              <Icon name="delete" />
              Delete
            </ControlButton>

            <ControlButton
              onClick={() => onPublishReward('stop')}
              loading={stopPublishRewardLoading}
              disabled={!isActive || isLoading}
            >
              <Icon name="stop" />
              Stop
            </ControlButton>

            <ControlButton
              onClick={onSaveReward}
              loading={updateRewardLoading}
              disabled={!hasChanges || isLoading}
            >
              <Icon name="save" />
              Save
            </ControlButton>

            <ControlButton
              onClick={() => onPublishReward('start')}
              loading={startPublishRewardLoading}
              disabled={isActive || isLoading}
            >
              <Icon name="play" />
              Start
            </ControlButton>
          </>
        }
      />
      <div className={styles.rewards}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Input
              label={t('Name')}
              name="name"
              type="text"
              error={textFields.name.error}
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
                onChange: onChangeSelect,
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
              options={rewardInitialGroups}
              onChange={onChangeMultiselect}
              getItemsAsync={onLoadGroups}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ImageUploader
              label={t('Reward Image')}
              t={t}
              url={textFields.logo.value}
              onUpload={onUploadLogo}
              onChange={onChangeLogo}
              error={textFields.logo.error}
              loading={updateRewardLoading}
              hasChanges={!logoIsUploaded}
            />
          </Grid>
        </Grid>
        <div className={styles.separator} />
        <Grid container>
          <Grid item xs={12} md={3}>
            <Grid container>
              <Grid item md={5}>
                <Input
                  label={t('Dollars')}
                  name="dollars"
                  type="text"
                  error={textFields.dollars.error}
                  value={textFields.dollars.value}
                  onChange={onChangeNumberField}
                />
              </Grid>
              <Grid item md={2} className={styles.equal}>
                <span> = </span>
              </Grid>
              <Grid item md={5}>
                <Input
                  label={t('Points')}
                  name="points"
                  type="text"
                  error={textFields.points.error}
                  value={textFields.points.value}
                  onChange={onChangeNumberField}
                />
              </Grid>
            </Grid>
            <Input
              label={t('Level')}
              name="level"
              type="text"
              error={textFields.level.error}
              value={textFields.level.value}
              onChange={onChangeNumberField}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={5}>
            <Input
              label={t('Reward')}
              name="reward"
              type="text"
              error={textFields.reward.error}
              value={textFields.reward.value}
              onChange={onChangeTextField}
            />
          </Grid>
        </Grid>
        <div className={styles.separator} />
        <Input
          multiline
          label={t('Rules & Conditions')}
          name="rules"
          type="text"
          error={textFields.rules.error}
          value={textFields.rules.value}
          onChange={onChangeTextField}
        />
        <Grid container>{widgets}</Grid>
      </div>
    </>
  );
};

export default RewardContentLayout;
