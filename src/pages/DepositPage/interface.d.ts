import type {ICryptoWithdrawalArgs} from "~pages/WithdrawPage/interface";
import type {ValueOrNull} from "~types/global";

export interface IDepositAddressResponse {
  address: string;
}

export interface IC3CoreDepositAddressArgs {
  currency: ICryptoWithdrawalArgs["currency"];
  adapterCode: ValueOrNull<string>;
}
