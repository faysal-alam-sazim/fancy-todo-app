import { Text } from "@mantine/core";
import MenuBar from "./components/MenuBar/MenuBar";

function App() {
  return (
    <div style={{ display: "flex", gap: "20px " }}>
      <MenuBar></MenuBar>
      <div style={{ marginTop: 20 }}>
        <Text>Display all the tasks.</Text>
      </div>
    </div>
  );
}

export default App;
