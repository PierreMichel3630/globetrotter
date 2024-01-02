import {
  Avatar,
  Box,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { important, px } from "csx";
import { Link } from "react-router-dom";

import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { Colors } from "src/style/Colors";
import { style } from "typestyle";

interface Props {
  icon: string;
  value: string | number;
  title: string;
  titleSize?: number;
}

export const CardRecap = ({ title, value, icon, titleSize = 24 }: Props) => {
  return (
    <Paper
      sx={{
        p: 1,
        pl: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <img src={icon} width={50} height={50} />
        <Box>
          <Typography variant="h2" sx={{ fontSize: important(px(titleSize)) }}>
            {value}
          </Typography>
          <Typography variant="body1" sx={{ fontSize: important(px(16)) }}>
            {title}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const imgCss = style({
  width: px(30),
});

interface PropsArray {
  title?: string;
  isPosition?: boolean;
  values: Array<{
    icon?: string;
    label: string;
    value: string | number;
    to?: string;
  }>;
}

export const CardRecapArray = ({
  title,
  values,
  isPosition = true,
}: PropsArray) => {
  const getIcon = (index: number) => {
    let icon = (
      <Avatar sx={{ bgcolor: Colors.grey }}>
        <Typography variant="h2" sx={{ ml: px(3), mr: px(3) }}>
          {index + 1}
        </Typography>
      </Avatar>
    );
    switch (index + 1) {
      case 1:
        icon = (
          <Avatar sx={{ bgcolor: "white" }}>
            <img src={rank1} className={imgCss} />
          </Avatar>
        );
        break;
      case 2:
        icon = (
          <Avatar sx={{ bgcolor: "white" }}>
            <img src={rank2} className={imgCss} />
          </Avatar>
        );
        break;
      case 3:
        icon = (
          <Avatar sx={{ bgcolor: "white" }}>
            <img src={rank3} className={imgCss} />
          </Avatar>
        );
        break;
    }
    return icon;
  };

  return (
    <Paper
      sx={{
        p: 1,
      }}
    >
      <Grid container spacing={1}>
        {title && (
          <Grid item xs={12}>
            <Typography variant="h2">{title}</Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <List dense>
            {values.map((el, index) => (
              <ListItem key={index} disablePadding component={Link} to={el.to}>
                {isPosition && <ListItemIcon>{getIcon(index)}</ListItemIcon>}
                {el.icon && (
                  <ListItemIcon>
                    <Avatar alt="flag" src={el.icon} />
                  </ListItemIcon>
                )}
                <ListItemText primary={el.label} secondary={el.value} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
};
