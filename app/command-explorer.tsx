"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CommandCollection } from "./command-data";

type Props = {
  collections: CommandCollection[];
};

const emptyCollection: CommandCollection = {
  title: "Commands",
  description: "Command library",
  glyph: ">_",
  categories: [],
  commands: [],
  workflows: [],
};

const categoryGlyphs: Record<string, string> = {
  "CPU and Processes": "⌁",
  Memory: "▦",
  "Disk Space": "◫",
  "Disk and Filesystem I/O": "⇄",
  "Open Files and Process Resources": "⌘",
  Logs: "≡",
  "Power and Thermal": "ϟ",
  Network: "⌁",
  "Launch Services and Daemons": "⚙",
  Threads: "⑂",
  "System Load and Uptime": "↗",
  Spotlight: "◎",
  "APFS and Storage": "▱",
  "System Information": "i",
  "Connect and Navigate": "↪",
  "Schemas and Tables": "▦",
  "Query Workflow": "›_",
  "Activity and Locks": "⌁",
  "Size and Maintenance": "◫",
  "Backup and Restore": "⇄",
  "Roles and Databases": "◎",
  "Context and Cluster": "⌘",
  "Namespaces and Resources": "▱",
  "Pods and Workloads": "⬡",
  "Logs and Debugging": "≡",
  "Apply and Rollouts": "↗",
  Networking: "⌁",
  "Configuration and Secrets": "⚙",
  "Scale and Delete": "±",
  "Start and Configure": "＋",
  "Status and Changes": "◇",
  "Commits and History": "●",
  "Branches and Merging": "⑂",
  "Remotes and Sync": "⇄",
  "Stash and Worktrees": "▤",
  "Undo and Recover": "↶",
  "Tags and Releases": "◆",
};

