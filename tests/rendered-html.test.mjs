import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const collectionFiles = [
  "macos_performance_troubleshooting_commands.json",
  "postgres_commands.json",
  "kubernetes_commands.json",
  "git_commands.json",
];

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the command library and collection switcher", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /commandkit/i);
  assert.match(html, /Collections/);
  assert.match(html, /macOS/);
  assert.match(html, /PostgreSQL/);
  assert.match(html, /Kubernetes/);
  assert.match(html, />Git</);
  assert.match(html, /top -o cpu/);
  assert.match(html, /<strong>66<\/strong><span>commands<\/span>/);
});

test("all command collections contain categorized, unique commands", async () => {
  const collections = await Promise.all(
    collectionFiles.map(async (file) => ({
      file,
      data: JSON.parse(await readFile(new URL(file, root), "utf8")),
    })),
  );

  let totalCommands = 0;

  for (const { file, data } of collections) {
    assert.ok(data.title, `${file} needs a title`);
    assert.ok(data.categories.length > 0, `${file} needs categories`);

    const commands = data.categories.flatMap((category) => {
      assert.ok(category.name, `${file} has an unnamed category`);
      assert.ok(category.commands.length > 0, `${category.name} is empty`);
      return category.commands;
    });
    const commandText = commands.map((command) => command.command);

    assert.equal(new Set(commandText).size, commandText.length, `${file} has duplicate commands`);
    for (const command of commands) {
      assert.equal(typeof command.command, "string");
      assert.equal(typeof command.purpose, "string");
      assert.equal(typeof command.sudo, "boolean");
    }
    totalCommands += commands.length;
  }

  assert.equal(totalCommands, 172);
});
