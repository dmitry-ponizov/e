import React, {ChangeEvent} from 'react';
import MediaQuery from 'react-responsive';
import {TFunction} from 'i18next';
import StatisticsPanel from 'containers/StatisticsPanel';
import ModuleLoader from 'components/ModuleLoader';
import MEDIA_BREAKPOINTS from 'constants/mediaBreakpoints';
import ContentWrapper from 'components/ContentWrapper';
import styles from 'pages/MessagesPage/styles.module.scss';
import Tabs from 'components/Tabs';
import Icon, {IconName} from 'components/Icon';
import ContactCard from 'components/ContactCard';
import MessagesWall from 'components/MessagesWall';
import moment from 'moment';
import SendForm from 'pages/MessagesPage/parts/SendForm';
import MultiSelect from 'components/MultiSelect';
import NewDatePicker from 'components/NewDatePicker';
import ActionsDrop from 'components/ActionsDrop';
import {getValuesFromString} from 'helpers/convertDate';
import ChatInfo from 'components/ChatInfo';
import Checkbox from 'components/Checkbox';
import SortStatus from 'components/SortStatus';
import Tooltip from 'components/Tooltip';
import DeleteChatsModal from 'pages/MessagesPage/parts/DeleteChatsModal';

interface IProps {
  t: TFunction;
  initiated: boolean;
  chats: IChat[];
  messages: IChatMessage[];
  getMessagesLoading: boolean;
  activeChat: IChat | null;
  searchChatsMode: boolean;
  selectedChats: string[];
  chatType: ChatType | 'all';
  textFields: ITextFieldsState;
  multiSelectFields: IMultiSelectFieldsState;
  showArchived: boolean;
  showChatInfo: boolean;
  customerMode: boolean;
  chatsSortType: 'name' | 'date';
  chatsSortAsc: boolean;
  setActiveChat: (chatId: string) => void;
  onSelectChat: (chatId: string | string[]) => void;
  onChangeMessageType: (chatType: ChatType | 'all') => void;
  onSendMessage: (text: string) => void;
  onChangeMultiselectField: (name: string, values: string[]) => void;
  onToggleArchived: () => void;
  onDateChange: (name: string, value: string) => void;
  onArchiveChats: (chatsIds: string[], value: boolean) => void;
  onDeleteChats: (chatsIds: string[]) => void;
  onToggleChatInfo: () => void;
  onSetSearchMode: (value: boolean) => void;
  onChangeTextField: (e: ChangeEvent) => void;
  onChangeSort: (type: 'name' | 'date') => void;
}

const getTabs = (t: TFunction) => {
  return [
    {
      id: 'all',
      label: t('All chats'),
    },
    {
      id: 'feedback',
      label: t('Feedback'),
    },
    {
      id: 'dispute',
      label: t('Dispute'),
    },
    {
      id: 'direct',
      label: 'Direct',
    },
  ];
};

const sortChats = (sortType, sortAsc) => (a: IChat, b: IChat): number => {
  if (sortType === 'name') {
    return sortAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id);
  }
  if (sortType === 'date') {
    return sortAsc ? a.timestamp - b.timestamp : b.timestamp - a.timestamp;
  }
  return 0;
};

