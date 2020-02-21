import styles from 'pages/MessagesPage/parts/SendForm/styles.module.scss';
import Icon from 'components/Icon';
import React, {useState} from 'react';

interface IProps {
  placeholder?: string;
  onSend: (message: string) => void;
}

const SendForm: React.FC<IProps> = ({placeholder, onSend}) => {
  const [message, setMessage] = useState('');

  const handlePress = e => {};

  return (
    <form className={styles.sendForm}>
      <label className={styles.message}>
        <Icon name="message" />
        <textarea
          placeholder={placeholder}
          value={message}
          onChange={e => setMessage(e.target.value)}
          onKeyDown={handlePress}
        />
      </label>
      <div
        className={styles.btnSend}
        onClick={() => {
          onSend(message);
          setMessage('');
        }}
      >
        <Icon name="send" />
      </div>
    </form>
  );
};

export default SendForm;
