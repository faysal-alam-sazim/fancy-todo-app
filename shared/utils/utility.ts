import { EPriority, ETaskStatus } from "../typedefs/enums";
import { TTask } from "../typedefs/types";

export const getPriority = (priority: EPriority) => {
  if (priority === EPriority.HIGH) return "High";
  if (priority === EPriority.MEDIUM) return "Medium";
  return "Low";
};

export const getPriorityColor = (priority: EPriority) => {
  if (priority === EPriority.HIGH) return "red";
  if (priority === EPriority.MEDIUM) return "blue";
  return "green";
};

export function sortTasks(tasks: TTask[]) {
  const tasksCopy = [...tasks];
  tasksCopy.sort((a: TTask, b: TTask) => {
    if (
      a.status === ETaskStatus.COMPLETED &&
      b.status !== ETaskStatus.COMPLETED
    ) {
      return 1;
    }

    if (
      a.status !== ETaskStatus.COMPLETED &&
      b.status === ETaskStatus.COMPLETED
    ) {
      return -1;
    }

    return Number(b.priority) - Number(a.priority);
  });
  return tasksCopy;
}
