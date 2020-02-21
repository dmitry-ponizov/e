import Tabs from 'components/Tabs';
import React from 'react';

const tabs = [
  {
    id: 'demographic',
    label: 'Demographic',
  },
  {
    id: 'behavioral',
    label: 'Behavioral',
  },
];

interface IProps {
  className?: string;
  active?: GroupTabType;
  onChange: (id: string) => void;
}

const GroupsTabsSwitcher = (props: IProps) => <Tabs {...props} tabs={tabs} />;

export default GroupsTabsSwitcher;
