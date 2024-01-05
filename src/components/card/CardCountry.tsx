import { Avatar, Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import {
  Country,
  CountryAdjacent,
  CountryVisited,
} from "src/models/country/Country";
import { Colors } from "src/style/Colors";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import ImageNotSupportedIcon from "@mui/icons-material/ImageNotSupported";
import { Link } from "react-router-dom";
import { ImageRectangularBlock } from "../ImageBlock";
import { JsonLanguageBlock } from "../typography/JsonLanguageBlock";

interface PropsVisited {
  country: CountryVisited;
}

export const CardCountryVisited = ({ country }: PropsVisited) => {
  const { t } = useTranslation();
  return (
    <Paper
      sx={{
        p: 1,
        height: percent(100),
        display: "flex",
        alignItems: "flex-end",
        cursor: "pointer",
      }}
      component={Link}
      to={`?country=${country.id}`}
    >
      <Grid container spacing={1}>
        <Grid item sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar
            alt="flag"
            src={country.flag}
            sx={{ width: px(50), height: px(50) }}
          />
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <JsonLanguageBlock variant="h2" value={country.name} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" noWrap component="span">
                {t("commun.travels")} :{" "}
              </Typography>
              <Typography variant="body1" component="span">
                {country.travels.map((el) => el.name).join(", ")}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface PropsAdj {
  country: CountryAdjacent;
}

export const CardCountryAdjacent = ({ country }: PropsAdj) => {
  const { countriesVisited } = useApp();
  const isVisited = countriesVisited.map((el) => el.id).includes(country.id);
  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: Colors.lightgrey,
        height: percent(100),
        display: "flex",
        alignItems: "flex-end",
        position: "relative",
        border: `2px solid ${isVisited ? Colors.green : Colors.red}`,
      }}
    >
      <Box sx={{ position: "absolute", top: 0, right: 0 }}>
        {isVisited ? (
          <CheckCircleTwoToneIcon
            sx={{ color: Colors.green }}
            fontSize="large"
          />
        ) : (
          <HighlightOffTwoToneIcon
            sx={{ color: Colors.red }}
            fontSize="large"
          />
        )}
      </Box>
      <Grid container spacing={1} justifyContent="center">
        <Grid item>
          <img
            src={country.flag}
            style={{
              maxWidth: percent(100),
              maxHeight: px(60),
            }}
          />
        </Grid>
        <Grid item xs={12} sx={{ textAlign: "center" }}>
          <JsonLanguageBlock variant="h4" value={country.name} />
        </Grid>
      </Grid>
    </Paper>
  );
};

interface Props {
  country: Country;
}

export const CardCountry = ({ country }: Props) => {
  const image = country.images.length > 0 ? country.images[0] : undefined;
  return (
    <Link to={`/country/${country.id}`}>
      <Paper
        sx={{
          height: percent(100),
          display: "flex",
          alignItems: "flex-end",
          cursor: "pointer",
          position: "relative",
          borderRadius: px(5),
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", left: 5, top: 5 }}>
          <img
            src={country.flag}
            style={{
              width: px(40),
            }}
            loading="lazy"
          />
        </Box>
        <Grid container>
          <Grid item xs={12}>
            {image ? (
              <ImageRectangularBlock
                src={`https://otgkjrkkwbjtozbvcbuo.supabase.co/storage/v1/object/public/country/${image}`}
                height={200}
              />
            ) : (
              <Box
                sx={{
                  minHeight: px(200),
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.grey,
                }}
              >
                <ImageNotSupportedIcon
                  sx={{ fill: Colors.white, width: px(50), height: px(50) }}
                />
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ p: 1 }}>
              <JsonLanguageBlock variant="h2" value={country.name} />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Link>
  );
};
