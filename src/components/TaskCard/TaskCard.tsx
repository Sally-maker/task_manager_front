import { useState } from 'react';
import type { Task, UpdateTaskPayload, TaskStatus } from '../../types';
import { StatusBadge } from '../StatusBadge/StatusBadge';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';
import styles from './TaskCard.module.css';

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'done', label: 'Concluída' },
];

interface Props {
  task: Task;
  onEdit: (id: number, payload: UpdateTaskPayload) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onComplete: (task: Task) => Promise<void>;
}

export function TaskCard({ task, onEdit, onDelete, onComplete }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isDone = task.status === 'done';

  function handleEditClick() {
    setTitle(task.title);
    setDescription(task.description ?? '');
    setStatus(task.status);
    setError(null);
    setEditing(true);
  }

  function handleCancel() {
    setEditing(false);
    setError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (title.trim().length < 3) {
      setError('O título deve ter no mínimo 3 caracteres.');
      return;
    }
    setSaving(true);
    try {
      const payload: UpdateTaskPayload = {
        title: title.trim(),
        ...(description.trim() ? { description: description.trim() } : {}),
        status,
      };
      await onEdit(task.id, payload);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar tarefa.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await onDelete(task.id);
    } catch (err) {
      setDeleting(false);
      setConfirmDelete(false);
      alert(err instanceof Error ? err.message : 'Erro ao excluir tarefa.');
    }
  }

  async function handleComplete() {
    setCompleting(true);
    try {
      await onComplete(task);
    } catch (err) {
      setCompleting(false);
      alert(err instanceof Error ? err.message : 'Erro ao concluir tarefa.');
    }
  }

  if (editing) {
    return (
      <article className={styles.card}>
        <form className={styles.editForm} onSubmit={handleSave} noValidate>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.field}>
            <label htmlFor={`title-${task.id}`} className={styles.label}>
              Título <span aria-hidden>*</span>
            </label>
            <input
              id={`title-${task.id}`}
              className={styles.input}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              required
              disabled={saving}
              autoFocus
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`desc-${task.id}`} className={styles.label}>
              Descrição
            </label>
            <textarea
              id={`desc-${task.id}`}
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={3}
              disabled={saving}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={`status-${task.id}`} className={styles.label}>
              Status
            </label>
            <select
              id={`status-${task.id}`}
              className={styles.select}
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              disabled={saving}
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.actions}>
            <button className={styles.btnSave} type="submit" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
            <button
              className={styles.btnCancel}
              type="button"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancelar
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className={`${styles.card} ${isDone ? styles.done : ''}`}>
      <div className={styles.header}>
        <h3 className={styles.title}>{task.title}</h3>
        <StatusBadge status={task.status} />
      </div>
      {task.description && <p className={styles.description}>{task.description}</p>}
      <p className={styles.meta}>
        Criada em {new Date(task.createdAt).toLocaleString('pt-BR')}
      </p>
      <div className={styles.actions}>
        {!isDone && (
          <>
            <button
              className={styles.btnComplete}
              onClick={handleComplete}
              disabled={completing}
            >
              {completing ? 'Concluindo…' : 'Concluir'}
            </button>
            <button className={styles.btnEdit} onClick={handleEditClick}>
              Editar
            </button>
          </>
        )}
        <button
          className={styles.btnDelete}
          onClick={() => setConfirmDelete(true)}
          disabled={deleting}
        >
          Excluir
        </button>
      </div>
      {confirmDelete && (
        <ConfirmModal
          taskTitle={task.title}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
          loading={deleting}
        />
      )}
    </article>
  );
}
