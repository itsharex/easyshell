import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { homedir } from "node:os";
import process from "node:process";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { EasyShellClient } from "./client.js";
import { loadConfig } from "./config.js";
import { registerHostTools } from "./tools/host.js";
import { registerScriptTools } from "./tools/script.js";
import { registerTaskTools } from "./tools/task.js";
import { registerClusterTools } from "./tools/cluster.js";
import { registerMonitoringTools } from "./tools/monitoring.js";
import { registerInspectionTools } from "./tools/inspection.js";
import { registerAiChatTools } from "./tools/ai-chat.js";
import { registerAuditTools } from "./tools/audit.js";
import { registerNotificationTools } from "./tools/notification.js";
import { registerTagTools } from "./tools/tag.js";
import { registerKnowledgeTools } from "./tools/knowledge.js";

type InstallArgs = {
  url: string;
  user: string;
  pass: string;
};

type InstallTarget =
  | { kind: "opencode"; path: string }
  | { kind: "cursor"; path: string }
  | { kind: "claude"; path: string };

type JsonObject = Record<string, unknown>;

function parseArgs(argv: string[]): Map<string, string | boolean> {
  const parsed = new Map<string, string | boolean>();
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      parsed.set(key, next);
      i += 1;
    } else {
      parsed.set(key, true);
    }
  }
  return parsed;
}

async function loadPackageVersion(): Promise<string> {
  const npmVersion = process.env.npm_package_version?.trim();
  if (npmVersion) {
    return npmVersion;
  }

  try {
    const fileUrl = new URL("../package.json", import.meta.url);
    const text = await readFile(fileUrl, "utf-8");
    const parsed = JSON.parse(text) as { version?: unknown };
    if (typeof parsed.version === "string" && parsed.version.trim()) {
      return parsed.version;
    }
  } catch {
    return "1.0.0";
  }

  return "1.0.0";
}

function usage(): string {
  return [
    "EasyShell MCP Server",
    "",
    "Usage:",
    "  easyshell-mcp                 Start MCP server over stdio",
    "  easyshell-mcp --install       Auto-install MCP config for supported AI clients",
    "  easyshell-mcp --help          Show this help",
    "  easyshell-mcp --version       Show version",
    "",
    "Install options:",
    "  --url   EasyShell server URL (default: http://localhost:18080)",
    "  --user  EasyShell username (default: easyshell)",
    "  --pass  EasyShell password (required for install)",
  ].join("\n");
}

function detectInstallTarget(cwd: string): InstallTarget {
  const openCodePath = join(cwd, "opencode.json");
  if (existsSync(openCodePath)) {
    return { kind: "opencode", path: openCodePath };
  }

  const cursorPath = join(cwd, ".cursor", "mcp.json");
  if (existsSync(cursorPath)) {
    return { kind: "cursor", path: cursorPath };
  }

  const platform = process.platform;
  const candidates: string[] = [];

  if (platform === "darwin") {
    candidates.push(join(homedir(), "Library", "Application Support", "Claude", "claude_desktop_config.json"));
  } else if (platform === "win32") {
    const appData = process.env.APPDATA;
    if (appData) {
      candidates.push(join(appData, "Claude", "claude_desktop_config.json"));
    }
  } else {
    candidates.push(join(homedir(), ".config", "Claude", "claude_desktop_config.json"));
  }

  for (const path of candidates) {
    if (existsSync(path)) {
      return { kind: "claude", path };
    }
  }

  return { kind: "opencode", path: openCodePath };
}

function parseInstallArgs(args: Map<string, string | boolean>): InstallArgs {
  const url = (typeof args.get("url") === "string" ? (args.get("url") as string) : "http://localhost:18080").trim();
  const user = (typeof args.get("user") === "string" ? (args.get("user") as string) : "easyshell").trim();
  const pass = typeof args.get("pass") === "string" ? (args.get("pass") as string) : "";

  if (!pass.trim()) {
    throw new Error("--pass is required for --install");
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("--url must start with http:// or https://");
  }

  return {
    url: url.replace(/\/+$/, ""),
    user,
    pass,
  };
}

async function readJsonFile(path: string): Promise<JsonObject> {
  if (!existsSync(path)) {
    return {};
  }

  const raw = await readFile(path, "utf-8");
  if (!raw.trim()) {
    return {};
  }

  const parsed = JSON.parse(raw) as unknown;
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error(`Invalid JSON object in ${path}`);
  }

  return parsed as JsonObject;
}

async function writeJsonFile(path: string, data: JsonObject): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, "utf-8");
}

async function runInstall(args: Map<string, string | boolean>): Promise<void> {
  const parsed = parseInstallArgs(args);
  const target = detectInstallTarget(process.cwd());
  const config = await readJsonFile(target.path);

  const entry = {
    command: "npx",
    args: ["-y", "@easyshell/mcp-server"],
    env: {
      EASYSHELL_URL: parsed.url,
      EASYSHELL_USER: parsed.user,
      EASYSHELL_PASS: parsed.pass,
    },
  };

  if (target.kind === "opencode") {
    const mcp = (typeof config.mcp === "object" && config.mcp !== null && !Array.isArray(config.mcp)
      ? (config.mcp as JsonObject)
      : {}) as JsonObject;
    mcp.easyshell = {
      type: "local",
      ...entry,
    };
    config.mcp = mcp;
  } else {
    const mcpServers =
      typeof config.mcpServers === "object" && config.mcpServers !== null && !Array.isArray(config.mcpServers)
        ? (config.mcpServers as JsonObject)
        : {};
    mcpServers.easyshell = entry;
    config.mcpServers = mcpServers;
  }

  await writeJsonFile(target.path, config);

  console.log(`✅ EasyShell MCP configured for ${target.kind}.`);
  console.log(`Config file: ${target.path}`);
  console.log("Restart your AI client or reload MCP settings to apply changes.");
}

async function runServer(): Promise<void> {
  const config = loadConfig();
  const version = await loadPackageVersion();

  const server = new McpServer({
    name: "easyshell",
    version,
  });

  const client = new EasyShellClient(config);
  registerHostTools(server, client);
  registerScriptTools(server, client);
  registerTaskTools(server, client);
  registerClusterTools(server, client);
  registerMonitoringTools(server, client);
  registerInspectionTools(server, client);
  registerAiChatTools(server, client);
  registerAuditTools(server, client);
  registerNotificationTools(server, client);
  registerTagTools(server, client);
  registerKnowledgeTools(server, client);

  const transport = new StdioServerTransport();
  await server.connect(transport);

  process.on("SIGINT", async () => {
    await server.close();
    process.exit(0);
  });
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  if (args.has("help")) {
    console.log(usage());
    return;
  }

  if (args.has("version")) {
    console.log(await loadPackageVersion());
    return;
  }

  if (args.has("install")) {
    await runInstall(args);
    return;
  }

  await runServer();
}

void main().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("Unexpected error");
  }
  process.exit(1);
});
