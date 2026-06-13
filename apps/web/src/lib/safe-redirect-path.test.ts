import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  isSafeRelativeRedirectPath,
  sanitizeRedirectPath,
} from "./safe-redirect-path";

describe("isSafeRelativeRedirectPath", () => {
  it("accepts safe relative paths", () => {
    assert.equal(isSafeRelativeRedirectPath("/app"), true);
    assert.equal(isSafeRelativeRedirectPath("/app/dashboard"), true);
    assert.equal(isSafeRelativeRedirectPath("/auth/signin?from=/app"), true);
  });

  it("rejects open redirects", () => {
    assert.equal(isSafeRelativeRedirectPath("//evil.com"), false);
    assert.equal(isSafeRelativeRedirectPath("/\\evil.com"), false);
    assert.equal(isSafeRelativeRedirectPath("https://evil.com"), false);
    assert.equal(isSafeRelativeRedirectPath(""), false);
  });
});

describe("sanitizeRedirectPath", () => {
  it("returns fallback for unsafe paths", () => {
    assert.equal(sanitizeRedirectPath("//evil.com", "/app"), "/app");
    assert.equal(sanitizeRedirectPath(null, "/app"), "/app");
  });

  it("returns safe paths unchanged", () => {
    assert.equal(
      sanitizeRedirectPath("/app/dashboard", "/app"),
      "/app/dashboard"
    );
  });
});
