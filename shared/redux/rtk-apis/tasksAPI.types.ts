import { EPriority, ETaskStatus } from "@/shared/typedefs/enums";

export type TCreateTaskPayload = {
  title: string;
  description: string;
  dueDate: Date | null;
  priority: EPriority;
  status: ETaskStatus;
};
