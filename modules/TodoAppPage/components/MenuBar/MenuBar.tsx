import { useState } from "react";
import { Group, Text, Button, Box, Radio, Flex } from "@mantine/core";
import { IconFilter, IconPlus } from "@tabler/icons-react";
import { DatePickerInput } from "@mantine/dates";
import "@mantine/dates/styles.css";

import { EPriority, ETaskStatus } from "@/shared/typedefs/enums";
import { useTasksContext } from "@/shared/utils/TasksProvider/TasksProvider";
import { useDeleteCompletedTaskMutation } from "@/shared/redux/rtk-apis/tasksAPI";

import classes from "./MenuBar.module.css";
import { TMenuBarProps } from "./MenuBar.types";
import { TFilter } from "@/shared/typedefs/types";

const MenuBar = ({ open }: TMenuBarProps) => {
  const [deleteCompletedTask] = useDeleteCompletedTaskMutation();
  const [filter, setFilter] = useState<TFilter | null>(null);
  const {
    undoStack,
    redoStack,
    resetFilter,
    handleUndoStackAfterClearCompleted,
    undoState,
    redoState,
    filterTasks,
    priorityRadioValue,
    statusRadioValue,
    filteringDate,
    setPriorityRadioValue,
    setStatusRadioValue,
    setFilteringDate,
  } = useTasksContext();

  const handlePriorityRadioButton = (value: string) => {
    setPriorityRadioValue(value);
    if (filter) {
      const updatedFilter = filter;
      updatedFilter.priority = value;
      setFilter(updatedFilter);
      filterTasks(updatedFilter);
    } else {
      setFilter({ priority: value });
      filterTasks({ priority: value });
    }
  };

  const handleStatusRadioButton = (value: string) => {
    setStatusRadioValue(value);
    if (filter) {
      const updatedFilter = filter;
      updatedFilter.status = value;
      setFilter(updatedFilter);
      filterTasks(updatedFilter);
    } else {
      setFilter({ status: value });
      filterTasks({ status: value });
    }
  };

  const handleDueDateInput = (value: Date | null) => {
    setFilteringDate(value);
    if (filter) {
      const updatedFilter = filter;
      updatedFilter.dueDate = value;
      setFilter(updatedFilter);
      filterTasks(updatedFilter);
    } else {
      setFilter({ dueDate: value });
      filterTasks({ dueDate: value });
    }
    if (value) {
    }
  };

  const handleResetFilterButton = () => {
    setFilter(null);
    resetFilter();
  };

  const handleClearTaskButton = async () => {
    try {
      await deleteCompletedTask().unwrap();
      handleUndoStackAfterClearCompleted();
    } catch (err) {
      alert(err);
    }
  };

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text>TO-DO App</Text>
          <Button onClick={open} rightSection={<IconPlus />}>
            Create Task
          </Button>
        </Group>
        <Text className={classes.link}>
          <IconFilter className={classes.linkIcon} stroke={1.5} />
          <span>Filter</span>
        </Text>
        <Box ml={30} mb={20}>
          <Radio.Group
            value={priorityRadioValue}
            onChange={handlePriorityRadioButton}
            label="By Priority"
          >
            <Radio value={EPriority.LOW} label="Low" mb={4} />
            <Radio value={EPriority.MEDIUM} label="Medium" mb={4} />
            <Radio value={EPriority.HIGH} label="High" mb={4} />
          </Radio.Group>

          <Radio.Group
            value={statusRadioValue}
            onChange={handleStatusRadioButton}
            label="By Status"
          >
            <Radio value={ETaskStatus.ACTIVE} label="Active" mb={4} />
            <Radio value={ETaskStatus.COMPLETED} label="Completed" mb={4} />
          </Radio.Group>

          <DatePickerInput
            label="Filter by Due Date"
            value={filteringDate}
            onChange={handleDueDateInput}
            inputSize="xs"
          />
          <Button color="orange" mt={10} onClick={handleResetFilterButton}>
            Reset Filters
          </Button>
        </Box>

        <Button
          color="red"
          style={{ marginTop: 8 }}
          onClick={handleClearTaskButton}
          w={"100%"}
        >
          Clear Completed Task
        </Button>
        <Flex justify={"space-between"} mt={10}>
          <Button onClick={undoState} disabled={undoStack.length <= 1}>
            Undo
          </Button>
          <Button onClick={redoState} disabled={redoStack.length <= 1}>
            Redo
          </Button>
        </Flex>
      </div>
    </nav>
  );
};

export default MenuBar;
