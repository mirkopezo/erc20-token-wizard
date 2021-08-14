import React from 'react';
import ReactDOM from 'react-dom';
import App from 'App';
import { DAppProvider, ChainId } from '@usedapp/core';

const config = {
    readOnlyChainId: ChainId.Rinkeby,
    readOnlyUrls: {
      [ChainId.Rinkeby]: 'https://rinkeby.infura.io/v3/8d65382602524ab5b4bc1adc3c346c61',
    },
  }

ReactDOM.render(
    <DAppProvider config={config}>
        <App />
    </DAppProvider>, 
    document.getElementById('root')
);