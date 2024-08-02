import { Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";

import CreateTask from "../components/CreateTask/CreateTask";
import DisplayTask from "../components/DisplayTask/DisplayTask";
import MenuBar from "../components/MenuBar/MenuBar";

const TodoAppContainer = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { tasks } = useTasksContext();

  return (
    <div style={{ width: "80%", margin: "0 auto" }}>
      <Flex gap={20}>
        <MenuBar open={open} />
        <div style={{ marginTop: 20, flex: 1 }}>
          <DisplayTask tasks={tasks} />
          <CreateTask opened={opened} close={close} />
        </div>
      </Flex>
    </div>
  );
};

export default TodoAppContainer;
