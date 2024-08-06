import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import dayjs from "dayjs";

import {
  useCreateTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "@/shared/redux/rtk-apis/tasksAPI";

import { TCreateTaskDto, TTask, TUpdateTaskDto } from "../../typedefs/types";
import {
  deleteCompletedTasksFromLocalStorage,
  deleteTaskFromLocalStorage,
  getSortedTasks,
  setTasksAtLocalStorage,
} from "../localStorage";
import { ITasksContextType, TFilter } from "./TasksProvider.types";
import {
  useCreateTaskMutation,
  useGetAllTasksQuery,
} from "@/shared/redux/rtk-apis/tasksAPI";

const TasksContext = createContext<ITasksContextType | undefined>(undefined);

interface IProps {
  children: ReactNode;
}

function TasksProvider({ children }: IProps) {
  const [history, setHistory] = useState<TTask[][]>([[]]);
  const [currStateIndex, setCurrStateIndex] = useState(0);
  const [filter, setFilter] = useState<TFilter | null>(null);
  const { data: tasks, refetch } = useGetAllTasksQuery();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    tasks && setHistory([tasks]);
  }, []);

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

  const handleAddTask = async (task: TCreateTaskDto) => {
    try {
      await createTask(task).unwrap();
      refetch();
    } catch (err) {
      alert(err);
    }

    const prevHistory = history.slice(0, currStateIndex + 1);
    tasks && setHistory([...prevHistory, [...tasks]]);
    setCurrStateIndex(prevHistory.length);
  };

  const handleUpdateTask = async (data: TUpdateTaskDto, taskId: string) => {
    try {
      await updateTask({
        id: taskId,
        updatedTask: data,
      }).unwrap();
      refetch();
    } catch (err) {
      alert(err);
    }

    const prevHistory = history.slice(0, currStateIndex + 1);
    tasks && setHistory([...prevHistory, [...tasks]]);
    setCurrStateIndex(prevHistory.length);
  };

  const deleteTask = (task: TTask) => {
    deleteTaskFromLocalStorage(task);
    const updatedTasks = getUpdatedTasks();

    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...updatedTasks]]);
    setCurrStateIndex(prevHistory.length);
  };

  const clearCompletedTasks = () => {
    deleteCompletedTasksFromLocalStorage();
    const updatedTasks = getUpdatedTasks();

    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...updatedTasks]]);
    setCurrStateIndex(prevHistory.length);
  };

  const filterByPriorty = (priority: string) => {
    const allTasks = getSortedTasks();
    const filteredTasks = allTasks.filter(
      (task: TTask) => task.priority === priority
    );
    setFilter({ by: "priority", value: priority });
    return filteredTasks;
  };

  const filterByStatus = (status: string) => {
    const allTasks = getSortedTasks();
    const filteredTasks = allTasks.filter(
      (task: TTask) => task.status === status
    );
    setFilter({ by: "status", value: status });
    return filteredTasks;
  };

  const filterByDueDate = (date: Date) => {
    const allTasks = getSortedTasks();
    const tasksMatchingDueDate = allTasks.filter((task: TTask) =>
      dayjs(task.dueDate).isSame(dayjs(date))
    );
    setFilter({ by: "dueDate", value: date.toDateString() });
    return tasksMatchingDueDate;
  };

  const resetFilter = () => {
    setFilter(null);
  };

  const undoState = () => {
    const prevState = history[currStateIndex - 1];
    setTasksAtLocalStorage([...prevState]);
    if (currStateIndex >= 0) {
      setCurrStateIndex(currStateIndex - 1);
    }
  };

  const redoState = () => {
    const fwdState = history[currStateIndex + 1];
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
        handleAddTask,
        handleUpdateTask,
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
