import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  timelineItemClasses,
} from "@mui/lab";
import { Alert, Avatar, Box, Container, Grid, Typography } from "@mui/material";
import { groupBy } from "lodash";
import moment from "moment";
import { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  LabelDiffArrayDate,
  LabelDiffDate,
} from "src/components/LabelDiffDate";
import { Loading } from "src/components/Loading";
import { JsonLanguageBlock } from "src/components/typography/JsonLanguageBlock";
import { useApp } from "src/context/AppProvider";
import { CountryTravel } from "src/models/CountryTravel";
import { Colors } from "src/style/Colors";
import { sortByStartDate } from "src/utils/sort";

export const TimelinePage = () => {
  const { t } = useTranslation();
  const { countries, travels } = useApp();

  const countriesVisited: Array<CountryTravel> = travels
    .reduce((acc, el) => [...acc, ...el.countries], [] as Array<CountryTravel>)
    .sort(sortByStartDate);

  const countriesVisitedGroupBy = groupBy(countriesVisited, (el) =>
    el.startdate !== null ? moment(el.startdate).year() : null
  );

  return (
    <Container maxWidth="sm">
      <Grid container spacing={1}>
        <Helmet>
          <title>{`${t("pages.timeline.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          {travels ? (
            travels.length > 0 ? (
              <Timeline
                sx={{
                  [`& .${timelineItemClasses.root}:before`]: {
                    flex: 0,
                    padding: 0,
                  },
                }}
              >
                {Object.keys(countriesVisitedGroupBy)
                  .sort((a, b) => Number(b) - Number(a))
                  .map((year) => {
                    const countriesVisitedByYear =
                      countriesVisitedGroupBy[year];

                    return (
                      <Fragment key={year}>
                        <Box
                          sx={{
                            p: 1,
                            backgroundColor: Colors.lightgrey2,
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="h4">{year}</Typography>
                          <LabelDiffArrayDate values={countriesVisitedByYear} />
                        </Box>
                        {countriesVisitedByYear.map((el, index) => {
                          const travel = travels.find(
                            (t) => t.id === el.travel
                          );
                          const country = countries.find(
                            (c) => c.id === el.country
                          );
                          const momentStart = moment(el.startdate);
                          const momentEnd = moment(el.enddate);
                          const labelStartDate =
                            momentStart.format("DD MMMM YYYY");
                          const labelEndDate = momentEnd.format("DD MMMM YYYY");
                          return (
                            country &&
                            travel && (
                              <TimelineItem key={index}>
                                <TimelineSeparator>
                                  <TimelineConnector />
                                  <TimelineDot sx={{ p: 0, m: 0 }}>
                                    <Avatar
                                      component={Link}
                                      to={`/country/${country.id}`}
                                      alt="flag"
                                      src={country.flag}
                                      sx={{ width: 40, height: 40 }}
                                    />
                                  </TimelineDot>
                                  <TimelineConnector />
                                </TimelineSeparator>
                                <TimelineContent sx={{ py: "12px", px: 2 }}>
                                  <Link to={`/country/${country.id}`}>
                                    <JsonLanguageBlock
                                      variant="h4"
                                      value={country.name}
                                    />
                                    <Typography variant="body2">
                                      {travel.name}
                                    </Typography>
                                    <Typography variant="body1">
                                      {labelStartDate} - {labelEndDate}
                                    </Typography>
                                    {momentStart && momentEnd && (
                                      <LabelDiffDate
                                        startdate={momentStart}
                                        enddate={momentEnd}
                                      />
                                    )}
                                  </Link>
                                </TimelineContent>
                              </TimelineItem>
                            )
                          );
                        })}
                      </Fragment>
                    );
                  })}
              </Timeline>
            ) : (
              <Box sx={{ p: 2 }}>
                <Alert severity="warning">{t("commun.notravelinform")}</Alert>
              </Box>
            )
          ) : (
            <Loading />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
