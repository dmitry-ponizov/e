import React, {ChangeEvent} from 'react';

export const handleChangeField = (component: React.Component) => (e: ChangeEvent<HTMLInputElement>) => {
  const {name, value} = e.target;
  component.setState({
    [name]: {
      value,
      error: component.state[name].error,
    },
  });
};

export const handleChangeValue = (component: React.Component) => (name: string, value: string) => {
  component.setState({
    [name]: {
      value,
      error: component.state[name].error,
    },
  });
};
