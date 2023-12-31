import { Box } from "@mui/material";
import { useSwipeable } from "react-swipeable";

interface Props {
  onSwipedLeft: () => void;
  onSwipedRight: () => void;
  children: string | JSX.Element | JSX.Element[];
}

export const SwipDetector = ({
  onSwipedLeft,
  onSwipedRight,
  children,
}: Props) => {
  const handlers = useSwipeable({
    delta: 5,
    trackMouse: true,
    trackTouch: true,
    onSwipedRight: onSwipedRight,
    onSwipedLeft: onSwipedLeft,
  });

  return <Box {...handlers}>{children}</Box>;
};
