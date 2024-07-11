import { Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import MenuBar from "./Pages/HomePage/components/MenuBar/MenuBar";
import CreateTask from "./Pages/HomePage/components/CreateTask/CreateTask";

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div style={{ display: "flex", gap: "20px " }}>
      <MenuBar open={open} />
      <div style={{ marginTop: 20 }}>
        <Text>Display all the tasks.</Text>
        <CreateTask opened={opened} close={close} />
      </div>
    </div>
  );
}

export default App;
