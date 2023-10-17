import { ConfigProvider, PortkeyAssetProvider, Ramp } from '@portkey/did-ui-react';
import router from 'next/router';
import { Store } from '../../utils';

const myStore = new Store();

ConfigProvider.setGlobalConfig({
  storageMethod: myStore,
});

export default function RampPage() {
  return (
    <div>
      <PortkeyAssetProvider originChainId="AELF" pin="111111">
        <Ramp
          onBack={function (): void {
            router.push('/sign');
          }}
          onShowPreview={function (data): void {
            router.push(`/ramp-preview/${JSON.stringify(data)}`);
          }}
          tokenInfo={{
            decimals: 8,
            chainId: 'AELF',
            symbol: 'ELF',
            tokenContractAddress: 'JRmBduh4nXWi1aXgdUsj5gJrzeZb2LxmrAbf7W99faZSvoAaE',
          }}
          portkeyWebSocketUrl={'http://192.168.66.240:5577/ca'}
          isMainnet={true}
          isShowSelectInModal={true}
          isBuySectionShow={false}
        />
      </PortkeyAssetProvider>
    </div>
  );
}
