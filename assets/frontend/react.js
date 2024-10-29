import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import Computer from "./ui/computer";

import { figlet } from "./figlet";
console.log(figlet);
console.log("Source Code: https://github.com/purarue/glue");

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Computer />);
