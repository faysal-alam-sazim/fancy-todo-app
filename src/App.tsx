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
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);
  const [history, setHistory] = useState<Task[][]>([[]]);
  const [currStateIndex, setCurrStateIndex] = useState(0);

  useEffect(() => {
    const data = getSortedTasks();
    setTasks(data);
    setDisplayTasks(data);
    setHistory([data]);
    console.log(data);
  }, []);

  const handlePriorityFilter = (priority: string) => {
    const filteredTasks = tasks.filter(
      (task: Task) => task.priority === priority
    );
    setDisplayTasks(filteredTasks);
  };

  const handleStatusFilter = (status: string) => {
    const filteredTasks = tasks.filter((task: Task) => task.status === status);
    setDisplayTasks(filteredTasks);
  };

  const handleDueDateFilter = (date: Date) => {
    const tasksMatchingDueDate = tasks.filter((task: Task) =>
      dayjs(task.dueDate).isSame(dayjs(date))
    );
    setDisplayTasks(tasksMatchingDueDate);
  };

  const handleResetFilter = () => {
    setDisplayTasks(tasks);
  };

  const clearCompletedTasks = () => {
    deleteCompletedTasksFromLocalStorage();
    const updatedTasks = getSortedTasks();
    setTasks(updatedTasks);
    setDisplayTasks(updatedTasks);
  };

  const undoState = () => {
    console.log("History", history);
    console.log(currStateIndex);
    const prevState = history[currStateIndex - 1];
    setDisplayTasks([...prevState]);
    setTasksAtLocalStorage([...prevState]);
    if (currStateIndex >= 0) {
      setCurrStateIndex(currStateIndex - 1);
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
          currStateIndex={currStateIndex}
        />
        <div style={{ marginTop: 20 }}>
          <DisplayTask
            tasks={displayTasks}
            setDisplayTasks={setDisplayTasks}
            setHistory={setHistory}
            history={history}
            setCurrStateIndex={setCurrStateIndex}
            currStateIndex={currStateIndex}
          />
          <CreateTask
            opened={opened}
            close={close}
            setDisplayTasks={setDisplayTasks}
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
