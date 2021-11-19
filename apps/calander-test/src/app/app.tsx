import * as dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { default as React, useEffect, useState } from 'react';
//import { ReactComponent as IconBefore } from '../assets/bootstrap-icons/check-circle.svg';
// import logo from 'assets/txp-theme/img/techspert-logo-wo.svg';
// import styles from './app.module.scss';
import {
  buildCalendar,
  CalendarObj,
  DateFormatted,
  MapFn,
  sdfsd
} from './calendar-helpers';

const Header = () => <img src="{logo}" alt="Logo" />;

export { Header };

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
    `app ${currMonth === date.month ? '' : 'fade'} ` +
    `${date.dateString === selectedDate?.toDateString() ? 'selected' : ''} ` +
    `${
      date.date &&
      selectedDays.some(s => dayjs.default(s).isSame(date.date, 'day'))
        ? 'selectedDay'
        : ''
    }`;

  const renderBody = () => (
    <>
      <div className="col-sm-6">
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(+e.currentTarget.value)}
        >
          {Object.keys(calendar).map(k => (
            <option key={k} value={k}>
              {dayjs
                .default(t?.date)
                .month(+k - 1)
                .format('MMMM')}
            </option>
          ))}
        </select>
      </div>
      <div className="col-sm-6">
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
      </div>
    </>
  );

  const renderCal = () =>
    Object.entries(calendar)
      .filter(([key]) => +key === selectedMonth)
      .map(([key, d]) => (
        <div className="row">
          <div className="container">
            <div className="app" key={key}>
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
            </div>
          </div>
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
    <div className="calendarApp">
      <div className="calHeader">
        <div className="row dateSectors">{renderBody()}</div>
      </div>
      {renderCal()}

      <a
        className="btn btn-primary"
        data-bs-toggle="offcanvas"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        href="#offcanvasCalendar"
        role="button"
        aria-controls="offcanvasCalendar"
      >
        Open modal on date click
      </a>
      <div
        className="offcanvas offcanvas-end"
        data-bs-scroll="true"
        id="offcanvasCalendar"
      >
        <div className="offcanvas-header text-center">
          <h5
            className="offcanvas-title text-center"
            id="offcanvasCalendarLabel"
          >
            Choose your availabilities
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body pt-0">
          {selectedDate && (
            <div className="times">
              <div className="timesNav">
                {Object.keys(timesToSelect).map(key => (
                  <div
                    key={key}
                    className={key === selectedkey ? 'activePeriod' : ''}
                    onClick={() => setSelectedKey(key)}
                  >
                    {key}
                  </div>
                ))}
              </div>
              <h4>{selectedDate.toDateString()}</h4>
              <div className="calInstructions">
                Select your available timeslots to start the [minute] conference
              </div>
              <div className="container p-0">
                <div className="timesList">
                  {Object.entries(timesToSelect).map(([key, val]) =>
                    val
                      .filter(() => key === selectedkey)
                      .map(v => (
                        <div
                          key={v.toString()}
                          className={
                            selectedDays.includes(v.toISOString())
                              ? 'selectedTime'
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
                          {dayjs.default(v).format('LT')}
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedDays.map(s => (
            <div className="container">
              <div className="timesListed row">
                <div className="col-1">
                  <i className="bi bi-check-circle text-success"></i>
                </div>{' '}
                <div className="col flex-grow-1">
                  {dayjs.default(s).format('LLL')}
                </div>
                <div className="col-1">
                  <i className="bi bi-cloud-download primary"></i>
                </div>
                <div className="col-1">
                  <i className="bi bi-x-circle link-danger"></i>
                </div>
              </div>
            </div>
          ))}
          <div className="emptyCalState alert alert-dark d-none">
            Please select a date on the calendar to choose your available
            timeslots
          </div>
          <div className="d-grid gap-2 mt-3">
            <button className="btn btn-primary">Submit availabilities</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
