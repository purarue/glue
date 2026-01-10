import React from "react";
import { createRoot } from "react-dom/client";

import Computer from "./ui/computer";

import { figlet } from "./figlet";
console.log(figlet);
console.log("Source Code: https://github.com/purarue/glue");
console.log(
  "You can fetch this in your terminal as well; run 'curl -L purarue.xyz'",
);

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<Computer />);
