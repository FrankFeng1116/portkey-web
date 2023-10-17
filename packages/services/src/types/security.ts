import { ChainId } from '@portkey/types';

export interface IWalletBalanceCheckParams {
  caHash: string;
}
export interface IWalletBalanceCheckResponse {
  isOriginChainSafe: boolean;
  isSynchronizing: boolean;
  isTransferSafe: boolean;
}

export interface ISecurityService {
  getWalletBalanceCheck(params: IWalletBalanceCheckParams): Promise<IWalletBalanceCheckResponse>;
  getPaymentSecurityList(params: IPaymentSecurityListParams): Promise<IPaymentSecurityListResponse>;
}

export interface ITransferLimitItem {
  chainId: ChainId;
  symbol: string;
  singleLimit: string;
  dailyLimit: string;
  restricted: boolean;
  decimals: number | string;
  defaultSingleLimit?: string;
  defaultDailyLimit?: string;
}

export interface IPaymentSecurityListParams {
  caHash: string;
  skipCount: number;
  maxResultCount: number;
}

export interface IPaymentSecurityListResponse {
  data: ITransferLimitItem[];
  totalRecordCount: number;
  code?: number;
  message?: string;
}
