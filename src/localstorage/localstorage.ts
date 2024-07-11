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
  localStorage.removeItem("tasks");
  localStorage.setItem("tasks", JSON.stringify(tasksAfterDelete));
  return tasksAfterDelete;
}

export {
  addTaskToLocalStorage,
  getTasksFromLocalStorage,
  getLastTaskId,
  saveLastTaskId,
  updateTaskInLocalStorage,
  deleteTaskFromLocalStorage,
};
