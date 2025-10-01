import styles from './GridLayout.module.scss';

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
          <div className={styles.nameLabel}>{block.title}</div>
        </div>
      ))}
    </div>
  );
}