import classNames from "classnames";
import {ReactNode} from "react";
import styles from "./index.module.css";

export default function Table(props: {
  headers: ReactNode[];
  rows: ReactNode[][];
  skipFirstHeader?: boolean;
}) {
  /* DOM */
  return (
    <div className={styles.Table}>
      {/* Desktop table */}
      <div className={styles.desktopTable}>
        {/* Desktop table header */}
        <div className={styles.desktopTableRow}>
          {props.headers.map((header, i) => (
            <div key={`${header}-${i}`} className={styles.desktopTableCell}>
              {header}
            </div>
          ))}
        </div>

        {/* Desktop table rows */}
        {props.rows.map((row, i) => (
          <div key={`${i}`} className={styles.desktopTableRow}>
            {row.map((cell, idx) => (
              <div key={`${idx}`} className={styles.desktopTableCell}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Mobile table */}
      <div className={styles.mobileTable}>
        {props.rows.map((row, i) => (
          <div key={`${i}`} className={styles.mobileTableItem}>
            {/* First header */}
            {props.skipFirstHeader ? (
              <div className={classNames(styles.mobileTableItemFirstHeader)}>
                {row[0]}
              </div>
            ) : null}

            {/* Regular rows */}
            <div className={styles.mobileTableItemRows}>
              {props.headers.map((header, _i) =>
                !(props.skipFirstHeader && _i === 0) ? (
                  <div key={`${_i}`} className={styles.mobileTableItemRowsItem}>
                    <span>{header}</span>
                    <span>{row[_i]}</span>
                  </div>
                ) : null
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