export function CommandExplorer({ collections }: Props) {
  const [collectionTitle, setCollectionTitle] = useState(collections[0]?.title ?? "");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All commands");
  const [copied, setCopied] = useState<string | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const collection =
    collections.find((item) => item.title === collectionTitle) ??
    collections[0] ??
    emptyCollection;
  const { commands, categories } = collection;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (event.key === "/" && target.tagName !== "INPUT") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return commands.filter((item) => {
      const matchesCategory =
        category === "All commands" || item.category === category;
      const searchable = `${item.command} ${item.purpose} ${item.category}`.toLowerCase();
      return matchesCategory && (!needle || searchable.includes(needle));
    });
  }, [category, commands, query]);

  const copy = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1400);
  };

  const reset = () => {
    setQuery("");
    setCategory("All commands");
    searchRef.current?.focus();
  };

  const selectCollection = (title: string) => {
    setCollectionTitle(title);
    setCategory("All commands");
    setShowWorkflow(false);
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#commands" aria-label="Command Kit home">
          <span className="prompt-mark" aria-hidden="true">$_</span>
          <span>command<span className="brand-accent">kit</span></span>
        </a>

        <div className="search-shell">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search commands, problems, or categories…"
            aria-label="Search commands"
          />
          {query ? (
            <button className="clear-search" onClick={() => setQuery("")} aria-label="Clear search">×</button>
          ) : (
            <kbd>/</kbd>
          )}
        </div>

        <div className="header-status" aria-live="polite">
          <strong>{filtered.length}</strong>
          <span>{query || category !== "All commands" ? "matches" : "commands"}</span>
        </div>
      </header>

      <div className="app-shell">
        <aside className="sidebar" aria-label="Command categories">
          <div className="sidebar-heading">
            <span>Collections</span>
            <small>{collections.reduce((total, item) => total + item.commands.length, 0)} commands across {collections.length} toolkits</small>
          </div>

          <nav className="collection-nav" aria-label="Command collections">
            {collections.map((item) => (
              <button
                className={collection.title === item.title ? "active" : ""}
                key={item.title}
                onClick={() => selectCollection(item.title)}
              >
                <span>{item.glyph}</span>
                <span><b>{item.title}</b><small>{item.description}</small></span>
                <i>{item.commands.length}</i>
              </button>
            ))}
          </nav>

          <div className="category-heading">{collection.title} categories</div>

          <nav className="category-nav">
            <button
              className={category === "All commands" ? "active" : ""}
              onClick={() => setCategory("All commands")}
            >
              <span className="nav-glyph">⌘</span>
              <span>All commands</span>
              <b>{commands.length}</b>
            </button>
            {categories.map((item) => (
              <button
                className={category === item ? "active" : ""}
                key={item}
                onClick={() => setCategory(item)}
              >
                <span className="nav-glyph">{categoryGlyphs[item] ?? "›"}</span>
                <span>{item}</span>
                <b>{commands.filter((command) => command.category === item).length}</b>
              </button>
            ))}
          </nav>

          {collection.workflows.length > 0 && (
            <button className="workflow-trigger" onClick={() => setShowWorkflow(!showWorkflow)}>
              <span><b>Quick diagnostics</b><small>{collection.workflows.length} guided checklists</small></span>
              <i>{showWorkflow ? "−" : "+"}</i>
            </button>
          )}
        </aside>

        <section className="workspace" id="commands" aria-labelledby="results-title">
          <div className="results-bar">
            <div>
              <p className="context-label">
                {query ? `${collection.title.toUpperCase()} SEARCH` : category === "All commands" ? collection.description.toUpperCase() : `${collection.title.toUpperCase()} CATEGORY`}
              </p>
              <h1 id="results-title">
                {query ? <>Results for <em>“{query}”</em></> : category}
              </h1>
            </div>
            <div className="results-actions">
              <span>{filtered.length} of {commands.length}</span>
              {(query || category !== "All commands") && <button onClick={reset}>Reset</button>}
              {collection.workflows.length > 0 && (
                <button className={showWorkflow ? "active" : ""} onClick={() => setShowWorkflow(!showWorkflow)}>
                  {showWorkflow ? "Hide checks" : "Quick checks"}
                </button>
              )}
            </div>
          </div>

          <div className="mobile-collections" aria-label="Command collections">
            {collections.map((item) => (
              <button
                key={item.title}
                className={collection.title === item.title ? "active" : ""}
                onClick={() => selectCollection(item.title)}
              >
                <span>{item.glyph}</span>{item.title}<b>{item.commands.length}</b>
              </button>
            ))}
          </div>

          <div className="mobile-filters" aria-label="Category filters">
            {["All commands", ...categories].map((item) => (
              <button
                key={item}
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {showWorkflow && (
            <div className="workflow-panel">
              {collection.workflows.map((workflow) => (
                <WorkflowList key={workflow.title} title={workflow.title} commands={workflow.commands} copied={copied} onCopy={copy} />
              ))}
            </div>
          )}

          {filtered.length ? (
            <div className="command-list">
              {filtered.map((item) => (
                <article className="command-card" key={`${item.category}-${item.command}`}>
                  <div className="command-meta">
                    <span>{item.category}</span>
                    {item.importance === "high" && <mark>Recommended</mark>}
                    {item.sudo && <mark className="sudo">sudo</mark>}
                  </div>
                  <h2>{item.purpose}</h2>
                  <div className="code-row">
                    <code>{item.command}</code>
                    <button onClick={() => copy(item.command)} aria-label={`Copy ${item.command}`}>
                      <span aria-hidden="true">{copied === item.command ? "✓" : "□"}</span>
                      {copied === item.command ? "Copied" : "Copy"}
                    </button>
                  </div>
                  {item.warning && <div className="warning"><span>!</span>{item.warning}</div>}
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span>⌕</span>
              <h2>No commands match “{query}”</h2>
              <p>Try fewer words, search by the problem, or clear the category filter.</p>
              <button onClick={reset}>Show all commands</button>
            </div>
          )}
        </section>
      </div>

      <footer>
        <span><b>commandkit</b> · Engineering commands worth remembering</span>
        <a href="#commands">Back to top ↑</a>
      </footer>
    </main>
  );
}

function WorkflowList({
  title,
  commands,
  copied,
  onCopy,
}: {
  title: string;
  commands: string[];
  copied: string | null;
  onCopy: (value: string) => void;
}) {
  return (
    <div className="workflow-list">
      <h2>{title}</h2>
      <ol>
        {commands.map((item, index) => (
          <li key={item}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <code>{item}</code>
            <button onClick={() => onCopy(item)}>{copied === item ? "✓" : "Copy"}</button>
          </li>
        ))}
      </ol>
    </div>
  );
}
