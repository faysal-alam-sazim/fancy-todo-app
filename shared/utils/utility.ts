import { EPriority } from "../typedefs/enums";

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
