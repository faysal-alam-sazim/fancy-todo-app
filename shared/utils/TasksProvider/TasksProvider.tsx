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
  useDeleteCompletedTaskMutation,
  useDeleteTaskMutation,
  useGetAllTasksQuery,
  useUpdateTaskMutation,
} from "@/shared/redux/rtk-apis/tasksAPI";

import { TCreateTaskDto, TTask, TUpdateTaskDto } from "../../typedefs/types";
import { ITasksContextType, TFilter } from "./TasksProvider.types";
import { sortTasks } from "../utility";

const TasksContext = createContext<ITasksContextType | undefined>(undefined);

interface IProps {
  children: ReactNode;
}

function TasksProvider({ children }: IProps) {
  const [currStateIndex, setCurrStateIndex] = useState(0);
  const [filter, setFilter] = useState<TFilter | null>(null);
  const { data, refetch, isSuccess } = useGetAllTasksQuery();
  const [tasks, setTasks] = useState<TTask[]>();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteCompletedTask] = useDeleteCompletedTaskMutation();
  const [history, setHistory] = useState<TTask[][]>([[]]);

  useEffect(() => {
    isSuccess && setHistory([data]);
    isSuccess && setTasks(sortTasks(data));
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

  const handleAddTask = async (task: TCreateTaskDto) => {
    try {
      await createTask(task).unwrap();
      refetch();

      const updatedTasks = getUpdatedTasks();
      updatedTasks && setTasks(updatedTasks);

      const prevHistory = history.slice(0, currStateIndex + 1);
      updatedTasks && setHistory([...prevHistory, [...updatedTasks]]);
      setCurrStateIndex(prevHistory.length);
    } catch (err) {
      alert(err);
    }
  };

  const handleUpdateTask = async (data: TUpdateTaskDto, taskId: string) => {
    try {
      await updateTask({
        id: taskId,
        updatedTask: data,
      }).unwrap();
      refetch();

      const updatedTasks = getUpdatedTasks();
      updatedTasks && setTasks(updatedTasks);

      const prevHistory = history.slice(0, currStateIndex + 1);
      updatedTasks && setHistory([...prevHistory, [...updatedTasks]]);
      setCurrStateIndex(prevHistory.length);
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask({ id: taskId }).unwrap();
      refetch();

      const updatedTasks = getUpdatedTasks();
      updatedTasks && setTasks(updatedTasks);

      const prevHistory = history.slice(0, currStateIndex + 1);
      updatedTasks && setHistory([...prevHistory, [...updatedTasks]]);
      setCurrStateIndex(prevHistory.length);
    } catch (err) {
      alert(err);
    }
  };

  const clearCompletedTasks = async () => {
    try {
      await deleteCompletedTask().unwrap();
      refetch();

      const updatedTasks = getUpdatedTasks();
      updatedTasks && setTasks(updatedTasks);

      const prevHistory = history.slice(0, currStateIndex + 1);
      updatedTasks && setHistory([...prevHistory, [...updatedTasks]]);
      setCurrStateIndex(prevHistory.length);
    } catch (err) {
      alert(err);
    }
  };

  const filterByPriorty = (priority: string) => {
    const filteredTasks = data?.filter(
      (task: TTask) => task.priority === priority
    );
    setFilter({ by: "priority", value: priority });
    setTasks(filteredTasks);
    return filteredTasks;
  };

  const filterByStatus = (status: string) => {
    const filteredTasks = data?.filter((task: TTask) => task.status === status);
    setFilter({ by: "status", value: status });
    setTasks(filteredTasks);
    return filteredTasks;
  };

  const filterByDueDate = (date: Date) => {
    const tasksMatchingDueDate = data?.filter((task: TTask) =>
      dayjs(task.dueDate).isSame(dayjs(date))
    );
    setFilter({ by: "dueDate", value: date.toDateString() });
    setTasks(tasksMatchingDueDate);
    return tasksMatchingDueDate;
  };

  const resetFilter = () => {
    setFilter(null);
    data && setTasks(sortTasks(data));
  };

  const undoState = () => {
    const prevState = history[currStateIndex - 1];
    setTasks([...prevState]);
    if (currStateIndex >= 0) {
      setCurrStateIndex(currStateIndex - 1);
    }
  };

  const redoState = () => {
    const fwdState = history[currStateIndex + 1];
    setTasks([...fwdState]);
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
        handleDeleteTask,
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
