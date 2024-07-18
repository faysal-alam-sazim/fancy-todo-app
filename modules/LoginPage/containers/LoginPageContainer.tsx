import { Box, Container, Flex, Image, Title } from "@mantine/core";
import React from "react";
import LoginForm from "../components/LoginForm/LoginForm";

function LoginPageContainer() {
  return (
    <Flex h={"100vh"}>
      <Image src={"/login.jpg"} w={"60%"} h={"100%"} />
      <Box flex={1} pos={"relative"}>
        <LoginForm />
      </Box>
    </Flex>
  );
}

export default LoginPageContainer;
