# Command Kit

A searchable, high-signal library of terminal commands worth remembering.

The initial release turns a structured set of 66 macOS performance and troubleshooting commands into a fast command finder with:

- full-text search across commands, descriptions, and categories;
- keyboard-first search (`/` to focus, `Esc` to clear);
- category filters and copy-to-clipboard controls;
- quick-check and high-CPU diagnostic workflows;
- `sudo`, recommended, and safety-warning indicators;
- responsive layouts for desktop and mobile.

## Content

The command library lives in `macos_performance_troubleshooting_commands.json`. Keep content separate from the interface so the same data can later power a CLI, fzf picker, Raycast extension, or generated documentation.

Planned collections include Linux, Kubernetes, PostgreSQL, MySQL, Git, Docker, Ansible, networking, and OpenSSL.

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
