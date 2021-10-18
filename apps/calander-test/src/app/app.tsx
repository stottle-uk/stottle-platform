import { useEffect, useState } from 'react';
import styles from './app.module.scss';
import {
  buildCalendar,
  CalendarObj,
  DateFormatted,
  MapFn
} from './calendar-helpers';

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

const date = new Date();

export const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(date.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1);
  const [calendar, setCalendar] = useState<CalendarObj>({});

  useEffect(() => {
    if (selectedYear) {
      setCalendar(buildCalendar(selectedYear, 11, mapDate));
    }
  }, [selectedYear]);

  const getClass = (currMonth: number, date: DateFormatted) =>
    `${styles.app} ${currMonth === date.month ? '' : styles.fade}`;

  return (
    <div>
      <div>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(+e.currentTarget.value)}
        >
          {[...new Array(25).keys()].map(k => (
            <option key={k} value={2000 + k}>
              {2000 + k}
            </option>
          ))}
        </select>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(+e.currentTarget.value)}
        >
          {Object.keys(calendar).map(k => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>
      {Object.entries(calendar)
        .filter(([key]) => +key === selectedMonth)
        .map(([key, d]) => (
          <div className={styles.app} key={key}>
            {d.map(f => (
              <div key={f.toString} className={getClass(+key, f)}>
                {f.dateString}
              </div>
            ))}
            <hr />
          </div>
        ))}

      <div>
        <input type="text" step="1800" />
        <input type="text" step="1800" />
      </div>
      {/* <pre>{JSON.stringify(calendar, undefined, 2)}</pre> */}
    </div>
  );
};

export default App;
