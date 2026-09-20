import React from "react";
import { createRoot } from "react-dom/client";
import commandData from "../../macos_performance_troubleshooting_commands.json";
import { CommandExplorer } from "../../app/command-explorer";
import "../../app/globals.css";

const commands = commandData.categories.flatMap((category) =>
  category.commands.map((command) => ({
    ...command,
    category: category.name,
  })),
);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CommandExplorer
      commands={commands}
      categories={commandData.categories.map((category) => category.name)}
      quickChecks={commandData.quick_checks}
      highCpuWorkflow={commandData.high_cpu_process_workflow}
    />
  </React.StrictMode>,
);
