export type RateLimitData = {
  "retry-after": number;
  "x-ratelimit-limit": number;
  "x-ratelimit-remaining": number;
  "x-ratelimit-reset": number;
};

export class TooManyRequests extends Error {
  constructor(
    public readonly message: string,
    public readonly ratelimit: RateLimitData
  ) {
    super(message);
  }
}
