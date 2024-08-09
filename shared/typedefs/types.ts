import { EPriority, ETaskStatus } from "./enums";

export type TTask = {
  id: number;
  title: string;
  description: string;
  dueDate: Date | null;
  priority: EPriority;
  status: ETaskStatus;
};

export type TLoginCredentials = {
  email: string;
  password: string;
};

export type TCreateTaskDto = {
  title: string;
  description?: string;
  dueDate?: Date | null;
  priority: EPriority;
  status: ETaskStatus;
};

export type TUpdateTaskDto = {
  title?: string;
  description?: string;
  dueDate?: Date | null;
  priority?: EPriority;
  status?: ETaskStatus;
};
