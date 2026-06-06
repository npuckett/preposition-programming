import { execSync } from "node:child_process";
import { convertAllSketches } from "./convert-sketches.mjs";

convertAllSketches();
await import("./apply-visual-style.mjs");
execSync("npx eleventy", { stdio: "inherit" });
