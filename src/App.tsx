import MenuBar from "./components/MenuBar/MenuBar";
import { useDisclosure } from "@mantine/hooks";
import CreateTask from "./components/CreateTask/CreateTask";
import DisplayTask from "./components/DisplayTask/DisplayTask";
import { Flex } from "@mantine/core";

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className="container mx-auto">
      <Flex gap={20}>
        <MenuBar open={open} />
        <div style={{ marginTop: 20 }}>
          <DisplayTask />
          <CreateTask opened={opened} close={close} />
        </div>
      </Flex>
    </div>
  );
}

export default App;
