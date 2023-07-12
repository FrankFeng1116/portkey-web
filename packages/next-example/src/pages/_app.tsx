import '@portkey/did-ui-react/dist/assets/index.css';
import { PortkeyConfigProvider } from '@portkey/did-ui-react';
import './index.css';

export default function APP({ Component, pageProps }: any) {
  return (
    <PortkeyConfigProvider theme={'dark'}>
      <Component {...pageProps} />
    </PortkeyConfigProvider>
  );
}
