import { INftCollectionItem } from '@portkey-v1/services';
import { ChainId, ChainType } from '@portkey-v1/types';

export enum BalanceTab {
  TOKEN = 'token',
  NFT = 'nft',
  ACTIVITY = 'activity',
}

export interface BaseToken {
  id?: string; // id
  chainId: ChainId;
  decimals: number | string;
  address: string; // token  contract address
  symbol: string;
}

export interface BaseTokenExpand extends BaseToken {
  name: string;
  imageUrl?: string;
  alias?: string;
  tokenId?: string; // nft tokenId
}

export interface AssetTokenExpand extends BaseTokenExpand {
  balanceInUsd?: string;
  balance?: string;
}

export interface TokenItemType extends BaseTokenExpand {
  isDefault?: boolean; // boolean,
  tokenName?: string;
}

export interface TokenItemShowType extends TokenItemType {
  isAdded?: boolean; // boolean
  tokenContractAddress?: string;
  imageUrl?: string;
  balance?: string;
  balanceInUsd?: string;
  price?: string | number;
  userTokenId?: string;
}

// nft item types
export type NFTItemBaseType = {
  chainId: ChainId;
  symbol: string;
  tokenId: string;
  alias: string;
  imageUrl: string;
  tokenContractAddress: string;
  totalSupply: string | number;
  balance: string;
  quantity: string;
};

export interface NFTItemBaseExpand extends INftCollectionItem {
  decimals?: 0;
  collectionName: string;
  collectionImageUrl: string;
}

// nft collection types
export type NFTCollectionItemBaseType = {
  chainId: ChainId;
  collectionName: string;
  imageUrl: string;
  itemCount: number;
  symbol: string;
  decimals: number; // 0
};

export interface NFTCollectionItemShowType extends NFTCollectionItemBaseType {
  isFetching: boolean;
  skipCount: number;
  maxResultCount: number;
  totalRecordCount: string | number;
  children: INftCollectionItem[];
}

export interface IFaucetConfig {
  // Only when testing the network, you can configure the faucet address
  faucetUrl?: string;
  faucetContractAddress?: string;
}

export type TokenType = 'TOKEN' | 'NFT';

export interface IClickAddressProps {
  name?: string;
  isDisable?: boolean;
  chainId: ChainId;
  addressChainId?: string;
  address: string;
}

export enum TransactionError {
  TOKEN_NOT_ENOUGH = 'Insufficient funds',
  NFT_NOT_ENOUGH = 'Insufficient quantity',
  FEE_NOT_ENOUGH = 'Insufficient funds for transaction fee',
  CROSS_NOT_ENOUGH = 'Insufficient funds for cross-chain transaction fee',
}

export type the2ThFailedActivityItemType = {
  transactionId: string;
  params: {
    chainId: ChainId;
    chainType: ChainType;
    managerAddress: string;
    tokenInfo: BaseToken;
    tokenIssueChainId: number;
    amount: number;
    toAddress: string;
    memo?: string;
    sandboxId?: string;
  };
};
