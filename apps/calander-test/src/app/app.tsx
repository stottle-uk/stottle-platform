import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { useEffect, useState } from 'react';
import styles from './app.module.scss';
import {
  buildCalendar,
  CalendarObj,
  DateFormatted,
  MapFn,
  sdfsd
} from './calendar-helpers';

dayjs.extend(localizedFormat);
export const mapDate: MapFn = date => ({
  date,
  dayOfWeek: date.getDay(),
  // day: date.getDate(),
  month: date.getMonth() + 1,
  // year: date.getFullYear(),
  // offset: date.getTimezoneOffset(),
  dateString: date.toDateString(),
  // toUTCString: date.toUTCString(),
  toISOString: date.toISOString(),
  toString: date.toString()
});

const date = new Date();

export const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(date.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(date.getMonth() + 1);
  const [selectedkey, setSelectedKey] = useState<string>('evening');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [calendar, setCalendar] = useState<CalendarObj>({});

  useEffect(() => {
    if (selectedYear) {
      setCalendar(buildCalendar(selectedYear, 11, mapDate));
    }
  }, [selectedYear]);

  const getClass = (currMonth: number, date: DateFormatted) =>
    `${styles.app} ${currMonth === date.month ? '' : styles.fade} ` +
    `${
      date.dateString === selectedDate?.toDateString() ? styles.selected : ''
    } ` +
    `${
      date.date &&
      selectedDays.some(s => dayjs.default(s).isSame(date.date, 'day'))
        ? styles.selectedDay
        : ''
    }`;

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
            <div
              key={f.toString}
              className={getClass(+key, f)}
              onClick={() => setSelectedDate(f.date)}
            >
              {/* {f.dateString} */}
              {dayjs.default(f.date).format('DD')}
            </div>
          ))}
          <hr />
        </div>
      ));

  const timesToSelect = sdfsd(
    selectedDate?.getFullYear(),
    selectedDate?.getMonth(),
    selectedDate?.getDate()
  );

  const s = Object.entries(calendar).filter(([key]) => +key === selectedMonth);

  const t = s.length ? s[0][1][selectedMonth] : undefined;

  return (
    <div>
      <div className={styles.title}>
        {dayjs.default(t?.date).format('MMMM YYYY')}
        {renderBody()}
      </div>
      {renderCal()}

      {selectedDate && (
        <div className={styles.times}>
          <div className={styles.timesNav}>
            {Object.keys(timesToSelect).map(key => (
              <div
                key={key}
                className={key === selectedkey ? styles.high : ''}
                onClick={() => setSelectedKey(key)}
              >
                {key}
              </div>
            ))}
          </div>
          <b>{selectedDate.toDateString()}</b>
          <div>Select availble times to start the [minute] conference</div>
          <div className={styles.timesList}>
            {Object.entries(timesToSelect).map(([key, val]) =>
              val
                .filter(() => key === selectedkey)
                .map(v => (
                  <div
                    key={v.toString()}
                    className={
                      selectedDays.includes(v.toISOString())
                        ? styles.selectedTime
                        : ''
                    }
                    onClick={() =>
                      setSelectedDays(d =>
                        d.includes(v.toISOString())
                          ? d.filter(e => e !== v.toISOString())
                          : [...d, v.toISOString()]
                      )
                    }
                  >
                    {dayjs.default(v).format('LTS')}
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      <pre>{JSON.stringify(selectedDays, undefined, 2)}</pre>
      {/* <pre>{JSON.stringify(sdfsd(), undefined, 2)}</pre> */}
      <p>idea: handle ctrl to select multiple days</p>
    </div>
  );
};

export default App;
