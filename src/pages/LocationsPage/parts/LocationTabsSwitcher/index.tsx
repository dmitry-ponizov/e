import Tabs from 'components/Tabs';
import React from 'react';

const tabs = [
  {
    id: 'contact',
    label: 'Contact',
  },
  {
    id: 'profile',
    label: 'Profile',
  },
  {
    id: 'operation',
    label: 'Operation',
  },
  {
    id: 'integrations',
    label: 'Integrations',
  },
  {
    id: 'visa-mastercard',
    label: 'Visa / Mastercard',
  },
  {
    id: 'american-express',
    label: 'American Express',
  },
  {
    id: 'discover',
    label: 'Discover',
  },
];

interface IProps {
  className?: string;
  active?: LocationTabType;
  onChange: (id: string) => void;
}

const LocationTabsSwitcher = (props: IProps) => <Tabs {...props} tabs={tabs} />;

export default LocationTabsSwitcher;
