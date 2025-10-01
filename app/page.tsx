import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            <img src="/social.png" alt="WhatsUp logo" className={styles.icon} />
            WhatsUp
          </h1>
        </header>

      <a href="/channel">
        <button className="button">
          Join Call
        </button>
      </a>
        <section className={styles.guide}>
          <h2>Add WhatsUp to your homescreen</h2>
          <ol>
            <li>Tap the <b>⋮</b> menu (top right).</li>
            <li>Choose <b>"Add to Home screen"</b>.</li>
            <li>Confirm and drag the icon wherever you want.</li>
          </ol>
        </section>

        <footer className={styles.footer}>
          <small>Built with Next.js · Static exportable</small>
        </footer>
    </main>
  );
}
