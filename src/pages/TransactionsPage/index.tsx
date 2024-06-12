import classNames from "classnames";

import {useQuery} from "@tanstack/react-query";
import {useState} from "react";
import {NavButton} from "~components/Aside";
import Icon from "~components/Icon";
import Table from "~components/Table";
import type {
  IOperationsHistoryEntry,
  IOperationsHistoryResponse
} from "~pages/TransactionsPage/interface";
import {intlDate} from "~utils/date-intl";
import {getCryptoScanAddrs} from "~utils/get-links";
import styles from "./index.module.css";

/* Table data */

/* Component */
export default function TransactionsPage({pageLimit = 30}) {
  /* State */
  const [offset, _setOffset] = useState(0);

  const search = new URLSearchParams({
    pageSize: String(pageLimit),
    pageNumber: String(offset / pageLimit + 1)
  });
  const {data: operations, isSuccess: isOperationsLoaded} =
    useQuery<IOperationsHistoryResponse>({
      queryKey: [`/client/crypto/operation_history?${search.toString()}`]
    });

  /* DOM */
  return (
    <div className={classNames(styles.TransactionsPage, "isGray")}>
      <div className="pageHeader">
        <h1>Crypto operations history</h1>

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

      {isOperationsLoaded && operations ? (
        <Table
          headers={["Date", "Currency", "Amount", "Type", "TXID"]}
          rows={operations.items.map((operation) => [
            <div>{intlDate.format(Date.parse(operation.date))}</div>,
            <div>{operation.currency}</div>,
            <div>{operation.amount}</div>,
            <div>{operation.type}</div>,
            <NavButton
              to={getCryptoScanAddrs(operation)}
              isA={true}
              className={styles.tableIconedLink}
              aProps={{target: "_blank"}}
            >
              <Icon icon="custom-link-1" />
            </NavButton>
          ])}
        />
      ) : null}
    </div>
  );
}
