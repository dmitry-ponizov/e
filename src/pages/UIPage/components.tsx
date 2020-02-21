import React from 'react';
import Button from 'components/Button';
import styles from 'pages/UIPage/styles.module.scss';
import Input from 'components/Input';
import Label from 'components/Label';
import AccountMenu from 'components/AccountMenu';
import AdvancedFilter from 'components/AdvancedFilter';
import FILTER_OPERATORS from 'constants/filterOperators';
import AdvancedTable from 'components/AdvancedTable';
import Autocomplete from 'components/Autocomplete';
import Checkbox from 'components/Checkbox';
import ContentWrapper from 'components/ContentWrapper';
import ControlButton from 'components/ControlButton';
import DefinitionList from 'components/DefinitionList';
import {DraggableList} from 'components/DraggableList';
import Icon, {IconName, iconsMap} from 'components/Icon';
import IconsList from 'components/IconsList';
import ImageUploader from 'components/ImageUploader';
import ItemManager from 'components/ItemManager';
import Link from 'components/Link';
import MessageBox from 'components/MessageBox';
import Modal from 'components/Modal';
import ModuleLoader from 'components/ModuleLoader';
import MultiSelect from 'components/MultiSelect';
import NewDatePicker from 'components/NewDatePicker';
import PageContainer from 'components/PageContainer';
import Pagination from 'components/Pagination';
import Radio from 'components/Radio';
import RadioTabs from 'components/RadioTabs';
import SaveTabChangesModal from 'components/SaveTabChangesModal';
import SelectHOC from 'components/SelectHOC';
import SliderHOC from 'components/SliderHOC';
import SortStatus from 'components/SortStatus';
import Sticky from 'components/Sticky';
import TableManager from 'components/TableManager';
import Tabs from 'components/Tabs';
import TitlePanel from 'components/TitlePanel';
import Toast from 'components/Toast';
import Tooltip from 'components/Tooltip';
import WidgetBlock from 'components/WidgetBlock';

interface IComponent {
  props: string[];
  render: () => JSX.Element;
}

interface IComponents {
  [key: string]: IComponent;
}

