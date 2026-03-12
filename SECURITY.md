# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do NOT open a public GitHub issue for security vulnerabilities.**

If you discover a security vulnerability in EasyShell, please report it responsibly:

- **Email**: [laolupaojiao@foxmail.com](mailto:laolupaojiao@foxmail.com)
- **Subject**: `[SECURITY] EasyShell - Brief description`

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Affected version(s)
- Potential impact
- Suggested fix (if any)

### Response Timeline

| Stage | Timeframe |
|-------|-----------|
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 7 days |
| Fix release (critical) | Within 14 days |
| Fix release (non-critical) | Next scheduled release |

## Security Architecture

### Authentication & Access Control

- Session-based authentication with Spring Security
- Role-based access control (Admin / User)
- All API endpoints require authentication (except login)

### Script Execution Safeguards

- **Risk assessment engine**: All scripts are evaluated before execution
  - `LOW` — Auto-execute allowed
  - `MEDIUM` — Requires user confirmation
  - `HIGH` — Requires admin approval
  - `BANNED` — Blocked, requires admin override
- **Approval workflow**: High-risk operations go through a review queue
- **Audit logging**: All operations (login, script execution, AI interactions) are recorded

### AI Security

- AI-generated scripts are subject to the same risk assessment as manual scripts
- AI cannot bypass risk controls or approval workflows
- System prompts enforce safety rules and prevent privilege escalation

### Agent Communication

- Agents connect to the server via WebSocket
- Agent registration requires a valid server address and port
- Script execution is sandboxed to the agent's host OS user permissions

## Best Practices for Deployment

1. **Change default credentials** — Update `easyshell` / `easyshell@changeme` immediately after first login
2. **Use HTTPS** — Place a reverse proxy (Nginx, Caddy) with TLS in front of EasyShell
3. **Restrict network access** — Limit who can reach the EasyShell server port
4. **Review AI model configuration** — Ensure API keys are stored securely and not exposed
5. **Regular updates** — Keep EasyShell and its dependencies up to date
6. **Monitor audit logs** — Periodically review operation logs for suspicious activity

## Scope

The following are **in scope** for security reports:

- Authentication / authorization bypass
- Remote code execution outside of intended script execution
- SQL injection, XSS, CSRF
- Sensitive data exposure (credentials, API keys)
- AI prompt injection leading to unauthorized operations
- Agent impersonation or unauthorized registration

The following are **out of scope**:

- Vulnerabilities in third-party dependencies (report to upstream)
- Denial of service via resource exhaustion (unless trivially exploitable)
- Issues requiring physical access to the server
- Social engineering

## Acknowledgments

We appreciate the security research community. Reporters of valid vulnerabilities will be credited in release notes (unless they prefer to remain anonymous).
