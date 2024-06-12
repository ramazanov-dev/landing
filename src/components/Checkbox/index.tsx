import classNames from "classnames";
import {useState} from "react";
import styles from "./index.module.css";

export default function Checkbox(props: {
  isActive: boolean;
  contents: string;
  onChange(): void;
}) {
  /* DOM */
  return (
    <div className={styles.Checkbox} onClick={() => props.onChange()}>
      <div
        className={classNames(styles.square, {isActive: props.isActive})}
      />

      {props.contents ? (
        <div className={styles.contents}>{props.contents}</div>
      ) : null}
    </div>
  );
}
