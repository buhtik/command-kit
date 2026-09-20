# Command Kit

A searchable, high-signal library of terminal commands worth remembering.

The library combines macOS performance and troubleshooting commands with popular PostgreSQL, Kubernetes, and Git workflows in a fast command finder with:

- full-text search across commands, descriptions, and categories;
- keyboard-first search (`/` to focus, `Esc` to clear);
- collection and category filters with copy-to-clipboard controls;
- quick-check and high-CPU diagnostic workflows;
- `sudo`, recommended, and safety-warning indicators;
- responsive layouts for desktop and mobile.

## Content

The command library lives in the root JSON files: `macos_performance_troubleshooting_commands.json`, `postgres_commands.json`, `kubernetes_commands.json`, and `git_commands.json`. Content stays separate from the interface so the same data can later power a CLI, fzf picker, Raycast extension, or generated documentation.

Planned collections include Linux, MySQL, Docker, Ansible, networking, and OpenSSL.

## Local development

```bash
npm install
npm run dev
```

Create a production build with:

```bash
npm run build
```

Create the static GitHub Pages build with:

```bash
npm run build:pages
```

The public site is deployed from `main` by GitHub Actions.
