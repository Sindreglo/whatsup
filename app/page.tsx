import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.container}>
      <h1>Success!!!</h1>
      <p>ugh.</p>
      <a href="/channel">
        <button className="button">
          Go to Channel
        </button>
      </a>
    </main>
  );
}
