export type DateFormatted = {
  dayOfWeek: number;
  day?: number;
  month: number;
  year?: number;
  offset?: number;
  dateString?: string;
  toUTCString?: string;
  toISOString?: string;
  toString: string;
};

export type MapFn = (date: Date) => DateFormatted;

export const mapDate: MapFn = date => ({
  dayOfWeek: date.getDay(),
  // day: date.getDate(),
  month: date.getMonth() + 1,
  // year: date.getFullYear(),
  // offset: date.getTimezoneOffset(),
  dateString: date.toDateString(),
  // toUTCString: date.toUTCString(),
  // toISOString: date.toISOString(),
  toString: date.toString()
});

const updateMonthDays = (
  month: DateFormatted[],
  year: number,
  fn: MapFn
): DateFormatted[] => {
  const daysAtStart = month[0].dayOfWeek - 1;
  const daysAtEnd = month[month.length - 1].dayOfWeek;
  const startMonth = month[0].month - 1;
  const endMonth = month[month.length - 1].month;

  const diff1 = daysAtStart > 0 ? daysAtStart : 7 + daysAtStart;
  const diff = daysAtEnd > 0 ? 7 - daysAtEnd : 0;

  const startDays = [...new Array(diff1).keys()].map(i =>
    daysAtStart > 0 ? i + 1 - daysAtStart : -7 - daysAtStart + i + 1
  );
  const endDays = [...new Array(diff).keys()].map(i => i + 1);

  // console.log(month, { daysAtStart, daysAtEnd, startDays, endDays, diff1 });
  return [
    ...startDays.map(offset => new Date(year, startMonth, offset)).map(fn),
    ...month,
    ...endDays.map(offSet => new Date(year, endMonth, offSet)).map(fn)
  ];
};

const daysIntoYear = (date: Date) =>
  (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
    Date.UTC(date.getFullYear(), 0, 0)) /
  24 /
  60 /
  60 /
  1000;

export const buildCalander = (year = 2021, month = 11, fn: MapFn) => {
  const theDate = new Date(year, month, 31);

  const daysInYear = daysIntoYear(theDate);

  const calander = [...new Array(daysInYear).keys()]
    .map(i => i + 1)
    .map(dayOfYear => new Date(theDate.getFullYear(), 0, dayOfYear))
    .map(fn)
    .reduce(
      (prev, date) => ({
        ...prev,
        [date.month]: [...(prev[date.month] || []), date]
      }),
      {} as Record<number, DateFormatted[]>
    );

  Object.entries(calander).forEach(
    ([month, monthArr]) =>
      (calander[+month] = updateMonthDays(monthArr, theDate.getFullYear(), fn))
  );

  return calander;
};
