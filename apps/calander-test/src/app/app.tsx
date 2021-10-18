import { useEffect, useState } from 'react';
import styles from './app.module.scss';
import {
  buildCalendar,
  CalendarObj,
  DateFormatted,
  MapFn,
  sdfsd
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
  const [selectedkey, setSelectedKey] = useState<string>('evening');
  const [calendar, setCalendar] = useState<CalendarObj>({});

  useEffect(() => {
    if (selectedYear) {
      sdfsd();
      setCalendar(buildCalendar(selectedYear, 11, mapDate));
    }
  }, [selectedYear]);

  const getClass = (currMonth: number, date: DateFormatted) =>
    `${styles.app} ${currMonth === date.month ? '' : styles.fade}`;

  const renderBody = () => (
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
  );

  const renderCal = () =>
    Object.entries(calendar)
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
      ));

  const sdfsdf = sdfsd(selectedYear, selectedMonth, 12);
  return (
    <div>
      {renderBody()}
      {renderCal()}

      <div className={styles.times}>
        <div className={styles.timesNav}>
          {Object.entries(sdfsdf).map(([key, val]) => (
            <div
              key={key}
              className={key === selectedkey ? styles.high : ''}
              onClick={() => setSelectedKey(key)}
            >
              {key}
            </div>
          ))}
        </div>
        <div className={styles.timesList}>
          {Object.entries(sdfsdf).map(([key, val]) =>
            val
              .filter(() => key === selectedkey)
              .map(v => <div key={v.toString()}>{v.toTimeString()}</div>)
          )}
        </div>
      </div>
      {/* <pre>{JSON.stringify(calendar, undefined, 2)}</pre> */}
      {/* <pre>{JSON.stringify(sdfsd(), undefined, 2)}</pre> */}
    </div>
  );
};

export default App;
