import { FC } from "react";
import arrow from "./arrow.svg";
import Image from "next/image";

interface Props {
  direction: number;
}

const WindDirection: FC<Props> = (props) => {
  const { direction } = props;

  return (
    <div
      role="presentation"
      aria-label={`${direction}deg`}
      style={{
        width: "fit-content",
        rotate: `${direction}deg`,
      }}
    >
      <Image src={arrow} fill={false} width={18} height={18} alt="arrow icon" />
    </div>
  );
};

export { WindDirection };
