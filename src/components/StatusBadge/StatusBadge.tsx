import type { TaskStatus } from '../../types';
import styles from './StatusBadge.module.css';

const labels: Record<TaskStatus, string> = {
  pending: 'Pendente',
  in_progress: 'Em andamento',
  done: 'Concluída',
};

interface Props {
  status: TaskStatus;
}

export function StatusBadge({ status }: Props) {
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}
