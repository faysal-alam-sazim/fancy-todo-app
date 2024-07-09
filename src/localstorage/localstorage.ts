import { Task } from "../types/Task";

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

export {
  addTaskToLocalStorage,
  getTasksFromLocalStorage,
  getLastTaskId,
  saveLastTaskId,
};
