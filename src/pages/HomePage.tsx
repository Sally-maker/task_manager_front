import { useState } from 'react';
import type { TaskStatus } from '../types';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from '../components/TaskForm/TaskForm';
import { TaskList } from '../components/TaskList/TaskList';
import { StatusFilter } from '../components/StatusFilter/StatusFilter';
import styles from './HomePage.module.css';

export function HomePage() {
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const { tasks, loading, error, addTask, editTask, removeTask, completeTask } = useTasks(
    filter === 'all' ? undefined : filter
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.appTitle}>Task Manager</h1>
      </header>
      <main className={styles.main}>
        <section className={styles.formSection} aria-label="Criar nova tarefa">
          <TaskForm onSubmit={addTask} />
        </section>
        <section className={styles.listSection} aria-label="Lista de tarefas">
          <div className={styles.listHeader}>
            <h2 className={styles.listTitle}>Tarefas</h2>
            <StatusFilter current={filter} onChange={setFilter} />
          </div>
          <TaskList
            tasks={tasks}
            loading={loading}
            error={error}
            onEdit={editTask}
            onDelete={removeTask}
            onComplete={completeTask}
          />
        </section>
      </main>
    </div>
  );
}
