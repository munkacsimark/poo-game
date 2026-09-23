import type { RarityStat } from "../collection";
import styles from "./CollectionStats.module.css";

type Props = {
  clicks: number;
  stats: RarityStat[];
};

export const CollectionStats = ({ clicks, stats }: Props) => (
  <dl className={styles.info}>
    <div>
      <dt>Clicks:</dt> <dd>{clicks}</dd>
    </div>
    <hr />
    {stats.map(({ id, label, collected }) => (
      <div key={id}>
        <dt className={styles[id]}>{label}:</dt> <dd>{collected}</dd>
      </div>
    ))}
  </dl>
);
