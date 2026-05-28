import type { Task, UpdateTaskPayload } from '../../types';
import { TaskCard } from '../TaskCard/TaskCard';
import styles from './TaskList.module.css';

interface Props {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onEdit: (id: number, payload: UpdateTaskPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onComplete: (task: Task) => Promise<void>;
}

export function TaskList({ tasks, loading, error, onEdit, onDelete, onComplete }: Props) {
  if (loading) {
    return (
      <div className={styles.centered}>
        <span className={styles.spinner} aria-label="Carregando" />
        <p>Carregando tarefas…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorBox} role="alert">
        <strong>Erro:</strong> {error}
      </div>
    );
  }

  if (tasks.length === 0) {
    return <p className={styles.empty}>Nenhuma tarefa encontrada.</p>;
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onComplete={onComplete}
          />
        </li>
      ))}
    </ul>
  );
}