const UIComponents: IComponents = {
  Button: {
    props: [
      'className?: string;',
      'disabled?: boolean;',
      'loading?: boolean;',
      'alt?: boolean;',
      'onClick?: (e: SyntheticEvent) => void;',
    ],
    render: () => (
      <div className={styles.examples}>
        <Button>Button</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <Button loading disabled>
          Loading
        </Button>
        <Button alt>Alternate</Button>
      </div>
    ),
  },

  Input: {
    props: [
      'name: string;',
      'label?: string;',
      'error?: string;',
      'disabled?: boolean;',
      'multiline?: boolean;',
      'containerClassName?: string;',
      'placeholder?: string;',
      'type: string;',
      'value: string;',
      'onChange: (e: ChangeEvent) => void;',
      'onBlur?: () => void;',
      'onFocus?: () => void;',
    ],
    render: () => (
      <div className={styles.examples}>
        <Input type="text" name="test" value="" placeholder="Placeholder" onChange={() => {}} />
        <Input type="text" label="Label" name="test" value="Label" error="Error text" onChange={() => {}} />
        <Input type="text" name="test" value="Multiline" multiline onChange={() => {}} />
      </div>
    ),
  },

  Checkbox: {
    props: [
      'name: string;',
      'label?: string;',
      'checked: boolean;',
      'alternate?: boolean;',
      'onChange: (e: ChangeEvent) => void;',
      'containerClass?: string;',
      'inputClass?: string;',
      'inputActiveClass?: string;',
      'labelClass?: string;',
    ],
    render: () => (
      <div className={styles.examples}>
        <Checkbox name="testCB1" checked={false} onChange={() => {}}/>
        <Checkbox name="testCB2" checked={true} onChange={() => {}} label="Active" />
        <Checkbox name="testCB3" checked={false} alternate onChange={() => {}} label="Alternate" />
        <Checkbox name="testCB4" checked={true} alternate onChange={() => {}} label="Alternate active" />
      </div>
    ),
  },

  Label: {
    props: ['className?: string;', 'focused?: boolean;', 'error?: boolean;'],
    render: () => (
      <div className={styles.examples}>
        <Label>Label text</Label>
        <Label focused>Focused Label text</Label>
        <Label error>Error Label text</Label>
      </div>
    ),
  },

  AccountMenu: {
    props: ['name: string;', 'image: string;', 'content: (closeMenu: () => void) => JSX.Element;'],
    render: () => (
      <AccountMenu
        name={'Name'}
        image={
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K'
        }
        content={(closeMenu) => <>Menu Content <button onClick={closeMenu}>Close</button></>}
      />
    ),
  },

  AdvancedFilter: {
    props: [
      'className?: string;',
      't: TFunction;',
      'operator: IOption;',
      'values: string[];',
      'onChange: (operator: IOption, values: string[], name: string) => void;',
      'name: string;',
    ],
    render: () => (
      <AdvancedFilter name="testAF" t={t => t} operator={FILTER_OPERATORS[0]} values={['1']} onChange={() => {}} />
    ),
  },

  AdvancedTable: {
    props: ['className?: string;', 'columns: ITableColumn[];', 'rows: Array<Array<string>>;'],
    render: () => (
      <AdvancedTable
        columns={[
          {title: 'Heading 1', width: 120},
          {title: 'Heading 2', width: 160},
          {title: 'Heading 3', width: 160},
        ]}
        rows={[
          ['A1', 'B1', 'C1'],
          ['A2', 'B2', 'C2'],
          ['A2', 'B2', 'C3'],
        ]}
      />
    ),
  },

  Autocomplete: {
    props: ['className?: string;', 'suggestions: ISuggestion[];', 'onApply: (value?: ISuggestion) => void;'],
    render: () => (
      <Autocomplete suggestions={[{text: 'Suggestion 1'}, {text: 'Suggestion 2'}]} onApply={() => {}}>
        [any element]
      </Autocomplete>
    ),
  },

  ContentWrapper: {
    props: [
      'title?: string;',
      'sub?: string;',
    ],
    render: () => (
      <ContentWrapper title="Page title" sub="Sub title">
        content
      </ContentWrapper>
    ),
  },

  ControlButton: {
    props: [
      'className?: string;',
      'disabled?: boolean;',
      'loading?: boolean;',
      'alt?: boolean;',
      'onClick?: () => void;',
    ],
    render: () => (
      <div className={styles.examples} style={{background: '#333f50', padding: 32}}>
        <ControlButton>Button</ControlButton>
        <ControlButton disabled>Disabled</ControlButton>
        <ControlButton loading>Loading</ControlButton>
        <ControlButton loading disabled>
          Loading
        </ControlButton>
        <ControlButton alt>Alternate</ControlButton>
      </div>
    ),
  },

  DefinitionList: {
    props: [
      'className?: string;',
      'title?: string;',
      'items: IListItem[];',
    ],
    render: () => (
      <DefinitionList title="Title" items={[
        {name: 'Name 1', value: '[any element]'},
        {name: 'Name 2', value: '[any element]'},
        {name: 'Name 3', value: '[any element]'}
      ]} />
    ),
  },

  DraggableList: {
    props: [
      't: TFunction;',
      'items: ISortableItem[];',
      'defaultItems: ISortableItem[];',
      'onChange: (items: ISortableItem[]) => void;',
      'label?: string;',
    ],
    render: () => (
      <DraggableList
        t={t => t}
        label="Label:"
        items={[
          {id: '0', label: 'Item 1', isActive: true},
          {id: '1', label: 'Item 2', isActive: true},
          {id: '2', label: 'Item 3', isActive: false}
        ]}
        defaultItems={[
          {id: '0', label: 'Item 1', isActive: true},
          {id: '1', label: 'Item 2', isActive: true},
          {id: '2', label: 'Item 3', isActive: false}
        ]}
        onChange={() => {}}
      />
    ),
  },

  Icon: {
    props: [
      'name: IconName;',
      'className?: string;',
      'style?: CSSProperties;',
    ],
    render: () => (
      <div className={styles.icons}>
        {Object.keys(iconsMap).map((iconName: IconName) => {
          return (
            <div key={iconName} className={styles.iconCell}>
              <span className={styles.name}>{iconName}</span>
              <Icon name={iconName} />
            </div>
          );
        })}
      </div>
    ),
  },

  IconsList: {
    props: [
      'className?: string;',
      'values: string[];',
    ],
    render: () => (
      <IconsList values={['10', '20', '30', '40', '50']} />
    )
  },

  ImageUploader: {
    props: [
      't: TFunction;',
      'label?: string;',
      'error?: string;',
      'className?: string;',
      'url: string;',
      'onChange: (url: string, file: File | null) => void;',
      'onUpload: () => void;',
      'hasChanges?: boolean;',
      'loading?: boolean;',
      'disabled?: boolean;',
    ],
    render: () => (
      <div className={styles.examples}>
        <ImageUploader
          t={t => t}
          label="Label"
          error="Error"
          url=""
          onChange={() => {}}
          onUpload={() => {}}
        />
        <ImageUploader
          t={t => t}
          label="Image"
          url="https://klike.net/uploads/posts/2019-06/1560664221_1.jpg"
          hasChanges
          onChange={() => {}}
          onUpload={() => {}}
        />
        <ImageUploader
          t={t => t}
          label="Loading"
          url="https://klike.net/uploads/posts/2019-06/1560664221_1.jpg"
          hasChanges
          loading
          onChange={() => {}}
          onUpload={() => {}}
        />
        <ImageUploader
          t={t => t}
          label="Disabled"
          url=""
          disabled
          onChange={() => {}}
          onUpload={() => {}}
        />
      </div>
    )
  },

  ItemManager: {
    props: [
      'searchPlaceholder?: string;',
      'onChangeSearch: (value: string) => void;',
      'onCreate?: () => void;',
      'actions?: JSX.Element;',
    ],
    render: () => (
      <ItemManager
        searchPlaceholder="Search Placeholder"
        onChangeSearch={() => {}}
        onCreate={() => {}}
        actions={<>[actions]</>}
      >
        [children]
      </ItemManager>
    ),
  },

  Link: {
    props: ['HTMLProps<HTMLButtonElement>'],
    render: () => (
      <Link>Link</Link>
    ),
  },

  MessageBox: {
    props: [
      'className?: string;',
      'type?: MessageBoxType;',
    ],
    render: () => (
      <div className={styles.examples}>
        <MessageBox type={'danger'}>Type: danger</MessageBox>
        <MessageBox type={'success'}>Type: success</MessageBox>
        <MessageBox type={'warning'}>Type: warning</MessageBox>
        <MessageBox type={'info'}>Type: info</MessageBox>
      </div>
    ),
  },

  Modal: {
    props: [
      'visible: boolean;',
      'className?: string;',
      'onClose: () => void;',
    ],
    render: () => (
      <Modal visible onClose={() => {}}>[children]</Modal>
    ),
  },

  ModuleLoader: {
    props: [],
    render: () => (
      <ModuleLoader />
    ),
  },

  Multiselect: {
    props: [
      't: TFunction;',
      'className?: string;',
      'label?: string;',
      'innerLabel?: string;',
      'description?: string;',
      'openerIcon?: IconName;',
      'flatOpener?: boolean;',
      'selected: string[];',
      'options: IOption[];',
      'onChange: (name: string, options: string[]) => void;',
      'name: string;',
      'getItemsAsync?: (oldItems: IOption[]) => Promise<IMoreItemsResponse>;',
    ],
    render: () => (
      <div className={styles.examples}>
        <MultiSelect
          t={t => t}
          name="testMS1"
          label="Label"
          description="Description text"
          selected={['0', '1']}
          options={[{value: '0', label: 'Option 1'}, {value: '1', label: 'Option 2'}, {value: '2', label: 'Option 3'}]}
          onChange={() => {}}
        />
        <MultiSelect
          t={t => t}
          name="testMS2"
          innerLabel="Inner label:"
          selected={['0', '1']}
          options={[{value: '0', label: 'Option 1'}, {value: '1', label: 'Option 2'}, {value: '2', label: 'Option 3'}]}
          onChange={() => {}}
        />
        <MultiSelect
          t={t => t}
          name="testMS3"
          label="Flat opener"
          selected={['0', '1']}
          flatOpener
          options={[{value: '0', label: 'Option 1'}, {value: '1', label: 'Option 2'}, {value: '2', label: 'Option 3'}]}
          onChange={() => {}}
        />
        <MultiSelect
          t={t => t}
          name="testMS4"
          label="Opener icon"
          selected={['0', '1']}
          openerIcon="heart"
          options={[{value: '0', label: 'Option 1'}, {value: '1', label: 'Option 2'}, {value: '2', label: 'Option 3'}]}
          onChange={() => {}}
        />
      </div>
    ),
  },

  NewDatePicker: {
    props: [
      't: TFunction;',
      'name: string;',
      'className?: string;',
      'label?: string;',
      'innerLabel?: string;',
      'splitter?: string;',
      'range?: boolean;',
      'openerIcon?: IconName;',
      'value: string;',
      'onChange: (name: string, value: string) => void;',
    ],
    render: () => (
      <div className={styles.examples}>
        <NewDatePicker
          t={t => t}
          name="testNDP1"
          label="Label"
          value="Jan 5, 2020"
          onChange={() => {}}
        />
        <NewDatePicker
          t={t => t}
          name="testNDP2"
          innerLabel="Inner label:"
          value="Jan 5, 2020"
          onChange={() => {}}
        />
        <NewDatePicker
          t={t => t}
          name="testNDP3"
          label="Custom opener Icon"
          openerIcon="heart"
          value="Jan 5, 2020"
          onChange={() => {}}
        />
        <NewDatePicker
          t={t => t}
          name="testNDP4"
          label="Range picker"
          splitter={' - '}
          value="Jan 5, 2020 - Jan 10, 2020"
          onChange={() => {}}
        />
        <NewDatePicker
          t={t => t}
          name="testNDP5"
          label="Custom splitter"
          splitter={'[splitter]'}
          value="Jan 5, 2020[splitter]Jan 10, 2020"
          onChange={() => {}}
        />
      </div>
    ),
  },

  PageContainer: {
    props: [
      'className?: string;',
    ],
    render: () => (
      <PageContainer>[children]</PageContainer>
    ),
  },

  Pagination: {
    props: [
      'className?: string;',
      'itemsCount: number;',
      'perPage: number;',
      'currentPage: number;',
      'onChange: (page: number) => void;',
    ],
    render: () => (
      <Pagination
        itemsCount={1000}
        perPage={50}
        currentPage={12}
        onChange={() => {}}
      />
    ),
  },

  Radio: {
    props: [
      'name: string;',
      'label?: string;',
      'selected: IOption;',
      'options: IOption[];',
      'onChange: (name: string, value: IOption) => void;',
      'className?: string;',
    ],
    render: () => (
      <div className={styles.examples}>
        <Radio
          name="testR1"
          label="Label"
          selected={{value: '0', label: 'Option 1',}}
          options={[{value: '0', label: 'Option 1',}, {value: '1', label: 'Option 2',}, {value: '2', label: 'Option 3',}]}
          onChange={() => {}}
        />
        <Radio
          name="testR2"
          selected={{value: '0', label: 'Option 1',}}
          options={[{value: '0', label: 'Option 1',}, {value: '1', label: 'Option 2',}, {value: '2', label: 'Option 3',}]}
          onChange={() => {}}
        />
      </div>
    ),
  },

  RadioTabs: {
    props: [
      'className?: string;',
      'alt?: boolean;',
      'onChange: (e: ChangeEvent) => void;',
      'disabled?: boolean;',
      'selected: string;',
      'options: IOption[];',
      'name: string;',
    ],
    render: () => (
      <div className={styles.examples}>
        <RadioTabs
          name="testRT1"
          selected={'0'}
          options={[{value: '0', label: 'Option 1',}, {value: '1', label: 'Option 2',}, {value: '2', label: 'Option 3',}]}
          onChange={() => {}}
        />
        <RadioTabs
          name="testRT2"
          disabled
          selected={'0'}
          options={[{value: '0', label: 'Option 1',}, {value: '1', label: 'Option 2',}, {value: '2', label: 'Option 3',}]}
          onChange={() => {}}
        />
        <RadioTabs
          name="testRT3"
          alt
          selected={'0'}
          options={[{value: '0', label: 'Option 1',}, {value: '1', label: 'Option 2',}, {value: '2', label: 'Option 3',}]}
          onChange={() => {}}
        />
        <RadioTabs
          name="testRT3"
          alt
          disabled
          selected={'0'}
          options={[{value: '0', label: 'Option 1',}, {value: '1', label: 'Option 2',}, {value: '2', label: 'Option 3',}]}
          onChange={() => {}}
        />
      </div>
    ),
  },

  SaveTabChangesModal: {
    props: [
      't: TFunction;',
      'visible: boolean;',
      'onAnswer: (answer: ExitAnswer) => void;',
    ],
    render: () => (
      <SaveTabChangesModal
        t={t => t}
        visible
        onAnswer={() => {}}
      />
    ),
  },

  SelectHOC: {
    props: [
      'async?: boolean;',
      'label?: string;',
      'error?: string;',
      'zIndex?: number;',
      'containerClass?: string;',
      'baseSelectProps: SelectComponentsProps & {name: string};',
      'asyncSelectProps?: AsyncPaginateProps<IOption>;',
    ],
    render: () => (
      <div className={styles.examples}>
        <SelectHOC
          label="Label"
          error="Error"
          baseSelectProps={{
            name: 'testSH1',
            value: {value: '0', label: 'Option 1',},
            options: [{value: '0', label: 'Option 1',}, {value: '1', label: 'Option 2',}, {value: '2', label: 'Option 3',}],
            onChange: () => {},
          }}
        />
        <SelectHOC
          baseSelectProps={{
            name: 'testSH2',
            isDisabled: true,
            value: {value: '0', label: 'Option 1',},
            options: [{value: '0', label: 'Option 1',}, {value: '1', label: 'Option 2',}, {value: '2', label: 'Option 3',}],
            onChange: () => {},
          }}
        />
      </div>
    )
  },

  SliderHOC: {
    props: [
      'className?: string;',
      'min: number;',
      'max: number;',
      'defaultValue?: [number, number];',
      'onChange: () => void;',
    ],
    render: () => (
      <div className={styles.examples}>
        <SliderHOC
          min={0}
          max={100}
          defaultValue={[1, 5]}
          onChange={() => {}}
        />
      </div>
    ),
  },

  SortStatus: {
    props: [
      'className?: string;',
      'status?: statusType;',
    ],
    render: () => (
      <div className={styles.examples}>
        <SortStatus status={'asc'} />
        <SortStatus status={'desc'} />
      </div>
    ),
  },

  Sticky: {
    props: [],
    render: () => (
      <>
      <Sticky>
        <button style={{background: '#f00', color: '#fff', padding: 8}}>[sticky button]</button>
      </Sticky>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aut dolorum fugiat perferendis similique. Deleniti dicta fuga fugiat fugit temporibus!</p>
     </>
    ),
  },

  TableManager: {
    props: [
      'data: ITableItem[];',
      'choosedData: string[];',
      'currentItem: string | null;',
      'columns: [string, string];',
      'sortType: string;',
      'sortAsc: boolean;',
      'noResultFoundMsg: string;',
      'onChangeSort: (value: string) => void;',
      'onChooseItems: (ids: string[]) => void;',
      'onSetActiveItem: (id: string) => void;',
    ],
    render: () => (
      <div className={styles.examples}>
        <div style={{background: '#333f50'}}>
          <TableManager
            data={[
              {id: '0', tableData: ['A1', 'A2']},
              {id: '1', tableData: ['B1', 'B2']},
              {id: '2', tableData: ['C1', 'C2']},
            ]}
            choosedData={['0']}
            currentItem={'1'}
            columns={['Column 1', 'Column 2']}
            sortType={'Column 1'}
            sortAsc
            noResultFoundMsg={'No results message.'}
            onChangeSort={() => {}}
            onChooseItems={() => {}}
            onSetActiveItem={() => {}}
          />
        </div>
        <div style={{background: '#333f50'}}>
          <TableManager
            data={[]}
            choosedData={[]}
            currentItem={null}
            columns={['Column 1', 'Column 2']}
            sortType={'Column 1'}
            sortAsc
            noResultFoundMsg={'No results message.'}
            onChangeSort={() => {}}
            onChooseItems={() => {}}
            onSetActiveItem={() => {}}
          />
        </div>
      </div>
    ),
  },

  Tabs: {
    props: [
      'className?: string;',
      'active?: string;',
      'tabs: ITab[];',
      'onChange: (id: string) => void;',
    ],
    render: () => (
      <Tabs
        active={'0'}
        tabs={[{id: '0', label: 'Tab 1'}, {id: '1', label: 'Tab 2'}, {id: '2', label: 'Tab 3'},]}
        onChange={() => {}}
      />
    )
  },

  TitlePanel: {
    props: [
      'className?: string;',
      'title: string;',
      'actions?: JSX.Element;',
    ],
    render: () => (
      <TitlePanel title="Title" actions={<span>[actions]</span>} />
    )
  },

  Toast: {
    props: [
      'static show = (message: string, config?: IToastConfig) => void'
    ],
    render: () => (
      <div className={styles.examples}>
        <button onClick={() => Toast.show('Message text', {type: 'info'})}>Show INFO</button>
        <button onClick={() => Toast.show('Message text', {type: 'info'})}>Show SUCCESS</button>
        <button onClick={() => Toast.show('Message text', {type: 'warning'})}>Show WARNING</button>
        <button onClick={() => Toast.show('Message text', {type: 'danger'})}>Show DANGER</button>
        <button onClick={() => Toast.show('Message text', {duration: 9999000})}>Show for 999 sec</button>
      </div>
    )
  },

  Tooltip: {
    props: [
      'disabled?: boolean;',
      'dark?: boolean;',
      'content?: JSX.Element;',
    ],
    render: () => (
      <div className={styles.examples}>
        <Tooltip content={<>content</>}>[children (hover to see tooltip)]</Tooltip>
        <Tooltip dark content={<>content</>}>[dark (hover to see tooltip)]</Tooltip>
      </div>
    ),
  },

  WidgetBlock: {
    props: [
      'className?: string;',
      'mainTitle: string;',
      'items: IItem[];',
    ],
    render: () => (
      <WidgetBlock
        mainTitle="Main Title"
        items={[
          {
            title: 'Title 1',
            icon: <Icon name="calendar" />,
            subTitle: 'Sub title',
          },
          {
            title: 'Title 2',
            icon: <Icon name="pin" />,
            subTitle: 'Sub title',
          }
        ]}
      />
    ),
  },
};

const UIAdvancedComponents: IComponents = {};

export default {...UIComponents, ...UIAdvancedComponents};
