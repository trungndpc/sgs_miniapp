# Instructions for coding agents

Read the canonical Galaxy architecture guide before making changes:

- Workspace: `../content_core/docs/SYSTEM_ARCHITECTURE.md`
- GitHub: https://github.com/trungndpc/content_core/blob/master/docs/SYSTEM_ARCHITECTURE.md

For this repository specifically:

- Send the configured tenant on every identity/content API request.
- Keep public, member-only and authenticated registration behavior distinct.
- Treat backend identity/permission decisions as authoritative.
- Render article HTML responsively and never enable arbitrary scripts or unsafe
  embeds.
- Never put secrets in `VITE_*` variables.
- Run `npm run build` before committing or deploying.
