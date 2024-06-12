import type {ICryptoBalanceItem} from "src/pages/WalletPage/interface";

export interface IOperationsHistoryEntry {
  transactionId: string;
  txId: string;
  date: string;
  currency: ICryptoBalanceItem["currency"];
  amount: string;
  type: string;
}

export interface IOperationsHistoryResponse {
  items: IOperationsHistoryEntry[];
  totalCount: number;
}
