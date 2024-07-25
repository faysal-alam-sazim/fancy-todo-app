import { useEffect, useState } from "react";
import { Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";

import { TTask } from "@/shared/typedefs/types";
import {
  setTasksAtLocalStorage,
  deleteCompletedTasksFromLocalStorage,
  getSortedTasks,
} from "@/shared/utils/localStorage";

import CreateTask from "../components/CreateTask/CreateTask";
import DisplayTask from "../components/DisplayTask/DisplayTask";
import MenuBar from "../components/MenuBar/MenuBar";

function TodoAppContainer() {
  const [opened, { open, close }] = useDisclosure(false);
  const [tasks, setTasks] = useState<TTask[]>([]);
  const [history, setHistory] = useState<TTask[][]>([[]]);
  const [currStateIndex, setCurrStateIndex] = useState(0);

  useEffect(() => {
    const data = getSortedTasks();
    setTasks(data);
    setHistory([data]);
  }, []);

  const handlePriorityFilter = (priority: string) => {
    const allTasks = getSortedTasks();
    const filteredTasks = allTasks.filter(
      (task: TTask) => task.priority === priority
    );
    setTasks(filteredTasks);
  };

  const handleStatusFilter = (status: string) => {
    const allTasks = getSortedTasks();
    const filteredTasks = allTasks.filter(
      (task: TTask) => task.status === status
    );
    setTasks(filteredTasks);
  };

  const handleDueDateFilter = (date: Date) => {
    const allTasks = getSortedTasks();
    const tasksMatchingDueDate = allTasks.filter((task: TTask) =>
      dayjs(task.dueDate).isSame(dayjs(date))
    );
    setTasks(tasksMatchingDueDate);
  };

  const handleResetFilter = () => {
    setTasks(getSortedTasks());
  };

  const clearCompletedTasks = () => {
    deleteCompletedTasksFromLocalStorage();
    const updatedTasks = getSortedTasks();
    setTasks(updatedTasks);

    const prevHistory = history.slice(0, currStateIndex + 1);
    setHistory([...prevHistory, [...updatedTasks]]);
    setCurrStateIndex(prevHistory.length);
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
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Flex gap={20}>
        <MenuBar
          open={open}
          handlePriorityFilter={handlePriorityFilter}
          handleStatusFilter={handleStatusFilter}
          handleDueDateFilter={handleDueDateFilter}
          handleResetFilter={handleResetFilter}
          clearCompletedTasks={clearCompletedTasks}
          undoState={undoState}
          redoState={redoState}
          history={history}
          currStateIndex={currStateIndex}
        />
        <div style={{ marginTop: 20, flex: 1 }}>
          <DisplayTask
            tasks={tasks}
            setTasks={setTasks}
            setHistory={setHistory}
            history={history}
            setCurrStateIndex={setCurrStateIndex}
            currStateIndex={currStateIndex}
          />
          <CreateTask
            opened={opened}
            close={close}
            setTasks={setTasks}
            setHistory={setHistory}
            history={history}
            setCurrStateIndex={setCurrStateIndex}
            currStateIndex={currStateIndex}
          />
        </div>
      </Flex>
    </div>
  );
}

export default TodoAppContainer;
