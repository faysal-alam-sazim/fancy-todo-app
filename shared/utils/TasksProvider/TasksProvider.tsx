import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import dayjs from "dayjs";

import { useGetAllTasksQuery } from "@/shared/redux/rtk-apis/tasksAPI";

import { TTask } from "../../typedefs/types";
import { ETaskStatus } from "../../typedefs/enums";
import {
  addTaskToLocalStorage,
  deleteCompletedTasksFromLocalStorage,
  deleteTaskFromLocalStorage,
  getSortedTasks,
  getTaskFromLocalStorage,
  markTaskComplete,
  saveLastTaskId,
  setTasksAtLocalStorage,
  updateTaskInLocalStorage,
} from "../localStorage";
import { ITasksContextType, TFilter } from "./TasksProvider.types";

const TasksContext = createContext<ITasksContextType | undefined>(undefined);

interface IProps {
  children: ReactNode;
}

function TasksProvider({ children }: IProps) {
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [history, setHistory] = useState<TTask[][]>([[]]);
  const [currStateIndex, setCurrStateIndex] = useState(0);
  const [filter, setFilter] = useState<TFilter | null>(null);
  const { data } = useGetAllTasksQuery();

  useEffect(() => {
    data && setTasks(data);
    data && setHistory([data]);
  }, [data]);

  const getUpdatedTasks = () => {
    if (!filter) {
      return tasks;
    }
    if (filter.by === "priority") {
      return filterByPriorty(filter.value);
    }
    if (filter.by === "status") {
      return filterByStatus(filter.value);
    }
    return filterByDueDate(new Date(filter.value));
  };

  const addTask = (task: TTask) => {
    addTaskToLocalStorage(task);
    saveLastTaskId(task.id);
    const updatedTasks = getUpdatedTasks();
    setTasks(updatedTasks);

    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...updatedTasks]]);
    setCurrStateIndex(prevHistory.length);
  };

  const updateTask = (data: TTask, taskId: string) => {
    const prevTask = getTaskFromLocalStorage(taskId);
    const updatedTask = {
      id: prevTask.id,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      status: prevTask.status,
    };
    updateTaskInLocalStorage(updatedTask);
    const updatedTasks = getUpdatedTasks();
    setTasks(updatedTasks);

    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...updatedTasks]]);
    setCurrStateIndex(prevHistory.length);
  };

  const markTask = (task: TTask) => {
    task.status = ETaskStatus.COMPLETED;
    markTaskComplete(task);
    const updatedTasks = getUpdatedTasks();
    setTasks(updatedTasks);

    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...updatedTasks]]);
    setCurrStateIndex(prevHistory.length);
  };

  const deleteTask = (task: TTask) => {
    deleteTaskFromLocalStorage(task);
    const updatedTasks = getUpdatedTasks();
    setTasks(updatedTasks);

    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...updatedTasks]]);
    setCurrStateIndex(prevHistory.length);
  };

  const clearCompletedTasks = () => {
    deleteCompletedTasksFromLocalStorage();
    const updatedTasks = getUpdatedTasks();
    setTasks(updatedTasks);

    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...updatedTasks]]);
    setCurrStateIndex(prevHistory.length);
  };

  const filterByPriorty = (priority: string) => {
    const allTasks = getSortedTasks();
    const filteredTasks = allTasks.filter(
      (task: TTask) => task.priority === priority
    );
    setTasks(filteredTasks);
    setFilter({ by: "priority", value: priority });
    return filteredTasks;
  };

  const filterByStatus = (status: string) => {
    const allTasks = getSortedTasks();
    const filteredTasks = allTasks.filter(
      (task: TTask) => task.status === status
    );
    setTasks(filteredTasks);
    setFilter({ by: "status", value: status });
    return filteredTasks;
  };

  const filterByDueDate = (date: Date) => {
    const allTasks = getSortedTasks();
    const tasksMatchingDueDate = allTasks.filter((task: TTask) =>
      dayjs(task.dueDate).isSame(dayjs(date))
    );
    setTasks(tasksMatchingDueDate);
    setFilter({ by: "dueDate", value: date.toDateString() });
    return tasksMatchingDueDate;
  };

  const resetFilter = () => {
    setTasks(getSortedTasks());
    setFilter(null);
  };

  const undoState = () => {
    const prevState = history[currStateIndex - 1];
    setTasks([...prevState]);
    setTasksAtLocalStorage([...prevState]);
    if (currStateIndex >= 0) {
      setCurrStateIndex(currStateIndex - 1);
    }
  };

  const redoState = () => {
    const fwdState = history[currStateIndex + 1];
    setTasks([...fwdState]);
    setTasksAtLocalStorage([...fwdState]);
    if (currStateIndex < history.length) {
      setCurrStateIndex(currStateIndex + 1);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        history,
        currStateIndex,
        addTask,
        updateTask,
        markTask,
        deleteTask,
        clearCompletedTasks,
        filterByPriorty,
        filterByStatus,
        filterByDueDate,
        resetFilter,
        undoState,
        redoState,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
}
export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
};

export default TasksProvider;
