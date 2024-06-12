import classNames from "classnames";
import {type ComponentProps, ReactNode} from "react";
import {NavLink} from "react-router-dom";
import Icon from "../Icon";
import styles from "./index.module.css";

export function NavButton(props: {
  to: string;
  className?: string;
  navLinkProps?: ComponentProps<typeof NavLink>;
  children: ReactNode;

  isA?: boolean;
  aProps?: ComponentProps<"a">;
}) {
  /* DOM (a) */
  if(props.isA) {
    return (
      <a
        href={props.to}
        className={classNames(styles.NavButton, props.className)}
        {...props.aProps}>
        {props.children}
      </a>
    );
  }

  /* DOM */
  return (
    <NavLink
      to={props.to}
      className={classNames(styles.NavButton, props.className)}
      {...props.navLinkProps}>
      {props.children}
    </NavLink>
  );
}

export default function Aside() {
  /* DOM */
  return (
    <div className={styles.Aside}>
      <img src="/logo.svg" alt="" />

      <nav>
        <NavButton to="/wallet">
          <Icon icon="custom-wallet-1" />
        </NavButton>

        <NavButton to="/transactions">
          <Icon icon="custom-clock-1" />
        </NavButton>
      </nav>

      <nav>
        <NavButton to="/withdraw">
          <Icon icon="custom-arrow-square-up-1" />
        </NavButton>

        <NavButton to="/deposit">
          <Icon icon="custom-arrow-square-down-in-1" />
        </NavButton>

        <NavButton to="/transfer">
          <Icon icon="custom-arrows-left-right-1" />
        </NavButton>

        <NavButton to="/exchange">
          <Icon icon="custom-convert-1" />
        </NavButton>
      </nav>

      <nav>
        <NavButton to="/profile">
          <Icon icon="custom-settings-1" />
        </NavButton>

        <NavButton to="/logout">
          <Icon icon="custom-arrow-square-left-1" />
        </NavButton>
      </nav>

      {/* Mobile footer */}
      <nav className="__mobile-footer">
        <NavButton to="/wallet">
          <Icon icon="custom-wallet-1" />
        </NavButton>

        <NavButton to="/withdraw">
          <Icon icon="custom-arrow-square-up-1" />
        </NavButton>

        <NavButton to="/deposit">
          <Icon icon="custom-arrow-square-down-in-1" />
        </NavButton>

        <NavButton to="/transfer">
          <Icon icon="custom-arrows-left-right-1" />
        </NavButton>

        <NavButton to="/exchange">
          <Icon icon="custom-convert-1" />
        </NavButton>

        <NavButton to="/profile">
          <Icon icon="custom-settings-1" />
        </NavButton>
      </nav>
    </div>
  );
}
