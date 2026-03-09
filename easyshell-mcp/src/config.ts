export interface EasyShellConfig {
  url: string;
  username: string;
  password: string;
}

const DEFAULT_URL = "http://localhost:18080";
const DEFAULT_USER = "easyshell";

function normalizeUrl(rawUrl: string): string {
  const value = rawUrl.trim();
  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    throw new Error("EASYSHELL_URL must start with http:// or https://");
  }
  return value.replace(/\/+$/, "");
}

export function loadConfig(): EasyShellConfig {
  const rawUrl = process.env.EASYSHELL_URL?.trim() || DEFAULT_URL;
  const rawUsername = process.env.EASYSHELL_USER?.trim() || DEFAULT_USER;
  const rawPassword = process.env.EASYSHELL_PASS?.trim();

  if (!rawPassword) {
    throw new Error("EASYSHELL_PASS is required");
  }

  return {
    url: normalizeUrl(rawUrl),
    username: rawUsername,
    password: rawPassword,
  };
}
