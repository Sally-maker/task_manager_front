import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskStatus, CreateTaskPayload, UpdateTaskPayload } from '../types';
import * as taskService from '../services/taskService';

export function useTasks(statusFilter?: TaskStatus) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taskService.getTasks(statusFilter);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(async (payload: CreateTaskPayload) => {
    const created = await taskService.createTask(payload);
    setTasks((prev) => [created, ...prev]);
    return created;
  }, []);

  const editTask = useCallback(async (id: number, payload: UpdateTaskPayload) => {
    await taskService.updateTask(id, payload);
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t
      )
    );
  }, []);

  const removeTask = useCallback(async (id: number) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completeTask = useCallback(
    async (task: Task) => {
      const payload: UpdateTaskPayload = {
        title: task.title,
        description: task.description ?? undefined,
        status: 'done',
      };
      await taskService.updateTask(task.id, payload);
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, status: 'done', updatedAt: new Date().toISOString() } : t
        )
      );
    },
    []
  );

  return { tasks, loading, error, fetchTasks, addTask, editTask, removeTask, completeTask };
}
