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
  useSyncTasksMutation,
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
  const [filter, setFilter] = useState<TFilter | null>(null);
  const { data, refetch, isSuccess } = useGetAllTasksQuery();
  const [tasks, setTasks] = useState<TTask[]>();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteCompletedTask] = useDeleteCompletedTaskMutation();
  const [syncTasks] = useSyncTasksMutation();

  const [undoStack, setUndoStack] = useState<TTask[][]>([[]]);
  const [redoStack, setRedoStack] = useState<TTask[][]>([[]]);

  useEffect(() => {
    if (isSuccess) {
      setTasks(sortTasks(data));
    }
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
      if (updatedTasks) {
        setTasks(updatedTasks);
        setUndoStack([...undoStack, updatedTasks]);
      }
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
      if (updatedTasks) {
        setTasks(updatedTasks);
        setUndoStack([...undoStack, updatedTasks]);
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask({ id: taskId }).unwrap();
      refetch();

      const updatedTasks = getUpdatedTasks();
      if (updatedTasks) {
        setTasks(updatedTasks);
        setUndoStack([...undoStack, updatedTasks]);
      }
    } catch (err) {
      alert(err);
    }
  };

  const clearCompletedTasks = async () => {
    try {
      await deleteCompletedTask().unwrap();
      refetch();

      const updatedTasks = getUpdatedTasks();
      if (updatedTasks) {
        setTasks(updatedTasks);
        setUndoStack([...undoStack, updatedTasks]);
      }
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
    const prevState = undoStack[undoStack.length - 1];
    setTasks(prevState);

    setUndoStack(undoStack.slice(0, -1));

    const updatedTask = getUpdatedTasks();
    updatedTask && setRedoStack([...redoStack, updatedTask]);

    saveChanges(prevState);
  };

  const redoState = () => {
    const fwdState = redoStack[redoStack.length - 1];
    setTasks(fwdState);

    setRedoStack(redoStack.slice(0, -1));

    const updatedTask = getUpdatedTasks();
    const storedTasksInUndo = [...undoStack];
    updatedTask && setUndoStack([...storedTasksInUndo, updatedTask]);

    saveChanges(fwdState);
  };

  const saveChanges = async (tasksToSave: TTask[]) => {
    try {
      setUndoStack([[]]);
      setRedoStack([[]]);
      await syncTasks(tasksToSave).unwrap();
    } catch (error) {
      console.error("Failed to sync tasks:", error);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        undoStack,
        redoStack,
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
