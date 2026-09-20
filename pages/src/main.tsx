import React from "react";
import { createRoot } from "react-dom/client";
import { commandCollections } from "../../app/command-data";
import { CommandExplorer } from "../../app/command-explorer";
import "../../app/globals.css";

if (typeof document !== "undefined") {
  createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <CommandExplorer collections={commandCollections} />
    </React.StrictMode>,
  );
}
