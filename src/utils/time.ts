import moment from "moment";

export const getTime = (time: number) => {
  const duration = moment.duration(time);
  return {
    years: duration.years(),
    month: duration.months(),
    day: duration.days(),
  };
};
