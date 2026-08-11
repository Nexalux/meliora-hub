import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import api, { AUTH_EXPIRED_EVENT } from "./client";

function response({ body = {}, ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(body),
  };
}

describe("API client", () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });

  it("adds the saved JWT to authenticated requests", async () => {
    localStorage.setItem("mh_token", "saved-token");
    fetch.mockResolvedValue(response({ body: { success: true } }));

    await api.get("/private");

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/private"),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer saved-token",
        }),
      })
    );
  });

  it("does not add authentication to public requests", async () => {
    localStorage.setItem("mh_token", "saved-token");
    fetch.mockResolvedValue(response());

    await api.get("/public", { auth: false });

    const requestOptions = fetch.mock.calls[0][1];
    expect(requestOptions.headers.Authorization).toBeUndefined();
  });

  it("clears an expired session and announces it once", async () => {
    localStorage.setItem("mh_token", "expired-token");
    localStorage.setItem("mh_user", "{}");
    fetch.mockResolvedValue(
      response({
        ok: false,
        status: 401,
        body: { message: "Expired token." },
      })
    );
    const expiredHandler = vi.fn();
    globalThis.addEventListener(AUTH_EXPIRED_EVENT, expiredHandler);

    await expect(api.get("/private")).rejects.toMatchObject({
      message: "Expired token.",
      status: 401,
    });

    expect(localStorage.getItem("mh_token")).toBeNull();
    expect(localStorage.getItem("mh_user")).toBeNull();
    expect(expiredHandler).toHaveBeenCalledTimes(1);

    globalThis.removeEventListener(AUTH_EXPIRED_EVENT, expiredHandler);
  });

  it("clears JWT failures returned by WordPress as forbidden", async () => {
    localStorage.setItem("mh_token", "expired-token");
    localStorage.setItem("mh_user", "{}");
    fetch.mockResolvedValue(
      response({
        ok: false,
        status: 403,
        body: {
          code: "jwt_auth_invalid_token",
          message: "Invalid token.",
        },
      })
    );

    await expect(api.get("/private")).rejects.toMatchObject({
      status: 403,
    });

    expect(localStorage.getItem("mh_token")).toBeNull();
    expect(localStorage.getItem("mh_user")).toBeNull();
  });
});
