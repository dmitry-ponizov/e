import React from 'react';
import SimpleRouter from 'pages/_Extension/SimpleRouter';
import CustomerMenu from 'pages/_Extension/CustomerMenu';
import ExtensionRewards from './pages/_Extension/ExtensionRewards/index';

const CustomerApp = () => {
  return (
    <>
      <ExtensionRewards />
      <SimpleRouter />
      <CustomerMenu />
    </>
  );
};

export default CustomerApp;
