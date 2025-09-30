'use client';

import styles from './page.module.css';
import GridLayout from '../../components/GridLayout';
import { BsFillTelephoneFill } from 'react-icons/bs';
import { useState } from 'react';

export default function Channel() {
  const [blockCount, setBlockCount] = useState(4);
  
  const blocks = Array.from({ length: blockCount }, (_, index) => ({
    title: `User ${index + 1}`,
    content: `Content for User ${index + 1}`,
  }));

  return (
    <main className={styles.container}>
      <div className={styles.dropdown}>
        <select 
          value={blockCount}
          onChange={(e) => setBlockCount(Number(e.target.value))}
          className={styles.select}
        >
          {Array.from({ length: 7 }, (_, i) => (
            <option key={i} value={i}>
              {i} Blocks
            </option>
          ))}
        </select>
      </div>
      <GridLayout blocks={blocks} />
      <a href="/">
        <button className="iconButton backgroundColorRed" aria-label="Back to Home">
          <BsFillTelephoneFill className="icon" />
        </button>
      </a>
    </main>
  );
}