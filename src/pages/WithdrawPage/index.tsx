import {useQuery} from "@tanstack/react-query";
import classNames from "classnames";
import Decimal from "decimal.js-light";
import {
  type ChangeEventHandler,
  type FormEventHandler,
  useCallback,
  useMemo,
  useState
} from "react";
import {AdapterSelect} from "~components/AdapterSelect";
import type {IAdapterOption} from "~components/AdapterSelect/interface";
import {NavButton} from "~components/Aside";
import Icon from "~components/Icon";
import type {
  IBalanceItem,
  IC3CoreCurrency,
  ICryptoCurrency,
  IFiatCurrency
} from "~pages/WalletPage/interface";
import type {
  ICryptoWithdrawalArgs,
  ICryptoWithdrawalArgsPrecised
} from "~pages/WithdrawPage/interface";
import type {ValueOrNull} from "~types/global";
import {fetch, validateStatus} from "~utils/fetch";
import {getRandomNumber} from "~utils/misc";
import {queryClient} from "../../query-client";
import mainStore from "../../store/main";
import styles from "./index.module.css";

export const defaultCryptoCurrency = "BTC";
export default function WithdrawPage() {
  const {data: cryptoCurrencies, isSuccess: isCryptoCurrenciesLoaded} =
    useQuery<ICryptoCurrency[]>({
      queryKey: ["/client/crypto/currencies"]
    });
  const {data: balances} = useQuery<IBalanceItem[]>({
    queryKey: ["/client/balances"],
    enabled: isCryptoCurrenciesLoaded
  });

  const currencyList = useMemo(
    () => [
      ...(cryptoCurrencies?.map(({currency}) => ({
        label: currency,
        value: currency
      })) ?? [])
    ],
    [cryptoCurrencies]
  );
  const [withdraw, setWithdraw] = useState<ICryptoWithdrawalArgsPrecised>(
    () => ({
      amount: new Decimal(0).toFixed(8).slice(0, 10),
      currency: defaultCryptoCurrency,
      address: "",
      adapterCode: null
    })
  );
  const currency = useMemo<ValueOrNull<ICryptoCurrency>>(
    () =>
      cryptoCurrencies?.find(
        (currency) => currency.currency === withdraw.currency
      ) ?? null,
    [cryptoCurrencies, withdraw.currency]
  );
  const balance = useMemo<ValueOrNull<IBalanceItem>>(
    () =>
      balances?.find((currency) => currency.currency === withdraw.currency) ??
      null,
    [withdraw.currency]
  );

  const {available, fee, amount, canWithdraw} = useMemo(() => {
    const percent = currency?.withdrawalFees[0].percent ?? 0;
    const percentAsFee = Number(withdraw.amount) * percent;
    const getAmount = Number(withdraw.amount) - percentAsFee;
    const totalDeductAmount = getAmount + percentAsFee;

    const currentBalance = balance?.available ?? 0;

    return {
      available: new Decimal(Math.max(currentBalance - totalDeductAmount, 0))
        .toFixed(8)
        .slice(0, 10),
      fee: new Decimal(percentAsFee).toFixed(8).slice(0, 10),
      amount: new Decimal(currentBalance === 0 ? 0 : getAmount)
        .toFixed(8)
        .slice(0, 10),
      canWithdraw: currentBalance > 0 && currentBalance - totalDeductAmount >= 0
    };
  }, [balance, currency, withdraw]);

  return (
    <form
      className={classNames(styles.WithdrawPage, "isGray")}
      onSubmit={useCallback<FormEventHandler<HTMLFormElement>>(
        (e) => {
          e.preventDefault();

          fetch("/client/crypto/withdrawals", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${mainStore.sessionToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              ...withdraw,
              amount: Number(withdraw.amount)
            })
          })
            .then(validateStatus)
            .then(() => {
              queryClient.resetQueries({
                queryKey: ["/client/crypto/currencies", "/client/balances"]
              });
              return mainStore.addNotification({
                id: getRandomNumber(0, 9999999).toString(16),
                title: "Success",
                contents: "Withdrawal successful"
              });
            })
            .catch(() => {
              return mainStore.addNotification({
                id: getRandomNumber(0, 9999999).toString(16),
                title: "Error",
                contents: "Withdrawal failed"
              });
            });
        },
        [withdraw]
      )}
    >
      <div className="pageHeader">
        <NavButton isA={true} to="">
          <Icon icon="custom-arrow-left-1" />
        </NavButton>
        <div />
        <h1>Withdraw</h1>
      </div>

      <div style={{height: 30}} />

      <div className={styles.formWrapper}>
        <div className={classNames("form-container", styles.formContainer)}>
          <div className="form-label">Select currency</div>
          <div className="fields-wrapper __hasAfterContents">
            <select
              name="currency"
              className="isGray"
              value={withdraw.currency}
              onChange={useCallback<ChangeEventHandler<HTMLSelectElement>>(
                (e) => {
                  setWithdraw((withdraw) => ({
                    ...withdraw,
                    currency: e.target.value
                  }));
                },
                []
              )}
              required
            >
              {currencyList.map(({label, ...props}) => (
                <option key={props.value} {...props}>
                  {label}
                </option>
              ))}
            </select>
            <div>
              <Icon icon="custom-angle-1" style={{stroke: "#959595"}} />
            </div>
          </div>

          <AdapterSelect
            adapters={currency?.currencyAdapters}
            selected={withdraw.adapterCode}
            onChange={useCallback(
              (e) =>
                setWithdraw((withdraw) => ({
                  ...withdraw,
                  adapterCode: e.target.value
                })),
              []
            )}
          />

          <div className="form-label">Withdrawal address</div>
          <div className="fields-wrapper">
            <input
              name="address"
              type="text"
              className="isGray"
              required
              value={withdraw.address}
              onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                (e) => {
                  setWithdraw((withdraw) => ({
                    ...withdraw,
                    address: e.target.value
                  }));
                },
                []
              )}
            />
          </div>

          <div className="form-label">Amount</div>
          <div className="fields-wrapper __hasAfterContents">
            <input
              name="amount"
              type="text"
              value={withdraw.amount}
              onChange={useCallback<ChangeEventHandler<HTMLInputElement>>(
                (e) => {
                  setWithdraw((withdraw) => ({
                    ...withdraw,
                    amount: e.target.value
                  }));
                },
                []
              )}
              className="isGray"
              maxLength={10}
              required
              disabled={!balance?.available}
            />
            <div style={{color: "#959595", pointerEvents: "none"}}>
              {withdraw.currency}
            </div>
          </div>
        </div>
        <div className={styles.formResults}>
          <div className={styles.formResultsHeader}>Total</div>

          <div className="data-rows">
            <div className="data-rows-item">
              <span>Available</span>
              <span>
                {available} {withdraw.currency}
              </span>
            </div>

            <div className="data-rows-item">
              <span>Fee</span>
              <span>
                {fee} {withdraw.currency}
              </span>
            </div>

            <div className="data-rows-item">
              <span>You will get</span>
              <span>
                {amount} {withdraw.currency}
              </span>
            </div>
          </div>
        </div>

        <button
          className="isBrown isDuctile hide-on-desktop"
          disabled={!canWithdraw}
          type="submit"
        >
          <span>Continue</span>
          <Icon icon="custom-arrow-top-right-1" />
        </button>
      </div>

      <div style={{height: 50}} className="hide-on-mobile" />

      <button
        className="isBrown isDuctile hide-on-mobile"
        disabled={!canWithdraw}
        type="submit"
      >
        <span>Continue</span>
        <Icon icon="custom-arrow-top-right-1" />
      </button>
    </form>
  );
}
