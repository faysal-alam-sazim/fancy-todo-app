import React, { useState } from "react";
import { useRouter } from "next/router";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Box,
  Button,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import classes from "./LoginForm.module.css";

import { TLoginCredentials } from "@/shared/typedefs/types";

function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TLoginCredentials>({
    mode: "onChange",
  });

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "Password must be minimum 6 characters long!";
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{6,}$/;
    return (
      regex.test(password) ||
      "Password must contain at least one uppercase, lowercase and a special character!"
    );
  };

  const onSubmit: SubmitHandler<TLoginCredentials> = (data) => {
    if (data.email === "faysal.alam@sazim.io" && data.password === "Aa123@") {
      setErrorMessage(null);
      return router.push("/todo");
    } else {
      setErrorMessage("Invalid email & password!");
    }
  };

  return (
    <Box className={classes.center}>
      <Title ta={"center"} mb={30} c={"blue"}>
        Please Login Here!
      </Title>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Controller
          name="email"
          control={control}
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <TextInput
              {...field}
              placeholder="email"
              type="email"
              label="Email"
              error={errors.email?.message}
              withAsterisk
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            validate: validatePassword,
            required: "Password is required",
          }}
          render={({ field }) => (
            <PasswordInput
              label="Password"
              placeholder="password"
              {...field}
              error={errors.password?.message}
              withAsterisk
            />
          )}
        />
        <Button type="submit">Login</Button>
        <Text c={"red"}>{errorMessage}</Text>
      </form>
    </Box>
  );
}

export default LoginForm;
