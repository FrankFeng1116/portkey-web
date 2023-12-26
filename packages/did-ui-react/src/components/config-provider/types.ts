import { IConfig } from '@portkey-v1/types';
import { ISocialLoginConfig } from '../../types';
import { BaseReCaptcha } from '../types';

export interface ConfigProviderProps {
  children?: React.ReactNode;
}

export interface GlobalConfigProps extends IConfig {
  socialLogin?: ISocialLoginConfig;
  reCaptchaConfig?: BaseReCaptcha;
  socketUrl?: string;
  apiUrl?: string;
  serviceUrl?: string;
}
