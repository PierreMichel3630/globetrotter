import { Box, IconButton } from "@mui/material";
import { padding, percent, px } from "csx";
import { useEffect, useState } from "react";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { SwipDetector } from "./SwipDetector";

interface Props {
  images: Array<string>;
}
export const Carrousel = ({ images }: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [images]);

  const goPrevious = () => {
    setIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };
  const goNext = () => {
    setIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    images.length > 0 && (
      <SwipDetector onSwipedLeft={goNext} onSwipedRight={goPrevious}>
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              width: percent(100),
              height: px(30),
              background:
                "linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,0) 100%)",
            }}
          >
            <Box sx={{ p: padding(14, 12), display: "flex", gap: px(3) }}>
              {images.map((_, i) => (
                <Box
                  sx={{
                    backgroundColor:
                      index >= i
                        ? "rgba(255,255,255,1)"
                        : "rgba(255,255,255,0.4)",
                    height: px(3),
                    borderRadius: px(1),
                    flex: "1 1 0",
                    cursor: "pointer",
                  }}
                  key={i}
                  onClick={() => setIndex(i)}
                />
              ))}
            </Box>
          </Box>
          <img src={images[index]} style={{ width: percent(100) }} />
          <Box
            sx={{
              position: "absolute",
              right: 10,
              bottom: 10,
              display: { xs: "none", sm: "flex" },
              gap: 2,
              zIndex: 1,
            }}
          >
            <IconButton
              aria-label="previous"
              onClick={goPrevious}
              color="secondary"
              size="small"
              sx={{
                backgroundColor: "rgba(0,0,0,1)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.8)",
                },
              }}
            >
              <KeyboardArrowLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="next"
              color="secondary"
              size="small"
              sx={{
                backgroundColor: "rgba(0,0,0,1)",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.8)",
                },
              }}
            >
              <KeyboardArrowRightIcon fontSize="small" onClick={goNext} />
            </IconButton>
          </Box>
        </Box>
      </SwipDetector>
    )
  );
};
