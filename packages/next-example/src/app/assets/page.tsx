'use client';

import { ConfigProvider, Asset, PortkeyAssetProvider } from '@portkey/did-ui-react';
import React from 'react';

ConfigProvider.setGlobalConfig({
  // storageMethod: myStore,

  requestDefaults: {
    timeout: 30000,
  },
  // loginConfig: {
  //   loginMethodsOrder: ['Email', 'Google', 'Phone', 'Apple', 'Scan'],
  //   recommendIndexes: [0, 1],
  // },
});

export default function Assets() {
  return (
    <PortkeyAssetProvider pin="111111" originChainId="AELF">
      <Asset
        faucet={{
          faucetContractAddress: '2UM9eusxdRyCztbmMZadGXzwgwKfFdk8pF4ckw58D769ehaPSR',
        }}
        onLifeCycleChange={lifeCycle => {
          console.log(lifeCycle, 'onLifeCycleChange');
        }}
      />
    </PortkeyAssetProvider>
  );
}
