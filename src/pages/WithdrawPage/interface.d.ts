import type {ICryptoBalanceItem} from "~pages/WalletPage/interface";
import {ValueOrNull} from "~types/global";

export interface ICryptoWithdrawalArgs {
  address: string;
  currency: ICryptoBalanceItem["currency"];
  amount: number;
  adapterCode: ValueOrNull<string>;
  tfaCode?: ValueOrNull<string>;
}

export interface ICryptoWithdrawalArgsPrecised extends ICryptoWithdrawalArgs {
  amount: string;
}

export interface IC3CoreCryptoWithdrawalArgs {
  address: string;
  addressPublicKey: ValueOrNull<string>; // Public key of node's address, required for Prizm (PZM)
  amount: number;
  currencyCode: string;
  adapterCode: ValueOrNull<string>;
}
