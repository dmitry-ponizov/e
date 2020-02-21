import React, {ChangeEvent} from 'react';
import styles from 'components/ItemManager/styles.module.scss';
import Icon from 'components/Icon';

interface IProps {
  searchPlaceholder?: string;
  onChangeSearch: (value: string) => void;
  onCreate?: () => void;
  actions?: JSX.Element;
}

class ItemManager extends React.Component<IProps> {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      selectedLocations: [],
      activeLocationId: null,
      sortAsc: true,
      sortType: 'name',
    };
  }

  searchTimeout: NodeJS.Timeout | null = null;

  handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.searchTimeout = setTimeout(() => this.props.onChangeSearch(value), 500);
  };

  render() {
    const {searchPlaceholder, onCreate, actions, children} = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.heading}>
          <div className={styles.search}>
            <Icon className={styles.searchIcon} name="search" />
            <input
              name="searchQuery"
              placeholder={searchPlaceholder}
              type="search"
              className={styles.searchField}
              onChange={this.handleChangeSearch}
            />
          </div>
          {onCreate && (
            <div className={styles.btnNew} onClick={onCreate}>
              <Icon name="plus" />
            </div>
          )}
        </div>
        {children}
        {actions && <div className={styles.footer}>{actions}</div>}
      </div>
    );
  }
}

export default ItemManager;
