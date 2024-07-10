import { Flex, Card, Text, Group, Button } from "@mantine/core";
import { getTasksFromLocalStorage } from "../../localstorage/localstorage";
import { useEffect, useState } from "react";
import { Task } from "../../types/Task";
import dayjs from "dayjs";
import { IconTrash } from "@tabler/icons-react";

function DisplayTask() {
  const [tasks, setTasks] = useState<Task[]>([]);
  useEffect(() => {
    const data = getTasksFromLocalStorage();
    if (data.length > 0) {
      const sortedTasks = data
        .slice()
        .sort((a: Task, b: Task) => Number(b.priority) - Number(a.priority));
      return setTasks(sortedTasks);
    }
    return setTasks(data);
  }, []);
  console.log(tasks);
  return (
    <Flex gap={4} wrap={"wrap"}>
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
            <div className="p-2 bg-red-600 text-white rounded-full cursor-pointer">
              <IconTrash />
            </div>
          </Group>

          <Text size="sm" c="dimmed" mb={4}>
            {task.description}
          </Text>

          <Text size="sm" c="dimmed" mb={4}>
            Priority:{" "}
            {task.priority === "0"
              ? "Not set"
              : task.priority === "1"
              ? "Low"
              : task.priority === "2"
              ? "Medium"
              : "High"}
          </Text>
          <Text size="sm" c="dimmed" mb={4}>
            Due Date:
            <span className="ml-2">
              {task.dueDate ? dayjs(task.dueDate).toString() : "Not set"}
            </span>
          </Text>
          <Flex justify={"space-between"} align={"center"}>
            <Button>Edit</Button>
            <Button color="green">Mark as complete</Button>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}

export default DisplayTask;
