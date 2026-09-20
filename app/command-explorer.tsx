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
  const [showWorkflow, setShowWorkflow] = useState(true);
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

  const applyCategory = (value: string) => {
    setCategory(value);
    document.getElementById("library")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Command Kit home">
          <span className="prompt-mark" aria-hidden="true">$_</span>
          <span>command<span className="brand-accent">kit</span></span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#library">Library</a>
          <a href="#workflow">Workflows</a>
          <a href="#about">About</a>
        </nav>
        <div className="status-pill"><span /> {commands.length} commands</div>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow"><span>///</span> YOUR ENGINEERING COMMAND LIBRARY</div>
        <h1>Find the command.<br /><em>Keep moving.</em></h1>
        <p className="hero-copy">
          The high-signal commands you reach for when systems get weird—collected,
          explained, and ready to copy.
        </p>
        <div className="search-shell">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “memory pressure”, “process logs”, or “disk usage”"
            aria-label="Search commands"
          />
          <kbd>/</kbd>
        </div>
        <div className="search-hints">
          <span>Popular:</span>
          {["high cpu", "memory", "network", "logs"].map((term) => (
            <button key={term} onClick={() => setQuery(term)}>{term}</button>
          ))}
        </div>
      </section>

      <section className="category-section" aria-labelledby="category-title">
        <div className="section-heading">
          <div>
            <span className="section-index">01</span>
            <h2 id="category-title">Browse by category</h2>
          </div>
          <p>macOS · performance & diagnostics</p>
        </div>
        <div className="category-grid">
          {categories.map((item) => {
            const count = commands.filter((command) => command.category === item).length;
            return (
              <button
                className={category === item ? "category-card active" : "category-card"}
                key={item}
                onClick={() => applyCategory(item)}
              >
                <span className="category-glyph" aria-hidden="true">{categoryGlyphs[item] ?? "›"}</span>
                <span>
                  <strong>{item}</strong>
                  <small>{count} commands</small>
                </span>
                <b aria-hidden="true">↗</b>
              </button>
            );
          })}
        </div>
      </section>

      <section className="workflow" id="workflow" aria-labelledby="workflow-title">
        <div className="workflow-intro">
          <span className="section-index">02</span>
          <p className="mini-label">QUICK WORKFLOW</p>
          <h2 id="workflow-title">Mac feels slow?</h2>
          <p>Start with these checks. They cover load, memory, storage, I/O, power, and thermals.</p>
          <button className="text-button" onClick={() => setShowWorkflow(!showWorkflow)}>
            {showWorkflow ? "Hide workflow" : "Show workflow"} <span>→</span>
          </button>
        </div>
        {showWorkflow && (
          <ol className="workflow-steps">
            {quickChecks.map((item, index) => (
              <li key={item}>
                <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
                <code>{item}</code>
                <button onClick={() => copy(item)} aria-label={`Copy ${item}`}>
                  {copied === item ? "Copied" : "Copy"}
                </button>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section className="library" id="library" aria-labelledby="library-title">
        <div className="section-heading library-heading">
          <div>
            <span className="section-index">03</span>
            <h2 id="library-title">Command library</h2>
          </div>
          <div className="result-controls">
            <span>{filtered.length} results</span>
            {category !== "All commands" && (
              <button onClick={() => setCategory("All commands")}>Clear category ×</button>
            )}
          </div>
        </div>

        <div className="active-filters" aria-label="Category filters">
          {["All commands", ...categories].map((item) => (
            <button
              key={item}
              className={category === item ? "selected" : ""}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filtered.length ? (
          <div className="command-list">
            {filtered.map((item) => (
              <article className="command-card" key={`${item.category}-${item.command}`}>
                <div className="command-meta">
                  <span>{item.category}</span>
                  {item.importance === "high" && <mark>Recommended</mark>}
                  {item.sudo && <mark className="sudo">sudo</mark>}
                </div>
                <h3>{item.purpose}</h3>
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
            <h3>No command found</h3>
            <p>Try a shorter phrase or search by what you want to diagnose.</p>
            <button onClick={() => { setQuery(""); setCategory("All commands"); }}>Reset search</button>
          </div>
        )}
      </section>

      <section className="about" id="about">
        <div>
          <span className="mini-label">BUILT FOR RECALL</span>
          <h2>Your second brain,<br />one command at a time.</h2>
        </div>
        <div>
          <p>This is not another exhaustive manual. It is a practical, searchable shelf for the commands worth remembering—the ones you have already needed in real work.</p>
          <p className="roadmap">Next shelves: Linux · Kubernetes · PostgreSQL · MySQL · Git · Docker · Ansible · OpenSSL</p>
        </div>
        <div className="cpu-workflow">
          <strong>High-CPU path</strong>
          {highCpuWorkflow.map((item, index) => <code key={item}>{index + 1}. {item}</code>)}
        </div>
      </section>

      <footer>
        <a className="brand" href="#top"><span className="prompt-mark">$_</span> command<span className="brand-accent">kit</span></a>
        <p>Made for engineers who would rather fix the system than search for the command.</p>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
