import styles from './GridLayout.module.css';

interface GridLayoutProps {
  blocks: {
    title: string;
  }[];
}

export default function GridLayout({ blocks }: GridLayoutProps) {
  return (
    <div className={styles.gridContainer} data-count={blocks.length}>
      {blocks.map((block, index) => (
        <div key={index} className={styles.gridItem}>
          <h2>{block.title}</h2>
        </div>
      ))}
    </div>
  );
}