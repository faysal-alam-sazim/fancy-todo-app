import React from "react";
import { Box, Flex, Image } from "@mantine/core";

import LoginForm from "../components/LoginForm/LoginForm";

function LoginContainer() {
  return (
    <Flex h={"100vh"}>
      <Image src={"/login.jpg"} w={"60%"} h={"100%"} />
      <Box flex={1} pos={"relative"}>
        <LoginForm />
      </Box>
    </Flex>
  );
}

export default LoginContainer;
