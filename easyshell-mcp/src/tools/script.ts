import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { EasyShellClient } from "../client.js";
import { toMcpError } from "../errors.js";

type ExecuteScriptParams = {
  name: string;
  agentIds?: string[];
  clusterIds?: number[];
  tagIds?: number[];
  scriptId?: number;
  scriptContent?: string;
  timeoutSeconds?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasRiskApprovalCode(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  const code = value["code"];
  return code === 449;
}

export function registerScriptTools(server: McpServer, client: EasyShellClient) {
  server.tool(
    "list_scripts",
    "List all scripts in the script library. Includes templates and user-created scripts.",
    {},
    async () => {
      try {
        const result = await client.get("/api/v1/script/list");
        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return toMcpError(error);
      }
    }
  );

  server.tool(
    "create_script",
    "Create a new script in the script library.",
    {
      name: z.string(),
      content: z.string(),
      description: z.string().optional(),
      scriptType: z.enum(["shell", "python", "perl"]).default("shell").optional(),
    },
    async ({
      name,
      content,
      description,
      scriptType,
    }: {
      name: string;
      content: string;
      description?: string;
      scriptType?: "shell" | "python" | "perl";
    }) => {
      try {
        const result = await client.post("/api/v1/script", {
          name,
          content,
          description,
          scriptType,
        });

        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        return toMcpError(error);
      }
    }
  );

  server.tool(
    "execute_script",
    "Execute a script on one or more hosts. Returns a task ID that can be used with get_task_detail to check results. Can specify either scriptId (from library) or scriptContent (inline).",
    {
      name: z.string().describe("Task name"),
      agentIds: z.array(z.string()).optional().describe("Host IDs to execute on"),
      clusterIds: z.array(z.number()).optional().describe("Cluster IDs"),
      tagIds: z
        .array(z.number())
        .optional()
        .describe("Tag IDs — execute on all hosts with these tags"),
      scriptId: z.number().optional().describe("Script ID from library"),
      scriptContent: z.string().optional().describe("Inline script content"),
      timeoutSeconds: z.number().default(3600).optional(),
    },
    async ({
      name,
      agentIds,
      clusterIds,
      tagIds,
      scriptId,
      scriptContent,
      timeoutSeconds,
    }: ExecuteScriptParams) => {
      try {
        const result = await client.post("/api/v1/task", {
          name,
          agentIds,
          clusterIds,
          tagIds,
          scriptId,
          scriptContent,
          timeoutSeconds,
        });

        return {
          content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
        };
      } catch (error) {
        if (hasRiskApprovalCode(error)) {
          return {
            content: [{ type: "text" as const, text: JSON.stringify(error, null, 2) }],
          };
        }
        return toMcpError(error);
      }
    }
  );
}
