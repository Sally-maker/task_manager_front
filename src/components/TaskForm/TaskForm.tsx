import { useState } from 'react';
import type { CreateTaskPayload } from '../../types';
import styles from './TaskForm.module.css';

interface Props {
  onSubmit: (payload: CreateTaskPayload) => Promise<unknown>;
}

export function TaskForm({ onSubmit }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (title.trim().length < 3) {
      setError('O título deve ter no mínimo 3 caracteres.');
      return;
    }
    if (title.trim().length > 200) {
      setError('O título deve ter no máximo 200 caracteres.');
      return;
    }
    if (description.length > 2000) {
      setError('A descrição deve ter no máximo 2000 caracteres.');
      return;
    }

    setLoading(true);
    try {
      const payload: CreateTaskPayload = {
        title: title.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
      };
      await onSubmit(payload);
      setTitle('');
      setDescription('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar tarefa.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>Nova tarefa</h2>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.field}>
        <label htmlFor="new-title" className={styles.label}>
          Título <span aria-hidden>*</span>
        </label>
        <input
          id="new-title"
          className={styles.input}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          required
          disabled={loading}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="new-description" className={styles.label}>
          Descrição
        </label>
        <textarea
          id="new-description"
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={2000}
          rows={3}
          disabled={loading}
        />
      </div>
      <button className={styles.button} type="submit" disabled={loading}>
        {loading ? 'Criando…' : 'Criar tarefa'}
      </button>
    </form>
  );
}
