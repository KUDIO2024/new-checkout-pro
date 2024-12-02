export class FlowluApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'FlowluApiError';
  }
}

export class ValidationError extends FlowluApiError {
  constructor(message: string, details: Record<string, string[]>) {
    super(message, 400, details);
    this.name = 'ValidationError';
  }
}

export class RateLimitError extends FlowluApiError {
  constructor(retryAfter: number) {
    super('Rate limit exceeded. Please try again shortly.', 429, { retryAfter });
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends FlowluApiError {
  constructor() {
    super('Unable to connect to the server. Please check your internet connection.', 0);
    this.name = 'NetworkError';
  }
}

export function handleFlowluError(error: unknown): never {
  if (error instanceof FlowluApiError) {
    throw error;
  }
  
  if (error instanceof TypeError && error.message.includes('fetch')) {
    throw new NetworkError();
  }

  if (error instanceof Error && error.message.includes('validation')) {
    throw new ValidationError('Validation failed', {
      general: ['Please check your input and try again']
    });
  }
  
  throw new FlowluApiError('An unexpected error occurred');
}