const MessagesPageLayout: React.FunctionComponent<IProps> = ({
  t,
  initiated,
  chats,
  setActiveChat,
  activeChat,
  onSelectChat,
  selectedChats,
  chatType,
  textFields,
  messages,
  onChangeMessageType,
  getMessagesLoading,
  onSendMessage,
  onChangeMultiselectField,
  showArchived,
  onToggleArchived,
  multiSelectFields,
  onDateChange,
  onArchiveChats,
  onDeleteChats,
  onToggleChatInfo,
  showChatInfo,
  searchChatsMode,
  onSetSearchMode,
  onChangeTextField,
  customerMode,
  chatsSortAsc,
  chatsSortType,
  onChangeSort,
}) => {
  let filteredChats: IChat[] = [];
  const dateRange = getValuesFromString(textFields.dateFilter.value);
  const momentDateRange = [
    moment(dateRange[0]).startOf('day'),
    moment(dateRange[1])
      .startOf('day')
      .add(1, 'day'),
  ];

  chats.forEach(chat => {
    // filter archived
    if (!showArchived && chat.isArchived) return;
    // filter by type
    if (chatType !== 'all' && chat.type !== chatType) return;

    if (!customerMode) {
      // filter by locations
      if (
        multiSelectFields.locationFilter.values.length &&
        multiSelectFields.locationFilter.values.indexOf(chat.location.id) === -1
      )
        return;
      // filter by group
      if (
        multiSelectFields.groupFilter.values.length &&
        multiSelectFields.groupFilter.values.indexOf(chat.group.id) === -1
      )
        return;
      // filter by date
      if (!moment(chat.timestamp).isBetween(momentDateRange[0], momentDateRange[1])) return;
    }

    // filter by customer search
    if (
      `ID #${customerMode ? chat.merchantId : chat.customerId} ${chat.location.name} ${chat.group.name} [${
        chat.type
      }] ${chat.isArchived ? ' [ARCHIVED]' : ''} ${chat.isDeleted ? ' [DELETED]' : ''}`
        .toLowerCase()
        .indexOf(textFields.chatsQuery.value.toLowerCase()) === -1
    )
      return;

    filteredChats.push(chat);
  });
  filteredChats = filteredChats.sort(sortChats(chatsSortType, chatsSortAsc));

  const chatActions: {label: string; iconSize: number; icon: IconName; onClick: () => void}[] = [];
  if (activeChat) {
    chatActions.push({
      label: t('Delete'),
      iconSize: 20,
      icon: 'delete',
      onClick: () => onDeleteChats([activeChat.id]),
    });
    if (!activeChat.isArchived) {
      chatActions.push({
        label: t('Archive'),
        iconSize: 20,
        icon: 'archive',
        onClick: () => onArchiveChats([activeChat.id], true),
      });
    }
  }

  const chatsResults = searchChatsMode
    ? filteredChats.filter(chat => chat.customerId.indexOf(textFields.chatsQuery.value) > -1)
    : [];

  return (
    <ContentWrapper dark={customerMode} title={t('Messages')} onClose={customerMode ? () => {} : undefined}>
      <DeleteChatsModal t={t} />
      {!customerMode && (
        <MediaQuery minDeviceWidth={MEDIA_BREAKPOINTS.md}>
          <StatisticsPanel
            items={[
              {value: 999, icon: 'cash', label: t('Spend')},
              {value: 959, icon: 'transaction', label: t('Transactions')},
              {value: 999, icon: 'ticket', label: t('Ave Ticket')},
              {value: 999, icon: 'view', label: t('Views')},
              {value: 999, icon: 'like', label: t('Likes')},
              {value: 959, icon: 'heart', label: t('Favorites')},
              {value: 999, icon: 'share', label: t('Shared')},
              {value: 999, icon: 'feedback', label: t('Feedback')},
              {value: 59, icon: 'lightning', label: t('Disputes')},
              {value: 999, icon: 'smile', label: t('NPS')},
            ]}
          />
        </MediaQuery>
      )}
      {initiated ? (
        <div className={styles.chatBox}>
          {!customerMode && (
            <div className={styles.cbHeading}>
              <MultiSelect
                className={styles.headingSelect}
                innerLabel={`${t('Location')}:`}
                selected={multiSelectFields.locationFilter.values}
                options={[
                  {
                    value: '0',
                    label: 'Location 1',
                  },
                  {
                    value: '1',
                    label: 'Location 2',
                  },
                ]}
                onChange={onChangeMultiselectField}
                name="locationFilter"
                t={t}
                openerIcon="pin"
              />
              <MultiSelect
                className={styles.headingSelect}
                innerLabel={`${t('Group')}:`}
                selected={multiSelectFields.groupFilter.values}
                options={[
                  {
                    value: '0',
                    label: 'Group 1',
                  },
                  {
                    value: '1',
                    label: 'Group 2',
                  },
                ]}
                onChange={onChangeMultiselectField}
                name="groupFilter"
                t={t}
                openerIcon="groups"
              />
              <NewDatePicker
                t={t}
                name="dateFilter"
                value={textFields.dateFilter.value}
                onChange={onDateChange}
                openerIcon="calendar"
              />
            </div>
          )}
          <Tabs active={chatType} tabs={getTabs(t)} onChange={onChangeMessageType} />
          <div className={styles.archivedHolder}>
            <div className={styles.archivedLink} onClick={onToggleArchived}>
              {showArchived ? t('Hide archived chats') : t('Show archived chats')}
            </div>
          </div>
          <div className={styles.cbHolder}>
            <div className={styles.cbSidebar}>
              <div className={styles.searchHolder}>
                <div className={`${styles.search}${searchChatsMode ? ' ' + styles.searchActive : ''}`}>
                  <Icon className={styles.searchIcon} name="search" />
                  <input
                    placeholder={customerMode ? t('Find Merchants') : t('Find Customers')}
                    type="search"
                    name="chatsQuery"
                    value={textFields.chatsQuery.value}
                    className={styles.searchField}
                    onChange={onChangeTextField}
                    onFocus={() => onSetSearchMode(true)}
                  />
                  <div className={styles.disableSearch} onClick={() => onSetSearchMode(false)}>
                    <Icon name="close" />
                  </div>
                </div>
              </div>
              {!!textFields.chatsQuery.value && (
                <div className={styles.chatsResults}>
                  <strong>{t('Search results')}:</strong>
                  <span>
                    {chatsResults.length} {t(`customer(s) found for`)}`{textFields.chatsQuery.value}`
                  </span>
                </div>
              )}
              {!!filteredChats.length && (
                <div className={styles.sortHeading}>
                  <div className={styles.shCol}>
                    <Checkbox
                      name="all"
                      checked={filteredChats.length === selectedChats.length}
                      onChange={() => onSelectChat(filteredChats.map(chat => chat.id))}
                    />
                  </div>
                  <div className={styles.shCol} onClick={() => onChangeSort('name')}>
                    <SortStatus
                      className={styles.sort}
                      status={chatsSortType === 'name' ? (chatsSortAsc ? 'asc' : 'desc') : undefined}
                    />
                    {customerMode ? t('Merchant') : t('Customer')}
                  </div>
                  <div className={styles.shCol} onClick={() => onChangeSort('date')}>
                    <SortStatus
                      className={styles.sort}
                      status={chatsSortType === 'date' ? (chatsSortAsc ? 'asc' : 'desc') : undefined}
                    />
                    {t('Date')}
                  </div>
                </div>
              )}
              <div className={styles.chatList}>
                {filteredChats.length ? (
                  filteredChats.map((chat, i) => {
                    return (
                      <ContactCard
                        key={i}
                        name={chat.id}
                        onUnarchive={chat.isArchived ? () => onArchiveChats([chat.id], false) : undefined}
                        checked={selectedChats.indexOf(chat.id) > -1}
                        mark={textFields.chatsQuery.value}
                        image={customerMode ? 'https://i.ya-webdesign.com/images/png-avatar-4.png' : undefined}
                        title={`ID #${customerMode ? chat.merchantId : chat.customerId}   [${chat.type}] ${
                          chat.isArchived ? ' [ARCHIVED]' : ''
                        } ${chat.isDeleted ? ' [DELETED]' : ''}`}
                        sub={moment(chat.timestamp).format('MMM DD, YYYY [at] hh:mm A')}
                        selected={!!activeChat && activeChat.id === chat.id}
                        onCheckChange={onSelectChat}
                        onSelect={setActiveChat}
                      />
                    );
                  })
                ) : (
                  <div className={styles.noChats}>{t('No results found.')}</div>
                )}
              </div>
              <div className={styles.multiActions}>
                <Tooltip className={styles.actionTt} dark content={<>Delete</>}>
                  <div className={styles.multiAction} onClick={() => onDeleteChats(selectedChats)}>
                    <Icon name="delete" />
                  </div>
                </Tooltip>
                <Tooltip className={styles.actionTt} dark content={<>Archive</>}>
                  <div className={styles.multiAction} onClick={() => onArchiveChats(selectedChats, true)}>
                    <Icon name="archive" />
                  </div>
                </Tooltip>
                {!!selectedChats.length && (
                  <div className={styles.selectedChatsCount}>
                    {selectedChats.length} {t('item(s) selected')}
                  </div>
                )}
              </div>
            </div>
            {activeChat && (
              <div className={styles.cbContent}>
                <div className={styles.cbContentHeading}>
                  <span className={styles.cbContentTitle}>ID #{activeChat.customerId}</span>
                  <div className={styles.cbhRight}>
                    <Tooltip className={styles.actionTtHead} dark content={<>Search messages</>}>
                      <div className={styles.chatActionOpener}>
                        <Icon name="search" style={{fontSize: 11}} />
                      </div>
                    </Tooltip>
                    <Tooltip className={styles.actionTtHead} dark content={<>Key information</>}>
                      <div
                        className={`${styles.chatActionOpener}${showChatInfo ? ' ' + styles.caActive : ''}`}
                        onClick={onToggleChatInfo}
                      >
                        i
                      </div>
                    </Tooltip>
                    <ActionsDrop
                      className={styles.chatActions}
                      opener={active => {
                        return (
                          <Tooltip dark content={<>Actions</>}>
                            <div className={`${styles.caOpener}${active ? ' ' + styles.caOpenerActive : ''}`}>
                              <span />
                            </div>
                          </Tooltip>
                        );
                      }}
                      dropTitle={`${t('Actions for chat')}:`}
                      actions={chatActions}
                    />
                  </div>
                </div>
                <div className={styles.wallHolder}>
                  <div className={styles.wallFrame}>
                    <MessagesWall
                      loading={getMessagesLoading}
                      messages={messages.map(message => {
                        return {
                          id: message.id,
                          text: message.text,
                          date: message.timestamp,
                          own: customerMode ? message.senderId === '1' : message.senderId === '0',
                        };
                      })}
                    />
                    <SendForm placeholder={t('Leave a message...')} onSend={onSendMessage} />
                  </div>
                  {showChatInfo && (
                    <ChatInfo
                      title={t('Key Information')}
                      items={[
                        {
                          icon: 'calendar',
                          iconSize: 24,
                          value: 'July 28, 2020',
                          label: t('Date'),
                        },
                        {
                          icon: 'clock',
                          iconSize: 24,
                          value: '10:13 PM ET',
                          label: t('Time'),
                        },
                        {
                          icon: 'feedback',
                          iconSize: 28,
                          value: 'Feedback',
                          label: t('Type'),
                        },
                        {
                          icon: 'pin',
                          iconSize: 24,
                          value: 'Location 1',
                          label: t('Location'),
                        },
                        {
                          icon: 'groups',
                          iconSize: 24,
                          value: 'Group 1',
                          label: t('Group'),
                        },
                        {
                          icon: 'smile',
                          iconSize: 30,
                          value: '8 - Promoter',
                          label: t('Promoter Score'),
                        },
                        null,
                        {
                          icon: 'transaction',
                          iconSize: 30,
                          value: '12345678',
                          label: t('Transaction ID'),
                        },
                        {
                          icon: 'cash',
                          iconSize: 30,
                          value: t('$ 99,999'),
                          label: t('Transaction Amount'),
                        },
                      ]}
                      onClose={onToggleChatInfo}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <ModuleLoader />
      )}
    </ContentWrapper>
  );
};

export default MessagesPageLayout;
