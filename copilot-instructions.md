# Copilot Coding Agent Instructions for CozyCritters

Welcome to the Copilot coding agent setup guide for CozyCritters! This document helps Copilot and contributors understand how to automate, review, and contribute code effectively using Copilot's coding agent.

## 🛠️ Coding Agent Setup

- **Automation Scope:** The coding agent is permitted to propose, create, and update Docker configuration, deployment files, CI/CD workflows, documentation, and community forum features. It may also assist with the main CozyCritters source code and dependencies.
- **Review Process:** All PRs created by Copilot coding agent should be reviewed by a human maintainer before merging.
- **Safe Operations:** The agent should avoid destructive operations (e.g., deleting data, changing production credentials) unless explicitly requested and reviewed.

## 🐳 Docker & Self-Hosting

- The coding agent should:
  - Generate a `Dockerfile` suitable for building CozyCritters.
  - Create a `docker-compose.yml` for multi-container orchestration (e.g., database, app).
  - Use modern `docker compose` syntax (not legacy `docker-compose`) in all documentation and scripts.
  - Include cleanup instructions (`docker compose down`, `docker container prune`, `docker network prune`) in deployment guides.
  - Document environment variables, persistent storage, and network requirements in `README.md`.

## 📝 Documentation Standards

- Any changes to config, deployment, environment variables, or forum features must be reflected in documentation.
- Forum feature changes must be documented in `FORUMS.md` with appropriate sections updated.
- PRs should include an explanation of changes and testing instructions.

## ✅ Testing & Linting

- Ensure all generated code passes existing linters and tests.
- If new dependencies or configurations are added, update test scripts accordingly.

## 🏛️ Community Forums

- **Forum Architecture:** The coding agent should understand that CozyCritters includes comprehensive community forums built with a phpBB-inspired interface and modern privacy protections.
- **Key Technical Features:**
  - **Local Storage Architecture**: All forum posts stored in browser localStorage for privacy
  - **Peer-to-Peer Sync**: Community data shared without central servers
  - **Progressive Web App**: Offline functionality and native app installation
  - **TypeScript Safety**: Full type checking for forum components
  - **Anonymous Interaction**: Random animal names generated for each session

### 🎯 Forum-Specific Development Guidelines

- **Privacy-First Design:** Never implement features that could compromise user anonymity or store personal data on servers
- **Neurodivergent-Friendly Features:** Maintain accessibility standards including:
  - Keyboard navigation for all forum functions
  - Screen reader compatibility with proper ARIA labels
  - Customizable text sizes and color contrasts
  - Reduced motion options for sensory sensitivity
- **Theme Support:** Preserve existing theme system (Classic Light, Dark Mode, Autism Awareness)
- **Moderation System:** Maintain community-driven moderation with educational approach and appeal process
- **Content Standards:** Ensure all forum features support neurodivergent experiences and inclusive language

### 🛠️ Forum Component Development

- **Forum Components:** When working with `client/src/components/community-forum.tsx` and related files:
  - Preserve phpBB-style interface design patterns
  - Maintain anonymous posting functionality with animal name generation
  - Keep moderation features (hide/pin posts, role management)
  - Ensure forum management (create boards, topics) works for admin users
- **Data Management:** Maintain localStorage-based persistence and avoid server-side storage
- **Testing:** Update forum-related tests in `client/src/components/community-forum.test.ts` when making changes

### 📚 Forum Documentation Alignment

- **FORUMS.md Integration:** Any forum feature changes must be reflected in the comprehensive `FORUMS.md` guide
- **Community Guidelines:** Ensure all forum features align with neurodivergent-friendly community standards
- **Getting Started Experience:** Maintain the guided onboarding process for new forum users

## 🧑‍💻 PR & Issue Guidance

- PR titles must be descriptive and concise.
- Include references to related issues (by URL or number).
- Use labels such as `docker`, `deployment`, `documentation`, `forum`, `accessibility`, etc., where appropriate.

## ⚠️ Limitations & Boundaries

- Do not commit secrets, credentials, or sensitive configuration.
- Do not remove critical files or disable core features.
- Do not implement forum features that compromise user anonymity or privacy.
- Do not add server-side storage for forum content - maintain localStorage-only architecture.

---

For questions or improvements to these instructions, open an issue or discuss with the maintainers!