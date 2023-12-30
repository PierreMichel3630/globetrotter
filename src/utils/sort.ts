import moment from "moment";

export const sortByLabel = (a: any, b: any) => a.label.localeCompare(b.label);
export const sortByName = (a: any, b: any) =>
  a.name.fra.localeCompare(b.name.fra);

export const sortByStartDate = (a: any, b: any) =>
  moment(b.startdate).diff(a.startdate);

export const sortByStartDateDesc = (a: any, b: any) =>
  moment(a.startdate).diff(b.startdate);

export const sortByNumber = (a: { number: number }, b: { number: number }) =>
  b.number - a.number;
