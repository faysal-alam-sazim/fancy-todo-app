import { useEffect, useState } from "react";
import { Flex } from "@mantine/core";
import MenuBar from "./Pages/HomePage/components/MenuBar/MenuBar";
import { useDisclosure } from "@mantine/hooks";

import CreateTask from "./Pages/HomePage/components/CreateTask/CreateTask";
import DisplayTask from "./Pages/HomePage/components/DisplayTask/DisplayTask";
import { getSortedTasks } from "./localstorage/localstorage";
import { Task } from "./types/Task";

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const data = getSortedTasks();
    setTasks(data);
  }, []);

  return (
    <div className="container mx-auto">
      <Flex gap={20}>
        <MenuBar open={open} />
        <div style={{ marginTop: 20 }}>
          <DisplayTask tasks={tasks} setTasks={setTasks} />
          <CreateTask opened={opened} close={close} />
        </div>
      </Flex>
    </div>
  );
}

export default App;
