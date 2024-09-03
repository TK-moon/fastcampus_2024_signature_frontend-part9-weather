import { FC, PropsWithChildren, ReactNode } from "react";
import styles from "./index.module.css";

interface Props extends PropsWithChildren {}

const Layout: FC<Props> = (props) => {
  const { children } = props;

  return <div className={styles.container}>{children}</div>;
};

export { Layout };
