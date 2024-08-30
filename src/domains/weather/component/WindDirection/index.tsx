import { FC } from "react";

interface Props {
  direction: number;
}

const WindDirection: FC<Props> = (props) => {
  const { direction } = props;

  return (
    <div role="presentation" aria-label={`${direction}deg`}>
      <span>⬆</span>
    </div>
  );
};

export { WindDirection };
