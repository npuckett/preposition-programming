import { exportWebEditorProjects } from "./webeditor/export-projects.mjs";

/** @deprecated Use exportWebEditorProjects — kept for Eleventy build hook. */
export function exportWebEditorSketches() {
  exportWebEditorProjects();
}
