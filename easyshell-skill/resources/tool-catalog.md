# EasyShell MCP Tool Catalog

This catalog covers all 19 tools exposed by `@easyshell/mcp-server`, grouped by capability tier.

## Tier 1 — Core (6 tools)

### 1) `list_hosts`
List managed hosts with status, identity, and summary metrics.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `status` | `"online" \| "offline" \| "all"` | No | Filters hosts by connectivity state. |

**Example**
```json
{"tool":"list_hosts","arguments":{"status":"online"}}
```

**Expected response**
- Array of host objects (`id`, `hostname`, `ip`, `status`, `os`, usage metrics).

### 2) `get_host_detail`
Get detailed host information, including tags and runtime details.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `hostId` | `string` | Yes | Unique host/agent ID. |

**Example**
```json
{"tool":"get_host_detail","arguments":{"hostId":"host-001"}}
```

**Expected response**
- Single host detail object with metadata, labels, and health fields.

### 3) `execute_script`
Execute shell content on one or more target hosts.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `hostIds` | `string[]` | Yes | Target host IDs for execution. |
| `script` | `string` | Yes | Shell script content to run. |
| `timeoutSec` | `number` | No | Execution timeout in seconds. |
| `name` | `string` | No | Friendly task name. |

**Example**
```json
{
  "tool":"execute_script",
  "arguments":{
    "hostIds":["host-001","host-002"],
    "script":"df -h && free -m",
    "timeoutSec":120,
    "name":"capacity-check"
  }
}
```

**Expected response**
- Task creation result (`taskId`, state, queued targets).

### 4) `get_task_detail`
Fetch per-host execution output and status for a task.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `taskId` | `string` | Yes | Task identifier returned by execution APIs. |

**Example**
```json
{"tool":"get_task_detail","arguments":{"taskId":"task-abc123"}}
```

**Expected response**
- Task object with aggregate status plus per-host logs/exit codes.

### 5) `list_scripts`
List reusable scripts in the script library.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `keyword` | `string` | No | Search by script name/content hint. |
| `page` | `number` | No | Page number for pagination. |
| `pageSize` | `number` | No | Items per page. |

**Example**
```json
{"tool":"list_scripts","arguments":{"keyword":"disk","page":1,"pageSize":20}}
```

**Expected response**
- Paginated script list with IDs, names, tags, and updated timestamps.

### 6) `ai_chat`
Send a natural-language operations goal to EasyShell AI orchestration.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `message` | `string` | Yes | Task goal in plain language. |
| `contextHostIds` | `string[]` | No | Scope AI execution to selected hosts. |
| `stream` | `boolean` | No | Request streaming response when supported. |

**Example**
```json
{
  "tool":"ai_chat",
  "arguments":{
    "message":"Check disk usage on all production hosts and flag anything above 80%"
  }
}
```

**Expected response**
- AI plan + execution summary + findings/recommendations.

## Tier 2 — Management (8 tools)

### 7) `list_recent_tasks`
List recently executed tasks across hosts.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `status` | `"running" \| "success" \| "failed" \| "all"` | No | Filter by task status. |
| `limit` | `number` | No | Maximum task count. |

**Example**
```json
{"tool":"list_recent_tasks","arguments":{"status":"failed","limit":20}}
```

**Expected response**
- Array of task summaries (`taskId`, type, status, createdAt, targets).

### 8) `create_script`
Create and save a reusable script in the library.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `name` | `string` | Yes | Script name. |
| `content` | `string` | Yes | Shell script content. |
| `description` | `string` | No | Script purpose/notes. |
| `tags` | `string[]` | No | Classification tags. |

**Example**
```json
{
  "tool":"create_script",
  "arguments":{
    "name":"Disk Usage Check",
    "content":"df -h",
    "description":"Quick filesystem usage check",
    "tags":["ops","disk"]
  }
}
```

**Expected response**
- Created script metadata with assigned `scriptId`.

### 9) `list_clusters`
List host clusters/groups used for logical targeting.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `keyword` | `string` | No | Filter clusters by name. |

**Example**
```json
{"tool":"list_clusters","arguments":{"keyword":"production"}}
```

**Expected response**
- Cluster list with IDs, names, and host counts.

### 10) `get_dashboard_stats`
Get platform-level metrics and operating overview.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `window` | `string` | No | Time window (for example `24h`, `7d`). |

**Example**
```json
{"tool":"get_dashboard_stats","arguments":{"window":"24h"}}
```

