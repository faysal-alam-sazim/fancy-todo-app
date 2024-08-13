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

import { TFilter, TTask } from "../../typedefs/types";
import { ITasksContextType } from "./TasksProvider.types";
import { sortTasks } from "../utility";

const TasksContext = createContext<ITasksContextType | undefined>(undefined);

interface IProps {
  children: ReactNode;
}

function TasksProvider({ children }: IProps) {
  const { data, isSuccess } = useGetAllTasksQuery();
  const [tasks, setTasks] = useState<TTask[]>();
  const [syncTasks] = useSyncTasksMutation();
  const [priorityRadioValue, setPriorityRadioValue] = useState<string | null>(
    null
  );
  const [statusRadioValue, setStatusRadioValue] = useState<string | null>(null);
  const [filteringDate, setFilteringDate] = useState<Date | null>(null);

  const [undoStack, setUndoStack] = useState<TTask[][]>([[]]);
  const [redoStack, setRedoStack] = useState<TTask[][]>([[]]);

  useEffect(() => {
    if (isSuccess) {
      setTasks(sortTasks(data));
    }
  }, [data]);

  const getUpdatedTasks = () => {
    return tasks;
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

  const filterTasks = (filter: TFilter) => {
    const filteredTasks = data?.filter((task) => {
      const priorityMatch = filter?.priority
        ? task.priority === filter.priority
        : true;

      const statusMatch = filter?.status ? task.status === filter.status : true;

      const dueDateMatch = filter?.dueDate
        ? dayjs(task.dueDate).isSame(dayjs(filter.dueDate))
        : true;

      return priorityMatch && statusMatch && dueDateMatch;
    });
    filteredTasks && setTasks(sortTasks(filteredTasks));
  };

  const resetFilter = () => {
    setPriorityRadioValue(null);
    setStatusRadioValue(null);
    setFilteringDate(null);
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
        resetFilter,
        undoState,
        redoState,
        filterTasks,
        priorityRadioValue,
        statusRadioValue,
        filteringDate,
        setPriorityRadioValue,
        setStatusRadioValue,
        setFilteringDate,
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
