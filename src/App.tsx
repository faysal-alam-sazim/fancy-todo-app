import MenuBar from "./components/MenuBar/MenuBar";
import { useDisclosure } from "@mantine/hooks";
import CreateTask from "./components/CreateTask/CreateTask";
import DisplayTask from "./components/DisplayTask/DisplayTask";

function App() {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div style={{ display: "flex", gap: "20px " }}>
      <MenuBar open={open} />
      <div style={{ marginTop: 20 }}>
        <DisplayTask />
        <CreateTask opened={opened} close={close} />
      </div>
    </div>
  );
}

export default App;
