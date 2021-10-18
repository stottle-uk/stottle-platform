import { useState } from 'react';
import styles from './app.module.scss';
import { buildCalander, DATSTUFF, mapDate } from './calander-helpers';

const calander = buildCalander(2012, 11, mapDate);

export function App() {
  // const days = 0;
  const [selected, setSelected] = useState(new Date().getMonth() + 1);
  // const [selected, setSelected] = useState('1');

  const getClass = (currMonth: number, val: DATSTUFF) =>
    `${styles.app} ${currMonth === val.month ? '' : styles.fade}`;

  return (
    <div>
      <select
        value={selected}
        onChange={e => setSelected(+e.currentTarget.value)}
      >
        {Object.keys(calander).map(k => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      {Object.entries(calander)
        .filter(([key]) => +key === selected)
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
}

export default App;
