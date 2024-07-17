import Link from "next/link";
import { Overlay, Container, Title, Button, Text } from "@mantine/core";

import classes from "./HomePageHero.module.css";

export function HomePageHero() {
  return (
    <div className={classes.hero}>
      <Overlay
        gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
        opacity={1}
        zIndex={0}
      />
      <Container className={classes.container} size="md">
        <Title className={classes.title}>Fancy To Do App</Title>
        <Text
          className={classes.description}
          w={"70%"}
          ta={"justify"}
          size="xl"
          mt="xl"
        >
          Effortlessly manage your tasks and boost your productivity with our
          Fancy To Do App. Whether you're organizing your daily to-do list,
          setting long-term goals, or keeping track of important deadlines, our
          app provides a seamless and intuitive experience to help you stay on
          top of your responsibilities and achieve more every day.
        </Text>

        <Link href={"/todo"}>
          <Button
            variant="gradient"
            size="xl"
            radius="xl"
            className={classes.control}
          >
            Get started
          </Button>
        </Link>
      </Container>
    </div>
  );
}
