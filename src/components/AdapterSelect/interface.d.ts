import type {IC3CoreCurrencyAdapterContent} from "~pages/WalletPage/interface";
import type {ValueOrNull} from "~types/global";

export interface IAdapterOption {
  code: IC3CoreCurrencyAdapterContent<boolean>["code"];
  name: IC3CoreCurrencyAdapterContent<boolean>["mainCurrencyCode"];
  address: ValueOrNull<string>;
}

export type IAdapterOptions = IAdapterOption[];
