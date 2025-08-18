# Copilot Coding Agent Instructions for CozyCritters

Welcome to the Copilot coding agent setup guide for CozyCritters! This document helps Copilot and contributors understand how to automate, review, and contribute code effectively using Copilot's coding agent.

## 🛠️ Coding Agent Setup

- **Automation Scope:** The coding agent is permitted to propose, create, and update Docker configuration, deployment files, CI/CD workflows, and documentation. It may also assist with the main CozyCritters source code and dependencies.
- **Review Process:** All PRs created by Copilot coding agent should be reviewed by a human maintainer before merging.
- **Safe Operations:** The agent should avoid destructive operations (e.g., deleting data, changing production credentials) unless explicitly requested and reviewed.

## 🐳 Docker & Self-Hosting

- The coding agent should:
  - Generate a `Dockerfile` suitable for building CozyCritters.
  - Create a `docker-compose.yml` for multi-container orchestration (e.g., database, app).
  - Document environment variables, persistent storage, and network requirements in `README.md`.

## 📝 Documentation Standards

- Any changes to config, deployment, or environment variables must be reflected in documentation.
- PRs should include an explanation of changes and testing instructions.

## ✅ Testing & Linting

- Ensure all generated code passes existing linters and tests.
- If new dependencies or configurations are added, update test scripts accordingly.

## 🧑‍💻 PR & Issue Guidance

- PR titles must be descriptive and concise.
- Include references to related issues (by URL or number).
- Use labels such as `docker`, `deployment`, `documentation`, etc., where appropriate.

## ⚠️ Limitations & Boundaries

- Do not commit secrets, credentials, or sensitive configuration.
- Do not remove critical files or disable core features.

---

For questions or improvements to these instructions, open an issue or discuss with the maintainers!

````I need to know the exact content you want included in copilot-instructions.md. Here’s a suggested version based on Copilot agent best practices and Docker support for CozyCritters:

````markdown name=copilot-instructions.md
# Copilot Coding Agent Instructions for CozyCritters

Welcome to the Copilot coding agent setup guide for CozyCritters! This document helps Copilot and contributors understand how to automate, review, and contribute code effectively using Copilot's coding agent.

## 🛠️ Coding Agent Setup

- **Automation Scope:** The coding agent is permitted to propose, create, and update Docker configuration, deployment files, CI/CD workflows, and documentation. It may also assist with the main CozyCritters source code and dependencies.
- **Review Process:** All PRs created by Copilot coding agent should be reviewed by a human maintainer before merging.
- **Safe Operations:** The agent should avoid destructive operations (e.g., deleting data, changing production credentials) unless explicitly requested and reviewed.

## 🐳 Docker & Self-Hosting

- The coding agent should:
  - Generate a `Dockerfile` suitable for building CozyCritters.
  - Create a `docker-compose.yml` for multi-container orchestration (e.g., database, app).
  - Document environment variables, persistent storage, and network requirements in `README.md`.

## 📝 Documentation Standards

- Any changes to config, deployment, or environment variables must be reflected in documentation.
- PRs should include an explanation of changes and testing instructions.

## ✅ Testing & Linting

- Ensure all generated code passes existing linters and tests.
- If new dependencies or configurations are added, update test scripts accordingly.

## 🧑‍💻 PR & Issue Guidance

- PR titles must be descriptive and concise.
- Include references to related issues (by URL or number).
- Use labels such as `docker`, `deployment`, `documentation`, etc., where appropriate.

## ⚠️ Limitations & Boundaries

- Do not commit secrets, credentials, or sensitive configuration.
- Do not remove critical files or disable core features.

---

For questions or improvements to these instructions, open an issue or discuss with the maintainers!
