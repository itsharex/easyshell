export class EasyShellError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  public constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = "EasyShellError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

type HttpBody = {
  message?: unknown;
};

function getMessageFromBody(body: unknown, fallback: string): string {
  if (typeof body === "object" && body !== null) {
    const candidate = (body as HttpBody).message;
    if (typeof candidate === "string" && candidate.trim().length > 0) {
      return candidate;
    }
  }

  return fallback;
}

export function mapHttpError(status: number, body: unknown): EasyShellError {
  if (status === 401) {
    return new EasyShellError(
      getMessageFromBody(body, "Authentication expired. Please verify credentials and retry."),
      status,
      "AUTH_EXPIRED",
    );
  }

  if (status === 403) {
    return new EasyShellError(
      getMessageFromBody(body, "Forbidden. You do not have permission for this operation."),
      status,
      "FORBIDDEN",
    );
  }

  if (status === 404) {
    return new EasyShellError(
      getMessageFromBody(body, "Resource not found."),
      status,
      "NOT_FOUND",
    );
  }

  if (status === 449) {
    return new EasyShellError(
      getMessageFromBody(body, "Operation requires approval before execution."),
      status,
      "APPROVAL_REQUIRED",
    );
  }

  if (status >= 500) {
    return new EasyShellError(
      getMessageFromBody(body, "EasyShell server error. Please retry later."),
      status,
      "SERVER_ERROR",
    );
  }

  return new EasyShellError(
    getMessageFromBody(body, `HTTP ${status} request failed.`),
    status,
    "HTTP_ERROR",
  );
}

export function toMcpError(error: unknown): {
  content: Array<{ type: "text"; text: string }>;
  isError: true;
} {
  if (error instanceof EasyShellError) {
    return {
      content: [
        {
          type: "text",
          text: `[${error.code}] ${error.message}`,
        },
      ],
      isError: true,
    };
  }

  if (error instanceof Error) {
    return {
      content: [
        {
          type: "text",
          text: error.message,
        },
      ],
      isError: true,
    };
  }

  return {
    content: [
      {
        type: "text",
        text: "Unknown error occurred.",
      },
    ],
    isError: true,
  };
}
