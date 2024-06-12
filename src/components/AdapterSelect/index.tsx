import classNames from "classnames";
import {type ChangeEventHandler, useEffect, useMemo} from "react";
import type {
  IAdapterOption,
  IAdapterOptions
} from "~components/AdapterSelect/interface";
import Icon from "~components/Icon";
import type {ICryptoCurrency} from "~pages/WalletPage/interface";
import styles from "~pages/WithdrawPage/index.module.css";
import type {ValueOrNull} from "~types/global";

interface IComponentProps {
  adapters?: ICryptoCurrency["currencyAdapters"];
  selected: ValueOrNull<string>;
  onChange: ChangeEventHandler<HTMLSelectElement>;
}

export const AdapterSelect = ({
  adapters,
  selected,
  onChange
}: IComponentProps) => {
  const adaptersOptions = useMemo(
    () =>
      adapters?.map(
        ({adapter, tokenAddress}): IAdapterOption => ({
          code: adapter.code,
          name: adapter.mainCurrencyCode,
          address: tokenAddress
        })
      ) ?? null,
    [adapters]
  );

  useEffect(() => {
    if(
      adaptersOptions?.length === 1 &&
      selected !== adaptersOptions?.[0]?.code
    ) {
      onChange({
        target: {value: adaptersOptions[0].code} as unknown
      } as never);
    }
  }, [selected, adaptersOptions, onChange]);

  return adaptersOptions && adaptersOptions.length > 0 ? (
    <div className={classNames("form-container", styles.formContainer)}>
      <div className="form-label">Network</div>
      <div className="fields-wrapper __hasAfterContents">
        <select
          name="currency"
          className="isGray"
          value={selected ?? ""}
          onChange={onChange}
          required
        >
          {adaptersOptions.map(({code, name}) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <div>
          <Icon icon="custom-angle-1" style={{stroke: "#959595"}} />
        </div>
      </div>
    </div>
  ) : null;
};
