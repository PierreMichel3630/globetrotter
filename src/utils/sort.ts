import moment from "moment";
import { Travel } from "src/models/Travel";

export const sortByLabel = (a: any, b: any) => a.label.localeCompare(b.label);
export const sortByName = (a: any, b: any) =>
  a.name.fra.localeCompare(b.name.fra);

export const sortByStartDate = (a: any, b: any) =>
  moment(b.startdate).diff(moment(a.startdate));

export const sortByStartDateDesc = (a: any, b: any) =>
  moment(a.startdate).diff(b.startdate);

export const sortByNumber = (a: { number: number }, b: { number: number }) =>
  b.number - a.number;

export const sortTravelByDate = (a: Travel, b: Travel) => {
  const momentStartA = moment.min(
    a.countries.map((el) => moment(el.startdate))
  );
  const momentStartB = moment.min(
    b.countries.map((el) => moment(el.startdate))
  );
  return momentStartB.diff(momentStartA);
};
