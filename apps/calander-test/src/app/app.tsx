import { useEffect, useState } from 'react';
import styles from './app.module.scss';
import { buildCalander, DATSTUFF, mapDate } from './calander-helpers';

export const App: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [calander, setClander] = useState(
    buildCalander(selectedYear, selectedMonth, mapDate)
  );

  useEffect(() => {
    setClander(buildCalander(selectedYear, 11, mapDate));
  }, [selectedYear]);

  const getClass = (currMonth: number, val: DATSTUFF) =>
    `${styles.app} ${currMonth === val.month ? '' : styles.fade}`;

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
          {Object.keys(calander).map(k => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>
      </div>
      {Object.entries(calander)
        .filter(([key]) => +key === selectedMonth)
        .map(([key, d]) => (
          <div className={styles.app} key={key}>
            {d.map((f, j) => (
              <div key={j} className={getClass(+key, f)}>
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
      {/* <pre>{JSON.stringify(days, undefined, 2)}</pre> */}
    </div>
  );
};

export default App;
