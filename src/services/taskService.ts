import type { Task, CreateTaskPayload, UpdateTaskPayload, TaskStatus } from '../types';

const BASE_URL = 'http://localhost:5000';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Erro ${res.status}`;
    try {
      const body = await res.json();
      if (body?.message) {
        message = body.message;
      } else if (body?.errors) {
        const msgs = Object.values(body.errors as Record<string, string[]>).flat();
        message = msgs.join(' ');
      }
    } catch (_) {
      // ignora erro ao parsear body de erro
    }
    throw new Error(message);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export async function getTasks(status?: TaskStatus): Promise<Task[]> {
  const url = status ? `${BASE_URL}/api/tasks?status=${status}` : `${BASE_URL}/api/tasks`;
  const res = await fetch(url);
  return handleResponse<Task[]>(res);
}

export async function createTask(payload: CreateTaskPayload): Promise<Task> {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Task>(res);
}

export async function updateTask(id: number, payload: UpdateTaskPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<void>(res);
}

export async function deleteTask(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/tasks/${id}`, { method: 'DELETE' });
  return handleResponse<void>(res);
}
