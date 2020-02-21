import React, {useEffect, useRef} from 'react';
import styles from 'components/MessagesWall/styles.module.scss';
import ModuleLoader from 'components/ModuleLoader';
import moment, {Moment} from 'moment';

interface IMessage {
  id: string;
  text: string;
  date: number;
  own: boolean;
}

interface IProps {
  className?: string;
  messages: IMessage[];
  onReachEnd?: () => void;
  loading?: boolean;
}

const getDay = (date: number, today: string, yesterday: string) => {
  const now = moment();
  const momentDate = moment(date);
  if (now.isSame(momentDate, 'date')) {
    return today;
  }
  if (now.subtract(1, 'day').isSame(momentDate, 'date')) {
    return yesterday;
  }
  return momentDate.format('MMMM DD, YYYY')
};

const MessagesWall: React.FC<IProps> = ({className, messages, onReachEnd, loading}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollTo(0, 99999);
  }, [messages]);

  let containerClasses = styles.container;
  if (className) {
    containerClasses += ` ${className}`;
  }

  const wallContent: JSX.Element[] = [];

  let currDay: Moment | null = null;

  messages.forEach(message => {
    const messageDay = moment(message.date).startOf('day');
    if (!currDay || currDay.valueOf() !== messageDay.valueOf()) {
      currDay = messageDay;
      wallContent.push(
        <div key={message.date} className={styles.dayTitle}>
          <span>{getDay(message.date, 'Today', 'Yesterday')}</span>
        </div>
      );
    }

    let messageClasses = styles.message;
    if (message.own) {
      messageClasses += ` ${styles.own}`;
    }
    wallContent.push(
      <div key={message.id} className={messageClasses}>
        <div className={styles.cloud}>{message.text}</div>
        <span className={styles.date}>{moment(message.date).format('hh:mm A')}</span>
      </div>
    );
  });

  return (
    <div className={containerClasses} ref={ref}>
      {loading && (
        <div className={styles.loader}>
          <ModuleLoader />
        </div>
      )}
      <div className={styles.list}>
        {wallContent}
      </div>
    </div>
  );
};

export default MessagesWall;
