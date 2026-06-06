import fs from "node:fs";
import path from "node:path";
import { projectName } from "./constants.mjs";

function makeId() {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Build a flat p5 Web Editor `files` array from relative path → content map.
 * Supports one level of nesting (e.g. shared/palette.js).
 */
export function buildFilesPayload(fileMap) {
  const rootId = makeId();
  const files = [];
  const rootChildren = [];
  const folders = new Map();

  const sortedPaths = Object.keys(fileMap).sort((a, b) => {
    const depthA = a.split("/").length;
    const depthB = b.split("/").length;
    if (depthA !== depthB) return depthA - depthB;
    return a.localeCompare(b);
  });

  for (const filePath of sortedPaths) {
    const content = fileMap[filePath];
    const parts = filePath.split("/");

    if (parts.length === 1) {
      const id = makeId();
      rootChildren.push(id);
      files.push({
        name: parts[0],
        content,
        id,
        _id: id,
        fileType: "file",
        children: [],
        ...(parts[0] === "sketch.js" ? { isSelectedFile: true } : {}),
      });
      continue;
    }

    if (parts.length !== 2) {
      throw new Error(`Unsupported path depth (max one folder level): ${filePath}`);
    }

    const [folderName, fileName] = parts;
    if (!folders.has(folderName)) {
      const folderId = makeId();
      folders.set(folderName, { id: folderId, children: [] });
      rootChildren.push(folderId);
      files.push({
        name: folderName,
        id: folderId,
        _id: folderId,
        fileType: "folder",
        children: [],
      });
    }

    const fileId = makeId();
    folders.get(folderName).children.push(fileId);
    files.push({
      name: fileName,
      content,
      id: fileId,
      _id: fileId,
      fileType: "file",
      children: [],
    });
  }

  for (const [, folder] of folders) {
    const entry = files.find((f) => f.id === folder.id);
    entry.children = folder.children;
  }

  files.unshift({
    name: "root",
    id: rootId,
    _id: rootId,
    fileType: "folder",
    children: rootChildren,
  });

  return files;
}

export function readProjectFiles(projectDir) {
  const fileMap = {};
  const entries = fs.readdirSync(projectDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.name === "meta.json") continue;
    const fullPath = path.join(projectDir, entry.name);

    if (entry.isFile()) {
      fileMap[entry.name] = fs.readFileSync(fullPath, "utf8");
      continue;
    }

    if (entry.isDirectory()) {
      for (const nested of fs.readdirSync(fullPath)) {
        const nestedPath = path.join(fullPath, nested);
        if (fs.statSync(nestedPath).isFile()) {
          fileMap[`${entry.name}/${nested}`] = fs.readFileSync(nestedPath, "utf8");
        }
      }
    }
  }

  return fileMap;
}

export function buildProjectPayload({ slug, title, projectDir }) {
  const fileMap = readProjectFiles(projectDir);
  return {
    slug,
    title,
    name: projectName(title),
    files: buildFilesPayload(fileMap),
  };
}
