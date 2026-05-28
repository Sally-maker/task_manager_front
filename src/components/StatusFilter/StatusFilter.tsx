import type { TaskStatus } from '../../types';
import styles from './StatusFilter.module.css';

const FILTERS: { value: TaskStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'done', label: 'Concluídas' },
];

interface Props {
  current: TaskStatus | 'all';
  onChange: (value: TaskStatus | 'all') => void;
}

export function StatusFilter({ current, onChange }: Props) {
  return (
    <div className={styles.container} role="group" aria-label="Filtrar por status">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          className={`${styles.btn} ${current === f.value ? styles.active : ''}`}
          onClick={() => onChange(f.value)}
          type="button"
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
