import gitData from "../git_commands.json";
import kubernetesData from "../kubernetes_commands.json";
import macosData from "../macos_performance_troubleshooting_commands.json";
import postgresData from "../postgres_commands.json";

export type Command = {
  command: string;
  purpose: string;
  category: string;
  sudo: boolean;
  importance?: string;
  warning?: string;
};

type RawCommand = Omit<Command, "category">;

type RawCollection = {
  title: string;
  description: string;
  glyph: string;
  categories: Array<{ name: string; commands: RawCommand[] }>;
  workflows?: Array<{ title: string; commands: string[] }>;
};

export type CommandCollection = {
  title: string;
  description: string;
  glyph: string;
  categories: string[];
  commands: Command[];
  workflows: Array<{ title: string; commands: string[] }>;
};

const normalize = (collection: RawCollection): CommandCollection => ({
  title: collection.title,
  description: collection.description,
  glyph: collection.glyph,
  categories: collection.categories.map((category) => category.name),
  commands: collection.categories.flatMap((category) =>
    category.commands.map((command) => ({
      ...command,
      category: category.name,
    })),
  ),
  workflows: collection.workflows ?? [],
});

const macosCollection: RawCollection = {
  title: "macOS",
  description: "Performance & diagnostics",
  glyph: "⌘",
  categories: macosData.categories,
  workflows: [
    { title: "Mac feels slow", commands: macosData.quick_checks },
    { title: "High CPU process", commands: macosData.high_cpu_process_workflow },
  ],
};

export const commandCollections = [
  normalize(macosCollection),
  normalize(postgresData),
  normalize(kubernetesData),
  normalize(gitData),
];
