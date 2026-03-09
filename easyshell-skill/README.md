# EasyShell Skill

This directory contains the EasyShell skill definition for AI assistants.
The `SKILL.md` file defines when and how an assistant should use EasyShell for
server management, script orchestration, infrastructure inspection, and Web SSH workflows.

## Install

- Manual: copy `SKILL.md` into your assistant's skills directory.
- CLI: `npx mdskills install easyshell`

### Skill paths by assistant

- OpenCode: `.opencode/skills/easyshell/SKILL.md`
- Claude Code: `.claude/skills/easyshell/SKILL.md`
- Cursor: `.cursor/skills/easyshell/SKILL.md`
- VS Code Copilot: `.github/skills/easyshell/SKILL.md`

## MCP Server Integration

For full tool access, install and configure the EasyShell MCP server:

- npm: `@easyshell/mcp-server`
- Repository: https://github.com/easyshell-ai/easyshell/tree/main/easyshell-mcp

See `resources/tool-catalog.md` for the complete tool list and usage patterns.
