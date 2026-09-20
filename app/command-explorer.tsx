"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Command = {
  command: string;
  purpose: string;
  category: string;
  sudo: boolean;
  importance?: string;
  warning?: string;
};

type Props = {
  commands: Command[];
  categories: string[];
  quickChecks: string[];
  highCpuWorkflow: string[];
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
};

export function CommandExplorer({
  commands,
  categories,
  quickChecks,
  highCpuWorkflow,
}: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All commands");
  const [copied, setCopied] = useState<string | null>(null);
  const [showWorkflow, setShowWorkflow] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

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
            <span>macOS</span>
            <small>Performance & diagnostics</small>
          </div>

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

          <button className="workflow-trigger" onClick={() => setShowWorkflow(!showWorkflow)}>
            <span><b>Quick diagnostics</b><small>Two guided checklists</small></span>
            <i>{showWorkflow ? "−" : "+"}</i>
          </button>
        </aside>

        <section className="workspace" id="commands" aria-labelledby="results-title">
          <div className="results-bar">
            <div>
              <p className="context-label">
                {query ? "SEARCH RESULTS" : category === "All commands" ? "COMMAND LIBRARY" : "CATEGORY"}
              </p>
              <h1 id="results-title">
                {query ? <>Results for <em>“{query}”</em></> : category}
              </h1>
            </div>
            <div className="results-actions">
              <span>{filtered.length} of {commands.length}</span>
              {(query || category !== "All commands") && <button onClick={reset}>Reset</button>}
              <button className={showWorkflow ? "active" : ""} onClick={() => setShowWorkflow(!showWorkflow)}>
                {showWorkflow ? "Hide checks" : "Quick checks"}
              </button>
            </div>
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
              <WorkflowList title="Mac feels slow" commands={quickChecks} copied={copied} onCopy={copy} />
              <WorkflowList title="High CPU process" commands={highCpuWorkflow} copied={copied} onCopy={copy} />
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
