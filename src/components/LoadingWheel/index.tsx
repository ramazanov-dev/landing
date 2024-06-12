import React from "react";
import styles from "./index.module.css";

const defaultBorderColor = `#000`;
const defaultAnimationTimingFunction = `linear`;

export default function LoadingWheel(props: {
  size: number;
  width: number;
  spinsPerSecond: number;
  color?: string;
  animationTimingFunction?: string;
  additionalClassName?: string;

  domProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
}) {
  return (
    <div
      {...props.domProps}
      className={[styles.LoadingWheel, props.additionalClassName]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: props.size,
        height: props.size,
        borderColor: props.color || defaultBorderColor,
        borderWidth: props.width,
        borderStyle: "solid",
        animationDuration: `${1 / props.spinsPerSecond}s`,
        animationTimingFunction:
          props.animationTimingFunction || defaultAnimationTimingFunction
      }}
    />
  );
}
