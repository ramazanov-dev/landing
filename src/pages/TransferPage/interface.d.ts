import type {ICryptoCurrency} from "~pages/WalletPage/interface";

export interface ICryptoTransferArgs {
  userId: string;
  currency: ICryptoCurrency["currency"];
  amount: number;
}

export interface ICryptoTransferArgsPrecised extends ICryptoTransferArgs {
  amount: string;
}
