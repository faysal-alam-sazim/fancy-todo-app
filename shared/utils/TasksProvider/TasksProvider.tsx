import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import dayjs from "dayjs";

import {
  useGetAllTasksQuery,
  useSyncTasksMutation,
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
  const { data, isSuccess } = useGetAllTasksQuery();
  const [tasks, setTasks] = useState<TTask[]>();
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

  const handleUndoStackAfterCreate = () => {
    const updatedTasks = getUpdatedTasks();
    if (updatedTasks) {
      setTasks(updatedTasks);
      setUndoStack([...undoStack, updatedTasks]);
    }
  };

  const handleUndoStackAfterUpdate = () => {
    const updatedTasks = getUpdatedTasks();
    if (updatedTasks) {
      setTasks(updatedTasks);
      setUndoStack([...undoStack, updatedTasks]);
    }
  };

  const handleUndoStackAfterDelete = () => {
    const updatedTasks = getUpdatedTasks();
    if (updatedTasks) {
      setTasks(updatedTasks);
      setUndoStack([...undoStack, updatedTasks]);
    }
  };

  const handleUndoStackAfterClearCompleted = () => {
    const updatedTasks = getUpdatedTasks();
    if (updatedTasks) {
      setTasks(updatedTasks);
      setUndoStack([...undoStack, updatedTasks]);
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
        handleUndoStackAfterCreate,
        handleUndoStackAfterUpdate,
        handleUndoStackAfterDelete,
        handleUndoStackAfterClearCompleted,
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
