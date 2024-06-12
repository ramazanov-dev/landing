import type {ICryptoCurrency} from "~pages/WalletPage/interface";

export const getCryptoScanAddrs = ({
  currency,
  txId
}: {currency: ICryptoCurrency["currency"]; txId: string}): string => {
  switch(currency) {
    case "BNB":
    case "BUSD":
    case "USDC": {
      return `https://bscscan.com/tx/${txId}`;
    }
    case "BTC": {
      return `https://www.blockchain.com/${currency.toLowerCase()}/tx/${txId}`;
    }
    case "ETH":
    case "USDT": {
      return `https://etherscan.io/tx/${txId}`;
    }
    case "TRX": {
      return `https://tronscan.org/#/transaction/${txId}`;
    }
    default: {
      return "";
    }
  }
};
