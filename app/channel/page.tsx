import styles from './page.module.css';

export default function Channel() {
  return (
    <main className={styles.container}>
      <h1>Channel Page</h1>
      <p>Welcome to the channel!</p>
      <a href="/">
        <button className="button">
          Back to Home
        </button>
      </a>
    </main>
  );
}