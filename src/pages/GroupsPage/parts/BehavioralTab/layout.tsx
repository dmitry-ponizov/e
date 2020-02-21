import React from 'react';
import styles from 'pages/GroupsPage/parts/BehavioralTab/styles.module.scss';
import {TFunction} from 'i18next';
import SaveTabChangesModal from 'components/SaveTabChangesModal';
import TitlePanel from 'components/TitlePanel';
import GroupTabsSwitcher from 'pages/GroupsPage/parts/GroupTabsSwitcher';
import ControlButton from 'components/ControlButton';
import Icon from 'components/Icon';
import DefinitionList from 'components/DefinitionList';
import AdvancedFilter from 'components/AdvancedFilter';

interface IProps {
  t: TFunction;

  filterFields: IFiltersFieldsState;

  onReset: () => void;
  onSave: () => void;
  onInput: (operator: IOption, values: string[], name: string) => void;

  selectedGroup: IGroup;
  hasChanges: boolean;
  updateGroupLoading: boolean;

  onRequestChangeTab: (tab: GroupTabType) => void;
  onChangeTabAnswer: (answer: ExitAnswer) => void;
  exitModalIsOpen: boolean;
}

const BehavioralTabLayout: React.FC<IProps> = ({
  t,
  filterFields,
  onReset,
  onSave,
  onInput,
  selectedGroup,
  hasChanges,
  updateGroupLoading,
  onRequestChangeTab,
  onChangeTabAnswer,
  exitModalIsOpen,
}) => {
  return (
    <>
      <SaveTabChangesModal t={t} visible={exitModalIsOpen} onAnswer={onChangeTabAnswer} />
      {selectedGroup && (
        <TitlePanel
          title={selectedGroup.name}
          actions={
            <>
              {hasChanges && (
                <ControlButton onClick={onReset}>
                  <Icon name="reset" style={{fontSize: 18}} />
                  {t('Reset')}
                </ControlButton>
              )}
              <ControlButton
                alt
                onClick={onSave}
                loading={updateGroupLoading}
                disabled={!hasChanges || updateGroupLoading}
              >
                <Icon name="save" />
                {t('Save')}
              </ControlButton>
            </>
          }
        />
      )}
      <GroupTabsSwitcher active="behavioral" onChange={onRequestChangeTab} />
      <div className={styles.tabContent}>
        <h2 className={styles.title}>{t('Behavioral')}</h2>
        <DefinitionList
          title={t('Transactions')}
          items={[
            {
              name: t('Total Spend'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalSpend.operator}
                    values={filterFields.totalSpend.values}
                    name={'totalSpend'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Highest Spend'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.highestSpend.operator}
                    values={filterFields.highestSpend.values}
                    name={'highestSpend'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Lowest Spend'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lowestSpend.operator}
                    values={filterFields.lowestSpend.values}
                    name={'lowestSpend'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Average Spend'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.averageSpend.operator}
                    values={filterFields.averageSpend.values}
                    name={'averageSpend'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Total Transaction'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalTransaction.operator}
                    values={filterFields.totalTransaction.values}
                    name={'totalTransaction'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last Transaction'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastTransaction.operator}
                    values={filterFields.lastTransaction.values}
                    name={'lastTransaction'}
                    onChange={onInput}
                  />
                ),
            },
          ]}
        />
        <DefinitionList
          title={t('Net Promotor Score')}
          items={[
            {
              name: t('Highest NPS'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.highestNPS.operator}
                    values={filterFields.highestNPS.values}
                    name={'highestNPS'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Lowest NPS'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lowestNPS.operator}
                    values={filterFields.lowestNPS.values}
                    name={'lowestNPS'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last NPS'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastNPS.operator}
                    values={filterFields.lastNPS.values}
                    name={'lastNPS'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Average NPS'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.averageNPS.operator}
                    values={filterFields.averageNPS.values}
                    name={'averageNPS'}
                    onChange={onInput}
                  />
                ),
            },
          ]}
        />
        <DefinitionList
          title={t('Points')}
          items={[
            {
              name: t('Total Points'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalPoints.operator}
                    values={filterFields.totalPoints.values}
                    name={'totalPoints'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Current Points'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.currentPoints.operator}
                    values={filterFields.currentPoints.values}
                    name={'currentPoints'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last Reward'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastReward.operator}
                    values={filterFields.lastReward.values}
                    name={'lastReward'}
                    onChange={onInput}
                  />
                ),
            },
          ]}
        />
        <DefinitionList
          title={t('Communication')}
          items={[
            {
              name: t('Total Feedback'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalFeedback.operator}
                    values={filterFields.totalFeedback.values}
                    name={'totalFeedback'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last Feedback'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastFeedback.operator}
                    values={filterFields.lastFeedback.values}
                    name={'lastFeedback'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Total Disputes'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalDisputes.operator}
                    values={filterFields.totalDisputes.values}
                    name={'totalDisputes'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last Dispute'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastDispute.operator}
                    values={filterFields.lastDispute.values}
                    name={'lastDispute'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Total Messages'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalMessages.operator}
                    values={filterFields.totalMessages.values}
                    name={'totalMessages'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last Message'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastMessage.operator}
                    values={filterFields.lastMessage.values}
                    name={'lastMessage'}
                    onChange={onInput}
                  />
                ),
            },
          ]}
        />
        <DefinitionList
          title={t('Content')}
          items={[
            {
              name: t('Total Views'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalViews.operator}
                    values={filterFields.totalViews.values}
                    name={'totalViews'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last View'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastView.operator}
                    values={filterFields.lastView.values}
                    name={'lastView'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Total Likes'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalLikes.operator}
                    values={filterFields.totalLikes.values}
                    name={'totalLikes'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last Like'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastLike.operator}
                    values={filterFields.lastLike.values}
                    name={'lastLike'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Total Comments'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalComments.operator}
                    values={filterFields.totalComments.values}
                    name={'totalComments'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last Comment'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastComment.operator}
                    values={filterFields.lastComment.values}
                    name={'lastComment'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Total Shares'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.totalShares.operator}
                    values={filterFields.totalShares.values}
                    name={'totalShares'}
                    onChange={onInput}
                  />
                ),
            },
            {
              name: t('Last Share'),
              value:
                selectedGroup.priority === 0 ? (
                  <span className={styles.defaultValue}>{t('All')}</span>
                ) : (
                  <AdvancedFilter
                    t={t}
                    operator={filterFields.lastShare.operator}
                    values={filterFields.lastShare.values}
                    name={'lastShare'}
                    onChange={onInput}
                  />
                ),
            },
          ]}
        />
      </div>
    </>
  );
};

export default BehavioralTabLayout;
