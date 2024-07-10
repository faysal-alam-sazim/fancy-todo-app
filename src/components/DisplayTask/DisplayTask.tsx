import { Flex, Card, Text, Badge, Group } from "@mantine/core";
import { getTasksFromLocalStorage } from "../../localstorage/localstorage";
import { useEffect, useState } from "react";
import { Task } from "../../types/Task";

function DisplayTask() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const data = getTasksFromLocalStorage();
    setTasks(data);
  }, []);
  return (
    <Flex>
      {tasks.map((task) => (
        <Card
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          style={{ minWidth: 400 }}
        >
          <Group justify="space-between" mt="sm" mb="xs">
            <Text fw={500}>{task.title}</Text>
            <Badge color="pink">Edit</Badge>
          </Group>

          <Text size="sm" c="dimmed">
            {task.description}
          </Text>

          <Flex>
            <Text>Due Date:</Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}

export default DisplayTask;
