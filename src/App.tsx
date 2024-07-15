import { useEffect, useState } from "react";
import { Flex } from "@mantine/core";
import MenuBar from "./Pages/HomePage/components/MenuBar/MenuBar";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";

import CreateTask from "./Pages/HomePage/components/CreateTask/CreateTask";
import DisplayTask from "./Pages/HomePage/components/DisplayTask/DisplayTask";
import { Task } from "./types/Task";
import {
  setTasksAtLocalStorage,
  deleteCompletedTasksFromLocalStorage,
  getSortedTasks,
} from "./Shared/Utils/localstorage";

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<Task[][]>([[]]);
  const [currStateIndex, setCurrStateIndex] = useState(0);

  useEffect(() => {
    const data = getSortedTasks();
    setTasks(data);
    setHistory([data]);
  }, []);

  const handlePriorityFilter = (priority: string) => {
    const allTasks = getSortedTasks();
    const filteredTasks = allTasks.filter((task: Task) => task.priority === priority);
    setTasks(filteredTasks);
  };

  const handleStatusFilter = (status: string) => {
    const allTasks = getSortedTasks();
    const filteredTasks = allTasks.filter((task: Task) => task.status === status);
    setTasks(filteredTasks);
  };

  const handleDueDateFilter = (date: Date) => {
    const allTasks = getSortedTasks();
    const tasksMatchingDueDate = allTasks.filter((task: Task) =>
      dayjs(task.dueDate).isSame(dayjs(date)),
    );
    setTasks(tasksMatchingDueDate);
  };

  const handleResetFilter = () => {
    setTasks(tasks);
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
    <div className="container mx-auto">
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
        <div style={{ marginTop: 20 }}>
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

export default App;
