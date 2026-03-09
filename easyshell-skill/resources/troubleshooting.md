# EasyShell + MCP Troubleshooting

## 1) Connection Refused

**Symptoms**
- MCP calls fail immediately.
- Error similar to `ECONNREFUSED` or cannot reach `EASYSHELL_URL`.

**Checks**
1. Confirm EasyShell server container/service is running.
2. Verify `EASYSHELL_URL` points to the correct host and port (`18080`).
3. Test API reachability from the same machine as MCP process.

**Fixes**
- Start or restart the stack: `docker compose up -d`.
- Correct URL/protocol mismatch (`http` vs `https`).
- Open firewall/security-group rules for API port.

## 2) Authentication Failed

**Symptoms**
- Login-related MCP errors, unauthorized responses.

**Checks**
1. Validate `EASYSHELL_USER` and `EASYSHELL_PASS`.
2. Ensure account is active and not locked.
3. If token-based flow is used, verify token expiration.

**Fixes**
- Re-enter credentials carefully.
- Reset password in EasyShell UI if needed.
- Re-authenticate and refresh session context.

## 3) Agent Not Connecting

**Symptoms**
- Hosts remain offline in dashboard.
- `list_hosts` shows stale or disconnected status.

**Checks**
1. Agent config points to the correct server URL.
2. Managed host can reach server over network.
3. Host firewall allows outbound traffic to server.

**Fixes**
- Correct agent endpoint and restart agent service.
- Allow required egress/ingress traffic.
- Inspect agent logs for TLS/auth or DNS errors.

## 4) High-Risk Command Blocked

**Symptoms**
- Script/task enters pending approval instead of running.

**Checks**
1. Review risk-control policy level.
2. Check approval queue and audit entries.

**Fixes**
- Submit for admin approval using workflow tools (`approve_task`).
- Split script to isolate non-destructive diagnostics first.
- Avoid prohibited commands; follow platform controls.

## 5) Script Execution Timeout

**Symptoms**
- Task status becomes timeout/failed during long operations.

**Checks**
1. Current timeout value on `execute_script`.
2. Target host load and command runtime behavior.
3. Network stability between server and agent.

**Fixes**
- Increase timeout for heavy tasks.
- Break large scripts into smaller steps.
- Add progress-safe checks and retry logic where appropriate.

## 6) MCP Server Not Starting

**Symptoms**
- MCP process exits at startup.
- AI assistant cannot detect the EasyShell MCP server.

**Checks**
1. Node.js version meets requirement (`>=18`).
2. Package installation is available (`@easyshell/mcp-server`).
3. Required env vars are present: `EASYSHELL_URL`, `EASYSHELL_USER`, `EASYSHELL_PASS`.

**Fixes**
- Upgrade Node.js to supported version.
- Reinstall package and retry startup.
- Provide missing environment variables in MCP config.
