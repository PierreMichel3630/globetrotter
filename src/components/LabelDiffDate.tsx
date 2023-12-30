import { Typography } from "@mui/material";
import moment, { Moment } from "moment";
import { useTranslation } from "react-i18next";
interface Props {
  startdate: Moment;
  enddate: Moment;
}
export const LabelDiffDate = ({ startdate, enddate }: Props) => {
  const { t } = useTranslation();
  const diffDate = enddate.add(1, "day").diff(startdate);
  const duration = moment.duration(diffDate);
  const years = duration.years();
  const month = duration.months();
  const day = duration.days();
  return (
    <Typography variant="body2" component="span">
      ({" "}
      {`${years > 0 ? t("commun.year", { count: years }) : ""} ${
        month > 0
          ? t("commun.month", {
              count: month,
            })
          : ""
      } ${day > 0 ? t("commun.day", { count: day }) : ""}`}{" "}
      )
    </Typography>
  );
};

interface PropsArray {
  values: Array<{
    startdate: Date | null;
    enddate: Date | null;
  }>;
}
export const LabelDiffArrayDate = ({ values }: PropsArray) => {
  const { t } = useTranslation();

  const time = values.reduce((acc, value) => {
    if (value.startdate && value.enddate) {
      const momentStart = moment(value.startdate);
      const momentEnd = moment(value.enddate);
      const diffDate = momentEnd.add(1, "day").diff(momentStart);
      return acc + diffDate;
    }
    return acc;
  }, 0);
  const duration = moment.duration(time);
  const years = duration.years();
  const month = duration.months();
  const day = duration.days();
  return (
    <Typography variant="body2" component="span">
      ({" "}
      {`${years > 0 ? t("commun.year", { count: years }) : ""} ${
        month > 0
          ? t("commun.month", {
              count: month,
            })
          : ""
      } ${day > 0 ? t("commun.day", { count: day }) : ""}`}{" "}
      )
    </Typography>
  );
};

export const GetLabelDiffDate = (startdate: Moment, enddate: Moment) => {
  const { t } = useTranslation();
  const diffDate = enddate.add(1, "day").diff(startdate);
  const duration = moment.duration(diffDate);
  const years = duration.years();
  const month = duration.months();
  const day = duration.days();
  return `(${years > 0 ? t("commun.year", { count: years }) : ""} ${
    month > 0
      ? t("commun.month", {
          count: month,
        })
      : ""
  } ${day > 0 ? t("commun.day", { count: day }) : ""})`;
};
