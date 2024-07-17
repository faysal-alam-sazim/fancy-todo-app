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
import { HomePageHero } from "../components/HomePageHero/HomePageHero";

function HomePageContainer() {
  return <HomePageHero />;
}

export default HomePageContainer;
