import {useQuery} from "@tanstack/react-query";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import {useMemo} from "react";
import {NavButton} from "~components/Aside";
import Icon from "~components/Icon";
import Table from "~components/Table";
import type {
  IBalanceItem,
  IC3CoreBalanceItemPrecised,
  ICryptoCurrency,
  IFiatCurrency
} from "~pages/WalletPage/interface";
import styles from "./index.module.css";

const createEmptyCurrencyData = ({
  currency,
  isFiat
}: {
  currency: IBalanceItem["currency"];
  isFiat: boolean;
}): IBalanceItem => ({
  isFiat,
  currency,
  available: 0,
  locked: 0
});

/* Component */
export default function WalletPage() {
  const {data: balances, isSuccess: isBalancesLoaded} = useQuery<
    IBalanceItem[]
  >({
    queryKey: ["/client/balances"]
  });
  const {data: cryptoCurrencies = [], isSuccess: isCryptoCurrenciesLoaded} =
    useQuery<ICryptoCurrency[]>({
      queryKey: ["/client/crypto/currencies"]
    });
  const {data: fiatCurrencies = [], isSuccess: isFiatCurrenciesLoaded} =
    useQuery<IFiatCurrency[]>({
      queryKey: ["/client/fiat/currencies"]
    });

  const wallets: IBalanceItem[] = useMemo(
    () =>
      [cryptoCurrencies, fiatCurrencies]
        .flat()
        .map(
          (currency) =>
            balances?.find(
              (balance) => balance.currency === currency.currency
            ) ?? createEmptyCurrencyData(currency)
        ) ?? [],
    [cryptoCurrencies, fiatCurrencies]
  );
  const precisedWallets = wallets.map(
    (wallet): IC3CoreBalanceItemPrecised => ({
      isFiat: wallet.isFiat,
      currency: wallet.currency,
      available: new Decimal(wallet.available).toFixed(8).slice(0, 10),
      locked: new Decimal(wallet.locked).toFixed(8).slice(0, 10)
    })
  );

  /* DOM */
  return (
    <div className={classNames(styles.WalletPage, "isGray")}>
      <div className="pageHeader">
        <h1>Wallet</h1>

        <div className="pageNav hideOnDesktop">
          <NavButton to="/wallet">
            <Icon icon="custom-wallet-1" />
          </NavButton>

          <NavButton to="/transactions">
            <Icon icon="custom-clock-1" />
          </NavButton>
        </div>
      </div>

      <div style={{height: 30}} />

      {isBalancesLoaded && isFiatCurrenciesLoaded && (
        <Table
          skipFirstHeader={true}
          headers={["Currency", "Total", "Available", "Locked"]}
          rows={precisedWallets
            .filter((wallet) => wallet.isFiat)
            .map((balance) => [
              <div key={balance.currency} className={styles.tableCurrency}>
                <img
                  src={`/assets/images/${
                    balance.currency.toLowerCase() as string
                  }.svg`}
                  alt=""
                />
                <span>{balance.currency}</span>
              </div>,
              <div>{balance.available}</div>,
              <div>{balance.available}</div>,
              <div>{balance.locked}</div>
            ])}
        />
      )}
      <div style={{height: 30}} />
      {isBalancesLoaded && isCryptoCurrenciesLoaded && (
        <Table
          skipFirstHeader={true}
          headers={["Currency", "Total", "Available", "Locked"]}
          rows={precisedWallets
            .filter((wallet) => !wallet.isFiat)
            .map((balance) => [
              <div key={balance.currency} className={styles.tableCurrency}>
                <img
                  src={`/assets/images/${
                    balance.currency.toLowerCase() as string
                  }.svg`}
                  alt=""
                />
                <span>{balance.currency}</span>
              </div>,
              <div>{balance.available}</div>,
              <div>{balance.available}</div>,
              <div>{balance.locked}</div>
            ])}
        />
      )}
    </div>
  );
}
