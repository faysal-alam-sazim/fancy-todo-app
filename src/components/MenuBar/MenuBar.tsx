import { Group, Text, Button } from "@mantine/core";
import { IconFilter } from "@tabler/icons-react";
// import { MantineLogo } from "@mantinex/mantine-logo";
import classes from "./MenuBar.module.css";

function MenuBar() {
  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text>TO-DO App</Text>
          <Button>Create Task</Button>
        </Group>
        <Text className={classes.link}>
          <IconFilter className={classes.linkIcon} stroke={1.5} />
          <span>Filter</span>
        </Text>
        <Button color="red" style={{ marginTop: 8 }}>
          Clear Completed Task
        </Button>
      </div>
    </nav>
  );
}

export default MenuBar;
