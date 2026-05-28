import { createPortal } from 'react-dom';
import styles from './ConfirmModal.module.css';

interface Props {
  taskTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmModal({ taskTitle, onConfirm, onCancel, loading }: Props) {
  return createPortal(
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <div className={styles.icon}>🗑️</div>
        <div className={styles.body}>
          <h2 id="modal-title" className={styles.title}>Excluir tarefa?</h2>
          <p className={styles.description}>
            A tarefa <span className={styles.taskName}>"{taskTitle}"</span> será removida permanentemente. Essa ação não pode ser desfeita.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.btnCancel}
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={styles.btnConfirm}
            onClick={onConfirm}
            disabled={loading}
            autoFocus
          >
            {loading ? 'Excluindo…' : 'Sim, excluir'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
