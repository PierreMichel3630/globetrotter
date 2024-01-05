import { Skeleton } from "@mui/material";
import { percent } from "csx";
import { useState } from "react";

interface Props {
  src: string;
  width?: number | string;
  height: number | string;
}

export const ImageRectangularBlock = ({
  src,
  width = percent(100),
  height,
}: Props) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && (
        <Skeleton
          variant="rectangular"
          sx={{ bgcolor: "grey.400" }}
          animation="wave"
          width={width}
          height={height}
        />
      )}
      <img
        src={src}
        style={{
          display: isLoading ? "none" : "block",
          width: width,
        }}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
};
