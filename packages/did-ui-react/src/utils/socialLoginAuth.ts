import { ISocialLogin } from '../types';
import { stringify } from 'query-string';
const loginPlatform = 'https://openlogin.portkey.finance';
// const loginPlatform = 'https://openlogin-test.portkey.finance';
// const loginPlatform = 'http://localhost:3000';

export const socialLoginAuth = ({
  type,
  clientId,
  redirectURI,
}: {
  type: ISocialLogin;
  clientId?: string;
  redirectURI?: string;
}): Promise<{
  token: string;
  provider: ISocialLogin;
}> =>
  new Promise((resolve, reject) => {
    let timer: any = null;

    const onMessage = (event: MessageEvent) => {
      const type = event.data.type;
      if (type === 'PortkeySocialLoginOnSuccess' || type === 'PortkeySocialLoginOnFailure') {
        timer && clearInterval(timer);
      }
      switch (type) {
        case 'PortkeySocialLoginOnSuccess':
          resolve(event.data.data);
          break;
        case 'PortkeySocialLoginOnFailure':
          reject(event.data.error);
          break;
        default:
          return;
      }
      window.removeEventListener('message', onMessage);
    };
    window.addEventListener('message', onMessage);
    const windowOpener = window.open(`${loginPlatform}/social-login/${type}?${stringify({ clientId, redirectURI })}`);

    timer = setInterval(() => {
      if (windowOpener?.closed) {
        clearInterval(timer);
        reject('User close the prompt');
        timer = null;
      }
    }, 1600);
  });
