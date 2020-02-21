import React from 'react';
import styles from 'pages/ContentPage/parts/ContentManager/styles.module.scss';
import {withTranslation, WithTranslation} from 'react-i18next';
import Icon from 'components/Icon';
import {inject, observer} from 'mobx-react';
import {IRootStore} from 'stores';
import {RouteComponentProps, withRouter} from 'react-router';
import enhance from 'helpers/enhance';
import memoizeOne from 'memoize-one';
import SortStatus from 'components/SortStatus';
import ItemManager from 'components/ItemManager';
import Tooltip from 'components/Tooltip';
import Checkbox from 'components/Checkbox';

type SortType = 'status' | 'location' | 'name';

interface IInjectedProps {
  content: IContentItem[];
  selectedContentItem: IContentItemDetails;
  selectContentItem: (item: IContentItem) => Promise<void>;
  toggleCreateModal: (value: boolean) => void;
  toggleDeleteModal: (value: boolean, contentItems: string[]) => void;
  publishContentItems: (isPublished: boolean, data) => void;
}

interface IState {
  searchQuery: string;
  selectedContentItems: string[];
  sortAsc: boolean;
  sortType: SortType;
}

// TODO: connect injector to props
@inject((rootStore: IRootStore) => ({
  content: rootStore.contentStore.content,
  selectedContentItem: rootStore.contentStore.selectedContentItem,
  selectContentItem: rootStore.contentStore.selectContentItem,
  toggleCreateModal: rootStore.contentStore.toggleCreateModal,
  toggleDeleteModal: rootStore.contentStore.toggleDeleteModal,
  publishContentItems: rootStore.contentStore.publishContentItems,
}))
@observer
class ContentManagerBase extends React.Component<IInjectedProps & RouteComponentProps & WithTranslation, IState> {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      selectedContentItems: [],
      sortAsc: true,
      sortType: 'name',
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.content !== prevProps.content) {
      this.setState({selectedContentItems: []});
    }
  }

  handleChangeSearch = searchQuery => {
    this.setState({
      searchQuery,
      selectedContentItems: [],
    });
  };

  handleSelectAll = () => {
    this.setState({
      selectedContentItems:
        this.props.content.length > this.state.selectedContentItems.length
          ? this.props.content.map(contentItem => contentItem.id)
          : [],
    });
  };

  handleSelectContent = (id, selected) => {
    this.setState({
      selectedContentItems: selected
        ? [...this.state.selectedContentItems, id]
        : this.state.selectedContentItems.filter(contentItem => contentItem !== id),
    });
  };

  handleChangeSort = sortType => {
    this.setState({
      sortType,
      sortAsc: this.state.sortType === sortType ? !this.state.sortAsc : true,
    });
  };

  handleChooseItems = (selectedContentItems: string[]) => {
    this.setState({selectedContentItems});
  };

  handleDeleteContentItems = () => {
    this.props.toggleDeleteModal(true, this.state.selectedContentItems);
  };

  renderSortIcon = (sortType: SortType): JSX.Element => {
    const isActive = this.state.sortType === sortType;
    return <SortStatus status={isActive ? (this.state.sortAsc ? 'asc' : 'desc') : undefined} />;
  };

  filterContent = memoizeOne((content, searchQuery) => {
    return this.props.content.filter(contentItem => {
      return contentItem.name.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
    });
  });

  sortContent = memoizeOne((content, sortType, sortAsc) => {
    return [...content].sort((a, b) => {
      if (sortType === 'name') {
        return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
      }
      if (sortType === 'location') {
        return sortAsc ? a.location.name.localeCompare(b.name) : b.location.name.localeCompare(a.name);
      }
      if (sortType === 'status') {
        return sortAsc
          ? a.isPublish === b.isPublish
            ? 0
            : a.isPublish
            ? -1
            : 1
          : a.isPublish === b.isPublish
          ? 0
          : a.isPublish
          ? 1
          : -1;
      }
      return 0;
    });
  });

  handlePublishContent = (isPublished: boolean) => {
    this.props.publishContentItems(isPublished, {
      contentDraftIds: this.state.selectedContentItems,
    });
  };

  render() {
    const {sortAsc, sortType, searchQuery, selectedContentItems} = this.state;
    const {selectedContentItem, selectContentItem, t, toggleCreateModal, content} = this.props;
    const filteredLocations = this.filterContent(content, searchQuery);
    const sortedContent = this.sortContent(filteredLocations, sortType, sortAsc);

    return (
      <ItemManager
        searchPlaceholder={t('Find content')}
        onChangeSearch={this.handleChangeSearch}
        onCreate={() => toggleCreateModal(true)}
        actions={
          <>
            <Tooltip disabled={!!selectedContentItems.length} content={t('Select item to publish')}>
              <button onClick={() => this.handlePublishContent(true)} disabled={selectedContentItems.length === 0}>
                <Icon name="play" />
              </button>
            </Tooltip>

            <Tooltip disabled={!!selectedContentItems.length} content={t('Select item to unpublished')}>
              <button onClick={() => this.handlePublishContent(false)} disabled={selectedContentItems.length === 0}>
                <Icon name="stop" />
              </button>
            </Tooltip>

            <Tooltip disabled={!!selectedContentItems.length} content={t('Select item to delete')}>
              <button onClick={this.handleDeleteContentItems} disabled={selectedContentItems.length === 0}>
                <Icon name="delete" />
              </button>
            </Tooltip>
          </>
        }
      >
        <div className={styles.body}>
          {sortedContent.length ? (
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <Checkbox
                  label={t('Select all')}
                  inputClass={styles.thCheckbox}
                  inputActiveClass={styles.checkboxActive}
                  name="allItems"
                  checked={sortedContent.length === selectedContentItems.length}
                  onChange={this.handleSelectAll}
                />
                <div className={styles.sortTools}>
                  <div className={styles.sort} onClick={() => this.handleChangeSort('name')}>
                    {this.renderSortIcon(sortType)}
                    <Tooltip dark={false} content={<span>{t('Name')}</span>}>
                      <span className={styles.sortLabel}>{t('N')}</span>
                    </Tooltip>
                  </div>
                  <div className={styles.sort} onClick={() => this.handleChangeSort('location')}>
                    {this.renderSortIcon(sortType)}
                    <Tooltip dark={false} content={<span>{t('Location')}</span>}>
                      <span className={styles.sortLabel}>{t('L')}</span>
                    </Tooltip>
                  </div>
                  <div className={styles.sort} onClick={() => this.handleChangeSort('status')}>
                    {this.renderSortIcon(sortType)}
                    <Tooltip dark={false} content={<span>{t('Status')}</span>}>
                      <span className={styles.sortLabel}>{t('S')}</span>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div className={styles.tableBody}>
                <div className={styles.rowList}>
                  {sortedContent.map(contentItem => {
                    const selected = selectedContentItems.indexOf(contentItem.id) > -1;
                    let rowClasses = styles.tableRow;
                    if (selectedContentItem && selectedContentItem.id === contentItem.id) {
                      rowClasses += ` ${styles.activeItem}`;
                    }
                    return (
                      <div key={contentItem.id} className={rowClasses} onClick={() => selectContentItem(contentItem)}>
                        <div className={`${styles.td} ${styles.colCheck}`} onClick={e => e.stopPropagation()}>
                          <Checkbox
                            inputClass={styles.tdCheckbox}
                            inputActiveClass={styles.checkboxActive}
                            name={`tableItem-${contentItem.id}`}
                            checked={selected}
                            onChange={() => this.handleSelectContent(contentItem.id, !selected)}
                          />
                        </div>
                        <div className={`${styles.td} ${styles.colLabel}`}>
                          <span className={styles.contentLabel}>{t('Name')}</span>
                          <span className={styles.contentLabel}>{t('Location')}</span>
                        </div>
                        <div className={`${styles.td} ${styles.colValue}`}>
                          <span className={styles.content}>{contentItem.name}</span>
                          <span className={styles.content}>{contentItem.location.name}</span>
                        </div>
                        <div className={`${styles.td} ${styles.colStatus}`}>
                          <div
                            className={contentItem.isPublish ? styles.itemStatus : `${styles.itemStatus} ${styles.off}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <span className={styles.noResultsText}>{t('No content found.')}</span>
          )}
        </div>
      </ItemManager>
    );
  }
}

const ContentManager = enhance(ContentManagerBase, [withRouter, withTranslation()]);
export default ContentManager;
