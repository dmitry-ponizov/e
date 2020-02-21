import React from 'react';
import styles from 'components/Toast/styles.module.scss';
import MessageBox from 'components/MessageBox';

const defaultToastDuration = 5000;

type ToastType = 'info' | 'success' | 'warning' | 'danger';

interface IToastMessage {
  id: number;
  type: ToastType;
  text: string;
  timer: any;
}

interface IState {
  messages: IToastMessage[];
}

interface IToastConfig {
  type?: ToastType;
  duration?: number;
}

export default class Toast extends React.Component {
  static instance: Toast | null = null;

  state: IState = {
    messages: [],
  };

  componentDidMount() {
    Toast.instance = this;
  }

  static show = (message: string, config?: IToastConfig) => {
    const id = Date.now();
    const timer = setTimeout(
      () => {
        Toast.instance!.clearById(id);
      },
      config && config.duration ? config.duration : defaultToastDuration,
    );
    Toast.instance!.setState(
      (state: IState): Partial<IState> => ({
        messages: [
          ...state.messages,
          {
            id,
            timer,
            text: message,
            type: config && config.type ? config.type : 'info',
          },
        ],
      }),
    );
  };

  clearById = (id: number) => {
    Toast.instance!.setState((state: IState) => ({
      messages: state.messages.filter(message => message.id !== id),
    }));
  };

  handleCloseMessage = (id: number) => {
    this.setState({
      messages: this.state.messages.filter(message => message.id !== id),
    });
  };

  public render(): JSX.Element {
    return (
      <div className={styles.container}>
        {this.state.messages.map(message => {
          return (
            <div className={styles.message} key={message.id} onClick={() => this.handleCloseMessage(message.id)}>
              <MessageBox type={message.type}>{message.text}</MessageBox>
            </div>
          );
        })}
      </div>
    );
  }
}
