export type DateFormatted = {
  date?: Date;
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

export type CalendarObj = Record<number, DateFormatted[]>;

const updateMonthDays = (
  month: DateFormatted[],
  year: number,
  fn: MapFn
): DateFormatted[] => {
  const daysAtStart = month[0].dayOfWeek;
  const daysAtEnd = month[month.length - 1].dayOfWeek;
  const startMonth = month[0].month - 1;
  const endMonth = month[month.length - 1].month;

  const diffStart =
    daysAtStart === 0 ? 6 : daysAtStart === 1 ? 0 : daysAtStart - 1;

  const diffEnd = daysAtEnd === 0 ? 0 : 7 - daysAtEnd;

  const startDays = [...new Array(diffStart).keys()].map(i =>
    daysAtStart === 0 ? i - 5 : i - daysAtStart + 2
  );
  const endDays = [...new Array(diffEnd).keys()].map(i => i + 1);

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

export const buildCalendar = (year = 2021, month = 11, fn: MapFn) => {
  const theDate = new Date(year, month, 31);

  const daysInYear = daysIntoYear(theDate);

  const calendar = [...new Array(daysInYear).keys()]
    .map(i => i + 1)
    .map(dayOfYear => new Date(theDate.getFullYear(), 0, dayOfYear))
    .map(fn)
    .reduce(
      (prev, date) => ({
        ...prev,
        [date.month]: [...(prev[date.month] || []), date]
      }),
      {} as CalendarObj
    );

  Object.entries(calendar).forEach(
    ([month, monthArr]) =>
      (calendar[+month] = updateMonthDays(monthArr, theDate.getFullYear(), fn))
  );

  return calendar;
};

type stuff2 = {
  hour: number;
  minutes: number;
};

export const sdfsd = (year = 2021, month = 10, day = 12) => {
  const sdfsd = [...new Array(48).keys()]
    .reduce(
      (prev, curr) => [
        ...prev,
        {
          hour: Math.floor((30 * curr) / 60),
          minutes: curr % 2 === 0 ? 0 : 30
        }
      ],
      [] as stuff2[]
    )
    .map(d => new Date(year, month - 1, day, d.hour, d.minutes));

  return {
    morning: sdfsd.slice(16, 24),
    afternoon: sdfsd.slice(24, 34),
    evening: sdfsd.slice(34, 44)
  };
};

function getStage(dat: stuff2) {
  console.log(dat.hour % 8);

  return 'dsfsd';
}
