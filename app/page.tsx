import { commandCollections } from "./command-data";
import { CommandExplorer } from "./command-explorer";

export default function Home() {
  return <CommandExplorer collections={commandCollections} />;
}
