import React from "react";
import {
  Overlay,
  Container,
  Title,
  Button,
  Text,
  Box,
  BackgroundImage,
  Flex,
} from "@mantine/core";

import classes from "./HomePageContainer.module.css";
import { HeroBanner } from "../components/HeroBanner/HeroBanner";

function HomeContainer() {
  return <HeroBanner />;
}

export default HomeContainer;
