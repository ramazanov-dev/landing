import {useQuery} from "@tanstack/react-query";
import classNames from "classnames";
import {type ChangeEventHandler, useCallback, useMemo, useState} from "react";
import {AdapterSelect} from "~components/AdapterSelect";
import type {IAdapterOption} from "~components/AdapterSelect/interface";
import {NavButton} from "~components/Aside";
import Icon from "~components/Icon";
import type {
  IC3CoreDepositAddressArgs,
  IDepositAddressResponse
} from "~pages/DepositPage/interface";
import type {
  IBalanceItem,
  ICryptoCurrency
} from "~pages/WalletPage/interface";
import type {ValueOrNull} from "~types/global";
import {copyToClipboard} from "~utils/clipboard";
import {getRandomNumber} from "~utils/misc";
import mainStore from "../../store/main";
import styles from "./index.module.css";

export const defaultCryptoCurrency = "BTC";
export default function DepositPage() {
  const [depositParams, setDepositParams] = useState<IC3CoreDepositAddressArgs>(
    {
      currency: defaultCryptoCurrency,
      adapterCode: defaultCryptoCurrency
    }
  );
  const {data: cryptoCurrencies} = useQuery<ICryptoCurrency[]>({
    queryKey: ["/client/crypto/currencies"]
  });
  const url = new URLSearchParams(depositParams as never);
  const {data: address = {address: "-"}, isLoading: isAddressLoading} =
    useQuery<IDepositAddressResponse>({
      queryKey: ["/client/crypto/deposit_address?" + url.toString()],
      enabled: !!depositParams.currency
    });
  const isValidAddress = address?.address && address?.address !== "-";

  const currencyList = useMemo(
    () =>
      cryptoCurrencies?.map(({currency}) => ({
        label: currency,
        value: currency
      })) ?? [],
    [cryptoCurrencies]
  );

  return (
    <div className={classNames(styles.DepositPage, "isGray")}>
      <div className="pageHeader">
        <NavButton isA={true} to="">
          <Icon icon="custom-arrow-left-1" />
        </NavButton>
        <div />
        <h1>Deposit</h1>
      </div>

      <div style={{height: 30}} />

      <div className={styles.formWrapper}>
        <div className={classNames("form-container", styles.formContainer)}>
          <div className="form-label">Select currency</div>
          <div className="fields-wrapper __hasAfterContents">
            <select
              name="currency"
              className="isGray"
              value={depositParams.currency}
              onChange={useCallback<ChangeEventHandler<HTMLSelectElement>>(
                (e) =>
                  setDepositParams((params) => ({
                    ...params,
                    currency: e.target.value as ICryptoCurrency["currency"]
                  })),
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
            adapters={useMemo(
              () =>
                cryptoCurrencies?.find(
                  (currency) => currency.currency === depositParams.currency
                )?.currencyAdapters,
              [cryptoCurrencies, depositParams.currency]
            )}
            selected={depositParams.adapterCode}
            onChange={useCallback((e) => {
              setDepositParams((params) => ({
                ...params,
                adapterCode: e.target.value as IAdapterOption["code"]
              }));
            }, [])}
          />

          <div className="form-label">Your address</div>
          <div className="fields-wrapper" style={{alignItems: "center"}}>
            <input
              type="text"
              className="isGray"
              placeholder="0x0000000000000000000000000"
              value={isAddressLoading ? "Loading..." : address?.address}
              readOnly
              disabled={isAddressLoading}
            />
            <div
              style={{cursor: isValidAddress ? "pointer" : "default"}}
              onClick={useCallback(() => {
                if(!isValidAddress) {
                  return;
                }
                copyToClipboard(address?.address)
                  .then(() => {
                    return mainStore.addNotification({
                      id: getRandomNumber(0, 9999999).toString(16),
                      title: "Success",
                      contents: "Deposit address copied"
                    });
                  })
                  .catch((err) => {
                    return mainStore.addNotification({
                      id: getRandomNumber(0, 9999999).toString(16),
                      title: "Error",
                      contents: err.message
                    });
                  });
              }, [isValidAddress, address?.address])}
            >
              <Icon
                icon="custom-click-to-copy-1"
                style={{
                  stroke: isValidAddress ? "#000" : "#aaa",
                  width: 24
                }}
              />
            </div>
          </div>

          <div className="form-small-tip" style={{color: "#C0976B"}}>
            Minimum deposit is 10 USDT
          </div>
        </div>
      </div>
    </div>
  );
}
