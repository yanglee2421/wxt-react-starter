#!/usr/bin/env node
import addon from "@yanglee2421/cpp-addon";
import timers from "node:timers";
import { main } from "./main";

main();

const test = async () => {
  const opened = addon.TOFD_PORT_OpenDevice();
  console.log("TOFD_PORT_OpenDevice:", opened);
  await timers.promises.setTimeout(1000 * 5);
  const closed = addon.TOFD_PORT_CloseDevice();
  console.log("TOFD_PORT_CloseDevice:", closed);
};

test();
