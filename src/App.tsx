import { useEffect, useState } from "react";
import { Flex } from "@mantine/core";
import MenuBar from "./Pages/HomePage/components/MenuBar/MenuBar";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";

import CreateTask from "./Pages/HomePage/components/CreateTask/CreateTask";
import DisplayTask from "./Pages/HomePage/components/DisplayTask/DisplayTask";
import { getSortedTasks } from "../src/Shared/Utils/localstorage";
import { Task } from "./types/Task";

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [displayTasks, setDisplayTasks] = useState<Task[]>([]);

  useEffect(() => {
    const data = getSortedTasks();
    setTasks(data);
    setDisplayTasks(data);
    console.log(data);
  }, []);

  const handlePriorityFilter = (priority: string) => {
    if (priority !== "reset") {
      const filteredTasks = tasks.filter(
        (task: Task) => task.priority === priority
      );
      setDisplayTasks(filteredTasks);
    } else {
      setDisplayTasks(tasks);
    }
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

  return (
    <div className="container mx-auto">
      <Flex gap={20}>
        <MenuBar
          open={open}
          handlePriorityFilter={handlePriorityFilter}
          handleStatusFilter={handleStatusFilter}
          handleDueDateFilter={handleDueDateFilter}
        />
        <div style={{ marginTop: 20 }}>
          <DisplayTask tasks={displayTasks} setTasks={setDisplayTasks} />
          <CreateTask opened={opened} close={close} />
        </div>
      </Flex>
    </div>
  );
}

export default App;
