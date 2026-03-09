# EasyShell Deployment Guide

This guide covers deployment and operational setup for EasyShell and MCP usage.

## 1) Docker Compose Quick Start

```bash
git clone https://github.com/easyshell-ai/easyshell.git
cd easyshell
cp .env.example .env
docker compose up -d
```

Default login:
- Web: `http://localhost:18880`
- Username: `easyshell`
- Password: `easyshell@changeme`

## 2) Environment Variables (`.env`)

Typical settings to review before first boot:

| Variable | Purpose | Example |
|---|---|---|
| `MYSQL_ROOT_PASSWORD` | MySQL root password | `change-me` |
| `MYSQL_DATABASE` | App database name | `easyshell` |
| `MYSQL_USER` | App database user | `easyshell` |
| `MYSQL_PASSWORD` | App database password | `change-me` |
| `REDIS_PASSWORD` | Redis auth password | `change-me` |
| `JWT_SECRET` | Authentication signing secret | `replace-with-long-random-secret` |
| `EASYSHELL_SERVER_IMAGE` | Server image override | `laolupaojiao/easyshell-server:latest` |
| `EASYSHELL_WEB_IMAGE` | Web image override | `laolupaojiao/easyshell-web:latest` |

For MCP server usage, configure your assistant with:
- `EASYSHELL_URL`
- `EASYSHELL_USER`
- `EASYSHELL_PASS`

## 3) Port Mapping

| Component | Default Port | Notes |
|---|---:|---|
| EasyShell Server API | `18080` | REST API endpoint for UI and MCP |
| EasyShell Web UI | `18880` | Browser access |
| MySQL | `13306` | Internal data store |
| Redis | `16379` | Cache/session/queue support |

Ensure host firewalls and cloud security groups allow required ingress.

## 4) Agent Deployment on Managed Hosts

1. Add host entries in EasyShell Web.
2. Download or copy the EasyShell Agent binary for target OS.
3. Configure agent with server URL and host token/credentials.
4. Start agent as a background service (systemd recommended on Linux).
5. Confirm host appears online in `list_hosts` and dashboard.

Recommended:
- Use least-privilege runtime users.
- Restrict outbound network egress to required endpoints.
- Keep agent versions aligned with server releases.

## 5) AI Model Configuration

EasyShell supports multiple model providers for script generation and analysis:

- OpenAI
- Gemini
- GitHub Copilot
- Custom OpenAI-compatible API

Setup checklist:
1. Add provider endpoint and API key in system AI settings.
2. Select default model and token limits.
3. Validate with a non-destructive test prompt.
4. Set fallback provider if high availability is required.

## 6) Production Considerations

### SSL/TLS
- Terminate TLS with Nginx, Caddy, or cloud load balancer.
- Enforce HTTPS and redirect HTTP.

### Reverse Proxy
- Route Web and API paths cleanly.
- Preserve WebSocket upgrade headers for terminal and streaming logs.

### Backup and Recovery
- Schedule regular MySQL backups (logical + periodic snapshot).
- Backup Redis if persistence is enabled for your setup.
- Version-control `.env` templates (without secrets) and deployment manifests.
- Test restore procedures regularly.

### Security hardening
- Rotate default credentials immediately.
- Store secrets in a secret manager, not plain files.
- Enable strict firewall and network segmentation.
- Review audit logs and approval workflows continuously.
