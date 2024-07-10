import { Text } from "@mantine/core";
import MenuBar from "./components/MenuBar/MenuBar";
import { useDisclosure } from "@mantine/hooks";
import CreateTask from "./components/CreateTask/CreateTask";

import { Text } from "@mantine/core";
import MenuBar from "./components/MenuBar/MenuBar";
import { useDisclosure } from "@mantine/hooks";
import CreateTask from "./components/CreateTask/CreateTask";

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div style={{ display: "flex", gap: "20px " }}>
      <MenuBar open={open} />
      <div style={{ marginTop: 20 }}>
        <Text>Display all the tasks.</Text>
        <CreateTask opened={opened} close={close}></CreateTask>
      </div>
    </div>
  );
}

export default App;