**Expected response**
- Aggregate KPIs: host totals, online rate, task volume, failure rate, load trends.

### 11) `get_host_metrics`
Retrieve CPU, memory, and disk history for one host.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `hostId` | `string` | Yes | Target host ID. |
| `from` | `string` | No | Start time (ISO-8601). |
| `to` | `string` | No | End time (ISO-8601). |
| `interval` | `string` | No | Sampling interval (`1m`, `5m`, `1h`). |

**Example**
```json
{
  "tool":"get_host_metrics",
  "arguments":{
    "hostId":"host-001",
    "from":"2025-01-01T00:00:00Z",
    "to":"2025-01-01T06:00:00Z",
    "interval":"5m"
  }
}
```

**Expected response**
- Time-series metric arrays for CPU, memory, and storage utilization.

### 12) `list_scheduled_tasks`
List configured cron inspections and automation jobs.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `enabledOnly` | `boolean` | No | Return only active schedules. |

**Example**
```json
{"tool":"list_scheduled_tasks","arguments":{"enabledOnly":true}}
```

**Expected response**
- Schedule list with cron, script target, status, and next run time.

### 13) `trigger_inspection`
Manually trigger a scheduled inspection immediately.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `scheduleId` | `string` | Yes | Scheduled inspection ID. |

**Example**
```json
{"tool":"trigger_inspection","arguments":{"scheduleId":"sched-001"}}
```

**Expected response**
- Trigger result with generated run/task ID and initial status.

### 14) `get_inspect_reports`
Read AI analysis reports from inspection runs.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `scheduleId` | `string` | No | Filter by schedule. |
| `limit` | `number` | No | Number of reports to return. |

**Example**
```json
{"tool":"get_inspect_reports","arguments":{"scheduleId":"sched-001","limit":10}}
```

**Expected response**
- Inspection reports containing findings, severity, and remediation advice.

## Tier 3 — Advanced (5 tools)

### 15) `manage_tags`
Create, update, assign, or remove host tags for targeting.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `action` | `"create" \| "delete" \| "assign" \| "unassign"` | Yes | Tag operation type. |
| `tag` | `string` | Yes | Tag label. |
| `hostIds` | `string[]` | No | Hosts for assign/unassign actions. |

**Example**
```json
{
  "tool":"manage_tags",
  "arguments":{"action":"assign","tag":"production","hostIds":["host-001"]}
}
```

**Expected response**
- Operation result with affected tags/hosts and status.

### 16) `query_audit_logs`
Query operation audit trails for security and compliance.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `actor` | `string` | No | Filter by username/operator. |
| `action` | `string` | No | Filter by action type. |
| `from` | `string` | No | Start time (ISO-8601). |
| `to` | `string` | No | End time (ISO-8601). |
| `limit` | `number` | No | Max record count. |

**Example**
```json
{
  "tool":"query_audit_logs",
  "arguments":{"action":"execute_script","limit":50}
}
```

**Expected response**
- Audit event list with actor, action, target, timestamp, and outcome.

### 17) `approve_task`
Approve or reject a blocked high-risk operation.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `approvalId` | `string` | Yes | Pending approval ID. |
| `decision` | `"approve" \| "reject"` | Yes | Approval decision. |
| `comment` | `string` | No | Optional reason or note. |

**Example**
```json
{
  "tool":"approve_task",
  "arguments":{"approvalId":"apr-1001","decision":"approve","comment":"Reviewed by ops lead"}
}
```

**Expected response**
- Approval update result and downstream task state.

### 18) `send_notification`
Send messages to configured notification channels.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `channel` | `string` | Yes | Channel key (Discord, Telegram, Slack, etc.). |
| `title` | `string` | Yes | Notification title. |
| `message` | `string` | Yes | Notification body content. |
| `severity` | `"info" \| "warning" \| "critical"` | No | Message severity level. |

**Example**
```json
{
  "tool":"send_notification",
  "arguments":{
    "channel":"discord",
    "title":"Disk Alert",
    "message":"host-001 disk usage reached 91%",
    "severity":"warning"
  }
}
```

**Expected response**
- Delivery result with channel status and provider response summary.

### 19) `search_knowledge`
Search internal runbooks, notes, and operational knowledge.

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `query` | `string` | Yes | Search query text. |
| `limit` | `number` | No | Maximum result entries. |

**Example**
```json
{"tool":"search_knowledge","arguments":{"query":"nginx 502 troubleshooting","limit":5}}
```

**Expected response**
- Ranked knowledge entries with title, snippet, and source references.
