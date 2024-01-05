import { Box, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";

export interface LineCompareTable {
  value: number;
  color: string;
  unity?: string;
  fixed?: number;
}

export interface PropsLineCompare {
  values: Array<LineCompareTable>;
  label: string | JSX.Element;
  isPercent: boolean;
}

export const LineCompareTable = ({
  values,
  label,
  isPercent,
}: PropsLineCompare) => {
  const value1 = values[0];
  const value2 = values[1];
  const max = isPercent ? 100 : Math.max(value1.value, value2.value);
  return (
    <Grid container>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        {typeof label === "string" ? (
          <Typography variant="h6">{label}</Typography>
        ) : (
          label
        )}
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              color={value1.color}
              noWrap
              sx={{ minWidth: px(35), textAlign: "end" }}
            >
              {value1.value}
              {value1.unity}
            </Typography>
            <BarProgress
              value={value1.value}
              color={value1.color}
              orientation="right"
              max={max}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: 1,
              alignItems: "center",
            }}
          >
            <BarProgress value={value2.value} color={value2.color} max={max} />
            <Typography
              variant="h6"
              color={value2.color}
              noWrap
              sx={{ minWidth: px(35) }}
            >
              {value2.value}
              {value2.unity}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

interface PropsBarProgress {
  value: number;
  color: string;
  orientation?: "left" | "right";
  max: number;
}

const BarProgress = ({
  value,
  color,
  orientation = "left",
  max,
}: PropsBarProgress) => {
  const percentValue = max === 0 ? 0 : (value * 100) / max;
  return (
    <Box
      sx={{
        width: percent(100),
        height: px(8),
        backgroundColor: Colors.lightgrey2,
        borderRadius: px(5),
        position: "relative",
      }}
    >
      <Box
        sx={
          orientation === "left"
            ? {
                width: percent(percentValue),
                height: px(8),
                backgroundColor: color,
                borderRadius: px(5),
              }
            : {
                width: percent(percentValue),
                height: px(8),
                backgroundColor: color,
                borderRadius: px(5),
                position: "absolute",
                right: 0,
              }
        }
      />
    </Box>
  );
};
