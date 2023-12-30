export const filterIndependent = (el: { independent: boolean }) =>
  el.independent;

export const filterDistinct = (value: any, index: any, self: any) =>
  self.indexOf(value) === index;
