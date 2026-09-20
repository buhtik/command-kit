import commandData from "../macos_performance_troubleshooting_commands.json";
import { CommandExplorer } from "./command-explorer";

export default function Home() {
  const commands = commandData.categories.flatMap((category) =>
    category.commands.map((command) => ({
      ...command,
      category: category.name,
    })),
  );

  return (
    <CommandExplorer
      commands={commands}
      categories={commandData.categories.map((category) => category.name)}
      quickChecks={commandData.quick_checks}
      highCpuWorkflow={commandData.high_cpu_process_workflow}
    />
  );
}
