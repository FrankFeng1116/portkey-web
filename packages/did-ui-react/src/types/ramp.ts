import { ChainId } from '@portkey/types';

export enum RampTypeEnum {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum RampDrawerType {
  TOKEN = 'TOKEN',
  CURRENCY = 'CURRENCY',
}

export interface IRampConfig {
  isBuySectionShow: boolean;
  isSellSectionShow: boolean;
  isManagerSynced: boolean;
}

export interface IAchConfig {
  appId: string;
  baseUrl: string;
  updateAchOrder: string;
}

export interface GetFiatType {
  currency: string; // 3 letters fiat code
  country: string; // 2 letters region code
  payWayCode: string; // code of payment
  payWayName: string; // name of payment
  fixedFee: number | string; // ramp flat rate
  rateFee?: number | string; // ramp percentage rate
  payMin: number | string;
  payMax: number | string;
}

export interface FiatType extends GetFiatType {
  countryName?: string;
  icon?: string;
}

export type PartialFiatType = Partial<FiatType>;

export interface AchTokenInfoType {
  token: string;
  expires: number;
}
export interface PaymentStateType {
  buyFiatList: FiatType[];
  sellFiatList: FiatType[];
  achTokenInfo?: AchTokenInfoType;
}

export interface ICurrencyItem {
  country: string;
  iso: string;
  icon: string;
}

export interface ICurToken {
  crypto: string;
  network: string;
}

export type ITokenType = {
  symbol: string;
  chainId: ChainId;
};