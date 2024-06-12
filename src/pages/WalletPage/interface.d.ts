import {CertainOrUncertainArrayOrNull, ValueOrNull} from "~types/global";

/** FIAT * */
export type FiatPaymentMethods = string;

export interface FiatDetailInfo {
  [key: string]: string;
}

export interface FiatDetail {
  type: FiatPaymentMethods;
  isActive: boolean;
  details: ValueOrNull<FiatDetailInfo>;
}

export type FiatDepositDetails = FiatDetail[];
export type FiatWithdrawalDetails = FiatDetail[];

/** CRYPTO * */
export interface IC3CoreCurrencyAdapterContent<IsFiat = boolean> {
  code: "eth" | "trx";
  name: string;
  mainCurrencyCode: "ETH" | "TRX";
  isFiat: IsFiat;
}

export interface IC3CoreCurrencyAdapter<IsFiat = boolean> {
  currencyCode: string;
  adapterCode: string;
  tokenAddress: ValueOrNull<string>;
  adapter: IC3CoreCurrencyAdapterContent<IsFiat>;
}

export interface IC3CoreCurrency {
  depositMinAmount: number;
  withdrawalMinAmount: number;
  withdrawalCommissions: IC3CoreCurrencyWithdrawalCommission[];
  code: ValueOrNull<string>;
  value: ValueOrNull<string>;
  unifiedCryptoAssetId: ValueOrNull<number>;
  isHalted: boolean;
  isFiat: boolean;
  fiatDepositDetails: ValueOrNull<FiatDepositDetails>;
  fiatWithdrawalDetails: ValueOrNull<FiatWithdrawalDetails>;
  isShowedForUsers: boolean;
  isForCommissionConversion: boolean;
  tokenOf: ValueOrNull<string>;
  address: ValueOrNull<string>;
  digits: number;
  website: ValueOrNull<string>;
  whitePaper: ValueOrNull<string>;
  about: ValueOrNull<string>;
  issuingTime: ValueOrNull<string>;
  issuingPrice: ValueOrNull<string>;
  totalSupply: ValueOrNull<string>;
  networkConfirmations: ValueOrNull<string>;
  logoImage: ValueOrNull<string>;
  allowDeposits: boolean;
  allowWithdrawals: boolean;
  currencyAdapters: ValueOrNull<IC3CoreCurrencyAdapter[]>;
  readonly cryptoAdapterId: ValueOrNull<string>;
}

export interface IC3CoreCurrencyWithdrawalCommission {
  commissionId: string;
  currencyCode: string;
  adapterCode: string;
  percent: number;
  minimum: number;
  commissionCurrencyCode: string;
  commissionTypeCode: string;
  commissionType: {
    code: string;
    value: string;
    valueKey: string;
  };
}

export type C3CoreCryptoCurrenciesResponse = IC3CoreCurrency[];

export interface ICryptoWithdrawalFee {
  adapterCode: string;
  percent: number;
  minimum: number;
}

/** MAPPED CURRENCIES * */
export interface ICryptoCurrency {
  isFiat: false;
  currency: "BNB" | "BTC" | "BUSD" | "ETH" | "TRX" | "USDC" | "USDT";
  precision: number;
  minDeposit: number;
  withdrawalFees: ICryptoWithdrawalFee[];
  currencyAdapters: IC3CoreCurrencyAdapter<false>[];
}

export interface IFiatCurrency extends ICryptoCurrency {
  isFiat: true;
  currency: "USD" | "EUR" | "RUB";
  fiatDepositDetails: ValueOrNull<FiatDepositDetails>;
  fiatWithdrawalDetails: ValueOrNull<FiatWithdrawalDetails>;
}

export type CryptoCurrenciesResponse = ICryptoCurrency[];

export interface IBalanceItem {
  isFiat: boolean;
  currency:
    | "USD"
    | "EUR"
    | "RUB"
    | "BNB"
    | "BTC"
    | "BUSD"
    | "ETH"
    | "TRX"
    | "USDC"
    | "USDT";
  available: number;
  locked: number;
}

export interface IC3CoreBalanceItemPrecised extends IBalanceItem {
  available: string;
  locked: string;
}

export interface IC3CoreBalanceItem {
  accountChart: {
    code: ValueOrNull<string>;
    value: ValueOrNull<string>;
    valueKey: ValueOrNull<string>;
  };
  currencyCode: ValueOrNull<string>;
  balance: number;
}

export interface IC3CoreBalanceItemFiltered {
  accountChart: {
    code: string;
    value: ValueOrNull<string>;
    valueKey: ValueOrNull<string>;
  };
  currencyCode: string;
  balance: number;
}

export type C3CoreBalanceResponse = IC3CoreBalanceItem[];
