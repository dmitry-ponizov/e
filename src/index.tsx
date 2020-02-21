import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'mobx-react';
import {BrowserRouter} from 'react-router-dom';
import './i18n';
import {merchantStores, extensionStores} from 'stores';
import withDevtools from 'helpers/withDevtools';
import {ThemeProvider} from '@material-ui/core/styles';
import config from 'constants/config';
import MerchantApp from 'MerchantApp';
import CustomerApp from 'CustomerApp';
import materialTheme from 'helpers/createMaterialTheme';
import 'styles/styles.scss';


  const isExtension = localStorage.getItem(config.COMMON.extensionGlobalKey);

  const root = document.createElement('div');
  root.id = config.COMMON.appRootId;
  document.body.classList.add(isExtension ? config.COMMON.customerBodyClass : config.COMMON.merchantBodyClass);
  document.body.appendChild(root);

  console.log(
    `%c APP MODE: ${isExtension ? 'EXTENSION INJECTED APP' : 'MERCHANT WEB APP'}`,
    'color: green; font-size: 20px;',
  );

  ReactDOM.render(
    <ThemeProvider theme={materialTheme}>
      {isExtension ? (
        <Provider {...withDevtools(extensionStores)}>
          <CustomerApp />
        </Provider>
      ) : (
        <Provider {...withDevtools(merchantStores)}>
          <BrowserRouter>
            <MerchantApp />
          </BrowserRouter>
        </Provider>
      )}
    </ThemeProvider>,
    document.getElementById(config.COMMON.appRootId),
  );

