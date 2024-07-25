import { TTask } from "../typedefs/types";
import { ETaskStatus } from "../typedefs/enums";

function addTaskToLocalStorage(task: TTask) {
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

function updateTaskInLocalStorage(task: TTask) {
  const previosStoredTasks = getTasksFromLocalStorage();
  const filteredPrevTasks = previosStoredTasks.filter(
    (item: TTask) => Number(item.id) !== Number(task.id)
  );
  const updatedTasks = [...filteredPrevTasks, task];
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function deleteTaskFromLocalStorage(task: TTask) {
  const previosStoredTasks = getTasksFromLocalStorage();
  const filteredPrevTasks = previosStoredTasks.filter(
    (item: TTask) => Number(item.id) !== Number(task.id)
  );
  const tasksAfterDelete = [...filteredPrevTasks];
  localStorage.setItem("tasks", JSON.stringify(tasksAfterDelete));
  return tasksAfterDelete;
}

function markTaskComplete(task: TTask) {
  const prevTasks = getTasksFromLocalStorage();
  const filteredTasks = prevTasks.filter(
    (item: TTask) => Number(item.id) !== Number(task.id)
  );
  const updatedTasks = [...filteredTasks, task];
  localStorage.setItem("tasks", JSON.stringify(updatedTasks));
}

function deleteCompletedTasksFromLocalStorage() {
  const prevTasks = getTasksFromLocalStorage();
  const activeTasks = prevTasks.filter(
    (task: TTask) => task.status === ETaskStatus.ACTIVE
  );
  localStorage.setItem("tasks", JSON.stringify(activeTasks));
}

function setTasksAtLocalStorage(tasks: TTask[]) {
  if (tasks.length > 0) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function getSortedTasks() {
  const tasks = getTasksFromLocalStorage();

  tasks.sort((a: TTask, b: TTask) => {
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
  setTasksAtLocalStorage,
};
