import type {
  Brief,
  Day,
  Proposal,
  RegenerateTarget,
  Stay,
  Voice,
} from "./shared/proposal";
import type { ReconcileResult } from "./shared/reconcile";

type HealthResponse = {
  live: boolean;
  model: string;
};

type DraftResponse = {
  proposal: Proposal;
};

type IntroPiece = {
  title: string;
  overview: string;
};

type StaysPiece = {
  stays: Stay[];
};

type TouchesPiece = {
  accessTouches: string[];
};

export type RegeneratePiece = Day | IntroPiece | StaysPiece | TouchesPiece;

type RegenerateResponse = {
  piece: RegeneratePiece;
};

type ReconcileResponse = {
  result: ReconcileResult;
};

type ErrorPayload = {
  error?: {
    code?: unknown;
    message?: unknown;
  };
};

const NETWORK_MESSAGE =
  "The drafting service could not be reached. Please check the connection and try again.";

export class ApiError extends Error {
  code: string;

  constructor(message: string, code: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

export async function getHealth(): Promise<HealthResponse> {
  return requestJson<HealthResponse>("/api/health");
}

export async function draft(brief: Brief, voice: Voice): Promise<Proposal> {
  const response = await requestJson<DraftResponse>("/api/draft", {
    method: "POST",
    body: JSON.stringify({ brief, voice }),
  });

  return response.proposal;
}

export async function regenerate(
  brief: Brief,
  voice: Voice,
  proposal: Proposal,
  target: RegenerateTarget,
): Promise<RegeneratePiece> {
  const response = await requestJson<RegenerateResponse>("/api/regenerate", {
    method: "POST",
    body: JSON.stringify({ brief, voice, proposal, target }),
  });

  return response.piece;
}

export async function revoice(
  brief: Brief,
  voice: Voice,
  proposal: Proposal,
): Promise<Proposal> {
  const response = await requestJson<DraftResponse>("/api/revoice", {
    method: "POST",
    body: JSON.stringify({ brief, voice, proposal }),
  });

  return response.proposal;
}

export async function reconcile(statementId: string): Promise<ReconcileResult> {
  const response = await requestJson<ReconcileResponse>("/api/agents/reconcile", {
    method: "POST",
    body: JSON.stringify({ statementId }),
  });

  return response.result;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch {
    throw new ApiError(NETWORK_MESSAGE, "network");
  }

  const payload = await readJson(response);

  if (response.ok === false) {
    const { code, message } = readError(payload);
    throw new ApiError(message, code);
  }

  return payload as T;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function readError(payload: unknown): { code: string; message: string } {
  const fallback = {
    code: "unknown",
    message: "The drafting service returned an unexpected response. Please try again.",
  };

  if (isErrorPayload(payload) === false) {
    return fallback;
  }

  const code = typeof payload.error?.code === "string" ? payload.error.code : fallback.code;
  const message =
    typeof payload.error?.message === "string" ? payload.error.message : fallback.message;

  return { code, message };
}

function isErrorPayload(payload: unknown): payload is ErrorPayload {
  return typeof payload === "object" && payload !== null && "error" in payload;
}
