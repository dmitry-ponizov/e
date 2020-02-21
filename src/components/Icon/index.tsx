import React, {CSSProperties} from 'react';
import styles from 'components/Icon/styles.module.scss';

export type IconName =
  | 'check'
  | 'pin'
  | 'groups'
  | 'customers'
  | 'star'
  | 'pencil'
  | 'message'
  | 'feed'
  | 'grid'
  | 'arrow-down'
  | 'bar-code'
  | 'warning'
  | 'question'
  | 'smile'
  | 'lightning'
  | 'share'
  | 'comments'
  | 'heart'
  | 'like'
  | 'view'
  | 'ticket'
  | 'transaction'
  | 'cash'
  | 'close'
  | 'calendar'
  | 'add-image'
  | 'delete'
  | 'angle-up'
  | 'angle-down'
  | 'angle-right'
  | 'angle-left'
  | 'search'
  | 'arrow-up'
  | 'equal'
  | 'greater-equal'
  | 'less-equal'
  | 'range'
  | 'reset'
  | 'save'
  | 'stop'
  | 'play'
  | 'account'
  | 'exit'
  | 'feedback'
  | 'move'
  | 'columns'
  | 'invisible'
  | 'visible'
  | 'arrow-right'
  | 'image'
  | 'percent'
  | 'gift'
  | 'plus'
  | 'greater'
  | 'less'
  | 'filter' | 'send' | 'archive' | 'refresh' | 'clock' | 'settings' | 'cloud';

export const iconsMap = {
  cloud: '\ue93d',
  settings: '\ue93c',
  clock: '\ue93b',
  refresh: '\ue905',
  send: '\ue939',
  archive: '\ue938',
  plus: '\ue937',
  greater: '\ue934',
  less: '\ue935',
  filter: '\ue936',
  'arrow-right': '\ue930',
  image: '\ue931',
  percent: '\ue932',
  gift: '\ue933',
  move: '\ue92c',
  columns: '\ue92d',
  invisible: '\ue92e',
  visible: '\ue92f',
  feedback: '\ue92b',
  exit: '\ue929',
  account: '\ue90f',
  reset: '\ue91f',
  save: '\ue926',
  stop: '\ue927',
  play: '\ue928',
  range: '\ue925',
  equal: '\ue922',
  'greater-equal': '\ue923',
  'less-equal': '\ue924',
  'arrow-up': '\ue921',
  search: '\ue920',
  'angle-left': '\ue91b',
  'angle-right': '\ue91a',
  'angle-down': '\ue919',
  'angle-up': '\ue918',
  delete: '\ue92a',
  'add-image': '\ue91e',
  calendar: '\ue91d',
  close: '\ue91c',
  cash: '\ue917',
  transaction: '\ue916',
  ticket: '\ue915',
  view: '\ue914',
  like: '\ue913',
  heart: '\ue912',
  comments: '\ue911',
  share: '\ue910',
  lightning: '\ue90e',
  smile: '\ue90d',
  question: '\ue90c',
  warning: '\ue90b',
  check: '\ue90a',
  pin: '\ue900',
  groups: '\ue901',
  customers: '\ue902',
  star: '\ue903',
  pencil: '\ue904',
  message: '\ue93a',
  feed: '\ue906',
  grid: '\ue907',
  'arrow-down': '\ue908',
  'bar-code': '\ue909',
};

interface IProps {
  name: IconName;
  className?: string;
  style?: CSSProperties;
}

const Icon: React.FC<IProps> = props => {
  return (
    <i style={props.style} className={`${styles.icon}${props.className ? ' ' + props.className : ''}`}>
      {iconsMap[props.name]}
    </i>
  );
};

export default Icon;
