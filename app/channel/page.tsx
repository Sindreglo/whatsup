import styles from './page.module.css';

import GridLayout from '../../components/GridLayout';

import { BsFillTelephoneFill } from 'react-icons/bs';

export default function Channel() {
  const blocks = [
    { title: 'User 1', content: 'Content for User 1' },
    { title: 'User 2', content: 'Content for User 2' },
    { title: 'User 3', content: 'Content for User 3' },
    { title: 'User 4', content: 'Content for User 4' },
  ];

  return (
    <main className={styles.container}>
      <GridLayout blocks={blocks} />
      <a href="/">
        <button className="iconButton backgroundColorRed" aria-label="Back to Home">
          <BsFillTelephoneFill className="icon" />
        </button>
      </a>
    </main>
  );
}