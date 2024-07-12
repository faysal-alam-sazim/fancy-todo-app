import { TASK_STATES } from "../../Stores/TaskStates";
import { Task } from "../../types/Task";

function addTaskToLocalStorage(task: Task) {
  const previosStoredTasks = getTasksFromLocalStorage();
  const newTasks = [...previosStoredTasks, task];
  localStorage.setItem("tasks", JSON.stringify(newTasks));
}

function getTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    return JSON.parse(storedTasks);
  }
  return [];
}

function saveLastTaskId(id: number) {
  localStorage.setItem("lastTaskId", id.toString());
}

function getLastTaskId() {
  let lastSavedId = parseInt(localStorage.getItem("lastTaskId") || "0");
  return lastSavedId;
}

function updateTaskInLocalStorage(task: Task) {
  const previosStoredTasks = getTasksFromLocalStorage();
  const filteredPrevTasks = previosStoredTasks.filter(
    (item: Task) => Number(item.id) !== Number(task.id)
  );
  const updatedTasks = [...filteredPrevTasks, task];
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function deleteTaskFromLocalStorage(task: Task) {
  const previosStoredTasks = getTasksFromLocalStorage();
  const filteredPrevTasks = previosStoredTasks.filter(
    (item: Task) => Number(item.id) !== Number(task.id)
  );
  const tasksAfterDelete = [...filteredPrevTasks];
  localStorage.setItem("tasks", JSON.stringify(tasksAfterDelete));
  return tasksAfterDelete;
}

function markTaskComplete(task: Task) {
  const prevTasks = getTasksFromLocalStorage();
  const filteredTasks = prevTasks.filter(
    (item: Task) => Number(item.id) !== Number(task.id)
  );
  const updatedTasks = [...filteredTasks, task];
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  return updatedTasks;
}

function deleteCompletedTasksFromLocalStorage() {
  const prevTasks = getTasksFromLocalStorage();
  const activeTasks = prevTasks.filter(
    (task: Task) => task.status === TASK_STATES.ACTIVE_STATE
  );
  localStorage.setItem("tasks", JSON.stringify(activeTasks));
}

function getSortedTasks() {
  const tasks = getTasksFromLocalStorage();

  tasks.sort((a: Task, b: Task) => {
    if (
      a.status === TASK_STATES.COMPLETED &&
      b.status !== TASK_STATES.COMPLETED
    ) {
      return 1;
    }

    if (
      a.status !== TASK_STATES.COMPLETED &&
      b.status === TASK_STATES.COMPLETED
    ) {
      return -1;
    }

    return Number(b.priority) - Number(a.priority);
  });
  return tasks;
}

export {
  addTaskToLocalStorage,
  getTasksFromLocalStorage,
  getLastTaskId,
  saveLastTaskId,
  updateTaskInLocalStorage,
  deleteTaskFromLocalStorage,
  markTaskComplete,
  getSortedTasks,
  deleteCompletedTasksFromLocalStorage,
};
